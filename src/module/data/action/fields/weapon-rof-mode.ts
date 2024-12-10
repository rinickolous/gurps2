import fields = foundry.data.fields
import { Int, StringBuilder, TooltipGURPS, feature, i18n, wswitch } from "@util"
import { WeaponField } from "./weapon-field.ts"
import { BaseAttack } from "../base-attack.ts"
import { ToggleableBooleanField, ToggleableNumberField } from "@data/fields/index.ts"

class WeaponROFMode extends WeaponField<WeaponROFModeSchema, BaseAttack> {
	static override defineSchema(): WeaponROFModeSchema {
		return {
			shotsPerAttack: new ToggleableNumberField({
				required: true,
				nullable: false,
				initial: 1,
			}),
			secondaryProjectiles: new ToggleableNumberField({
				required: true,
				nullable: false,
				initial: 0,
			}),
			fullAutoOnly: new ToggleableBooleanField({ required: true, nullable: false, initial: false }),
			highCyclicControlledBursts: new ToggleableBooleanField({
				required: true,
				nullable: false,
				initial: false,
			}),
		}
	}

	static override fromString(s: string): WeaponROFMode {
		const wr = new WeaponROFMode().toObject()
		s = s.replaceAll(" ", "").toLowerCase().replaceAll(".", "x")
		wr.fullAutoOnly = s.includes("!")
		s = s.replaceAll("!", "")
		wr.highCyclicControlledBursts = s.includes("#")
		s = s.replaceAll("#", "").replaceAll("×", "x")
		if (s.startsWith("x")) {
			s = "1" + s
		}
		const parts = s.split("x")
		;[wr.shotsPerAttack] = Int.extract(s)
		if (parts.length > 1) {
			;[wr.secondaryProjectiles] = Int.extract(parts[1])
		}
		return new WeaponROFMode(wr)
	}

	override toString(): string {
		if (this.shotsPerAttack <= 0) return ""
		const buffer = new StringBuilder()
		buffer.push(this.shotsPerAttack.toString())
		if (this.secondaryProjectiles > 0) {
			buffer.push("x", this.secondaryProjectiles.toString())
		}
		if (this.fullAutoOnly) buffer.push("!")
		if (this.highCyclicControlledBursts) buffer.push("#")
		return buffer.toString()
	}

	// Tooltip returns a tooltip for the data, if any. Call .resolve() prior to calling this method if you want the tooltip
	// to be based on the resolved values.
	override tooltip(_w: BaseAttack): string {
		if (
			this.shotsPerAttack <= 0 ||
			(this.secondaryProjectiles <= 0 && !this.fullAutoOnly && !this.highCyclicControlledBursts)
		)
			return ""
		const tooltip = new TooltipGURPS()
		if (this.secondaryProjectiles > 0) {
			const shotsText =
				this.shotsPerAttack === 1
					? i18n.localize("GURPS.Weapon.ShotsSingular")
					: i18n.localize("GURPS.Weapon.ShotsPlural")

			const projectilesText =
				this.secondaryProjectiles === 1
					? i18n.localize("GURPS.Weapon.ProjectilesSingular")
					: i18n.localize("GURPS.Weapon.ProjectilesPlural")

			tooltip.push(
				i18n.format(i18n.localize("GURPS.Tooltip.ROFModeSecondaryProjectiles"), {
					shotsCount: this.shotsPerAttack,
					shotsText,
					projectilesCount: this.secondaryProjectiles,
					projectilesText,
				}),
			)
		}

		if (this.fullAutoOnly)
			tooltip.appendToNewLine(
				i18n.format(i18n.localize("GURPS.Tooltip.ROFModeFullAutoOnly"), {
					min: Math.ceil(this.shotsPerAttack / 4),
				}),
			)

		if (this.highCyclicControlledBursts)
			tooltip.appendToNewLine(i18n.localize("GURPS.Tooltip.ROFModeHighCyclicControlledBursts"))

		return tooltip.toString()
	}

	override resolve(w: BaseAttack, tooltip: TooltipGURPS, firstMode: boolean): WeaponROFMode {
		const result = this.toObject()
		const [shotsFeature, secondaryFeature] = firstMode
			? [feature.Type.WeaponRofMode1ShotsBonus, feature.Type.WeaponRofMode1SecondaryBonus]
			: [feature.Type.WeaponRofMode2ShotsBonus, feature.Type.WeaponRofMode2SecondaryBonus]

		if (firstMode) {
			this.fullAutoOnly = w.resolveBoolFlag(wswitch.Type.FullAuto1, this.fullAutoOnly)
			this.highCyclicControlledBursts = w.resolveBoolFlag(
				wswitch.Type.ControlledBursts1,
				this.highCyclicControlledBursts,
			)
		} else {
			this.fullAutoOnly = w.resolveBoolFlag(wswitch.Type.FullAuto2, this.fullAutoOnly)
			this.highCyclicControlledBursts = w.resolveBoolFlag(
				wswitch.Type.ControlledBursts2,
				this.highCyclicControlledBursts,
			)
		}
		let [percentSPA, percentSP] = [0, 0]
		for (const bonus of w.collectWeaponBonuses(1, tooltip, shotsFeature, secondaryFeature)) {
			const amt = bonus.adjustedAmountForWeapon(w)
			switch (bonus.type) {
				case shotsFeature:
					if (bonus.percent) percentSPA += amt
					else result.shotsPerAttack += amt
					break
				case secondaryFeature:
					if (bonus.percent) percentSP += amt
					else result.secondaryProjectiles += amt
			}
		}

		if (percentSPA !== 0) result.shotsPerAttack += Math.trunc((result.shotsPerAttack * percentSPA) / 100)
		if (percentSP !== 0) result.secondaryProjectiles += Math.trunc((result.secondaryProjectiles * percentSP) / 100)
		return new WeaponROFMode(result)
	}

	static cleanData(
		source?: Partial<foundry.abstract.DataModel.ConstructorDataFor<WeaponROFMode>>,
		options?: Parameters<fields.SchemaField.Any["clean"]>[1],
	): object {
		let {
			shotsPerAttack,
			secondaryProjectiles,
			fullAutoOnly,
			highCyclicControlledBursts,
		}: Partial<foundry.abstract.DataModel.ConstructorDataFor<WeaponROFMode>> = {
			shotsPerAttack: 0,
			secondaryProjectiles: 0,
			fullAutoOnly: false,
			highCyclicControlledBursts: false,
			...source,
		}

		shotsPerAttack = Math.max(Math.ceil(shotsPerAttack ?? 0), 0)
		if (shotsPerAttack === 0) {
			secondaryProjectiles = 0
			fullAutoOnly = false
			highCyclicControlledBursts = false
			return super.cleanData(
				{ ...source, shotsPerAttack, secondaryProjectiles, fullAutoOnly, highCyclicControlledBursts },
				options,
			)
		}
		secondaryProjectiles = Math.max(Math.ceil(secondaryProjectiles ?? 0), 0)

		return super.cleanData(
			{ ...source, shotsPerAttack, secondaryProjectiles, fullAutoOnly, highCyclicControlledBursts },
			options,
		)
	}
}

type WeaponROFModeSchema = {
	shotsPerAttack: ToggleableNumberField<{ required: true; nullable: false }>
	secondaryProjectiles: ToggleableNumberField<{ required: true; nullable: false }>
	fullAutoOnly: ToggleableBooleanField<{ required: true; nullable: false }>
	highCyclicControlledBursts: ToggleableBooleanField<{ required: true; nullable: false }>
}

export { WeaponROFMode, type WeaponROFModeSchema }
