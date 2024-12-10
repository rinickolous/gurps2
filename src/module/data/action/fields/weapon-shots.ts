import fields = foundry.data.fields
import { WeaponField } from "./weapon-field.ts"
import { Int, StringBuilder, TooltipGURPS, feature, i18n, wswitch } from "@util"
import { BaseAttack } from "../base-attack.ts"
import { ToggleableBooleanField, ToggleableNumberField } from "@data/fields/index.ts"

class WeaponShots extends WeaponField<WeaponShotsSchema, BaseAttack> {
	static override defineSchema(): WeaponShotsSchema {
		return {
			count: new ToggleableNumberField({
				required: true,
				nullable: false,
				initial: 0,
			}),
			inChamber: new ToggleableNumberField({
				required: true,
				nullable: false,
				initial: 0,
			}),
			duration: new ToggleableNumberField({
				required: true,
				nullable: false,
				initial: 0,
			}),
			reloadTime: new ToggleableNumberField({
				required: true,
				nullable: false,
				initial: 0,
			}),
			reloadTimeIsPerShot: new ToggleableBooleanField({ required: true, nullable: false, initial: false }),
			thrown: new ToggleableBooleanField({ required: true, nullable: false, initial: false }),
		}
	}

	static override fromString(s: string): WeaponShots {
		const ws = new WeaponShots().toObject()
		s = s.toLowerCase().replaceAll(" ", "").replaceAll(",", "")
		if (!s.includes("fp") && !s.includes("hrs") && !s.includes("day")) {
			ws.thrown = s.includes("t")
			if (!s.includes("spec")) {
				;[ws.count, s] = Int.extract(s)
				if (s.startsWith("+")) [ws.inChamber, s] = Int.extract(s)
				if (s.startsWith("x")) [ws.duration, s] = Int.extract(s.substring(1))
				if (s.startsWith("(")) {
					;[ws.reloadTime] = Int.extract(s.substring(1))
					ws.reloadTimeIsPerShot = s.includes("i")
				}
			}
		}
		return new WeaponShots(ws)
	}

	override toString(): string {
		const buffer = new StringBuilder()
		if (this.thrown) {
			buffer.push("T")
		} else {
			if (this.count <= 0) return ""
			buffer.push(this.count.toString())
			if (this.inChamber > 0) buffer.push("+", this.inChamber.toString())
			if (this.duration > 0) buffer.push("x", this.duration.toString(), "s")
		}
		if (this.reloadTime > 0) {
			buffer.push("(", this.reloadTime.toString())
			if (this.reloadTimeIsPerShot) buffer.push("i")
			buffer.push(")")
		}
		return buffer.toString()
	}

	override tooltip(_w: BaseAttack): string {
		if (this.reloadTimeIsPerShot) return i18n.localize("GURPS.Tooltip.ReloadTimeIsPerShot")
		return ""
	}

	override resolve(w: BaseAttack, tooltip: TooltipGURPS | null): WeaponShots {
		const result = this.toObject()
		result.reloadTimeIsPerShot = w.resolveBoolFlag(wswitch.Type.ReloadTimeIsPerShot, result.reloadTimeIsPerShot)
		result.thrown = w.resolveBoolFlag(wswitch.Type.Thrown, result.thrown)
		let [percentCount, percentInChamber, percentDuration, percentReloadTime] = [0, 0, 0, 0]
		for (const bonus of w.collectWeaponBonuses(
			1,
			tooltip,
			feature.Type.WeaponNonChamberShotsBonus,
			feature.Type.WeaponChamberShotsBonus,
			feature.Type.WeaponShotDurationBonus,
			feature.Type.WeaponReloadTimeBonus,
		)) {
			const amt = bonus.adjustedAmountForWeapon(w)
			switch (bonus.type) {
				case feature.Type.WeaponNonChamberShotsBonus:
					if (bonus.percent) percentCount += amt
					else result.count += amt
					break
				case feature.Type.WeaponChamberShotsBonus:
					if (bonus.percent) percentInChamber += amt
					else result.inChamber += amt
					break
				case feature.Type.WeaponShotDurationBonus:
					if (bonus.percent) percentDuration += amt
					else result.duration += amt
					break
				case feature.Type.WeaponReloadTimeBonus:
					if (bonus.percent) percentReloadTime += amt
					else result.reloadTime += amt
			}
		}

		if (percentCount !== 0) result.count += Math.trunc((result.count * percentCount) / 100)
		if (percentInChamber !== 0) result.inChamber += Math.trunc((result.inChamber * percentInChamber) / 100)
		if (percentDuration !== 0) result.duration += Math.trunc((result.duration * percentDuration) / 100)
		if (percentReloadTime !== 0) result.reloadTime += Math.trunc((result.reloadTime * percentReloadTime) / 100)
		return new WeaponShots(result)
	}

	static override cleanData(
		source?: Partial<foundry.abstract.DataModel.ConstructorDataFor<WeaponShots>>,
		options?: Parameters<fields.SchemaField.Any["clean"]>[1],
	): object {
		let {
			reloadTime,
			count,
			inChamber,
			duration,
			thrown,
		}: Partial<foundry.abstract.DataModel.ConstructorDataFor<WeaponShots>> = {
			reloadTime: 0,
			count: 0,
			inChamber: 0,
			duration: 0,
			thrown: false,
			...source,
		}

		reloadTime = Math.max(reloadTime ?? 0, 0)
		if (thrown) {
			count = 0
			inChamber = 0
			duration = 0
			return super.cleanData({ ...source, reloadTime, count, inChamber, duration, thrown }, options)
		}
		count = Math.max(count ?? 0, 0)
		if (count === 0) {
			inChamber = 0
			duration = 0
			reloadTime = 0
			return super.cleanData({ ...source, reloadTime, count, inChamber, duration, thrown }, options)
		}
		inChamber = Math.max(inChamber ?? 0, 0)
		duration = Math.max(duration ?? 0, 0)

		return super.cleanData({ ...source, reloadTime, count, inChamber, duration, thrown }, options)
	}
}

type WeaponShotsSchema = {
	count: ToggleableNumberField<{ required: true; nullable: false }>
	inChamber: ToggleableNumberField<{ required: true; nullable: false }>
	duration: ToggleableNumberField<{ required: true; nullable: false }>
	reloadTime: ToggleableNumberField<{ required: true; nullable: false }>
	reloadTimeIsPerShot: ToggleableBooleanField<{ required: true; nullable: false }>
	thrown: ToggleableBooleanField<{ required: true; nullable: false }>
}

export { WeaponShots, type WeaponShotsSchema }
