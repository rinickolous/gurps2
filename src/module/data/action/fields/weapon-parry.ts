import { WeaponField } from "./weapon-field.ts"
import fields = foundry.data.fields
import { Int, StringBuilder, TooltipGURPS, feature, wswitch } from "@util"
import { BaseAttack } from "../base-attack.ts"

class WeaponParry extends WeaponField<WeaponParrySchema, BaseAttack> {
	static override defineSchema(): WeaponParrySchema {
		return {
			canParry: new ToggleableBooleanField({ required: true, nullable: false, initial: false }),
			fencing: new ToggleableBooleanField({ required: true, nullable: false, initial: false }),
			unbalanced: new ToggleableBooleanField({ required: true, nullable: false, initial: false }),
			modifier: new ToggleableNumberField({
				required: true,
				nullable: false,
				initial: 0,
			}),
		}
	}

	static override fromString(s: string): WeaponParry {
		const wp = new WeaponParry().toObject()
		s = s.trim().toLowerCase()

		if (s !== "" && s !== "-" && s !== "–" && !s.includes("no")) {
			wp.canParry = true
			wp.fencing = s.includes("f")
			wp.unbalanced = s.includes("u")
			;[wp.modifier] = Int.extract(s)
		}
		return new WeaponParry(wp)
	}

	override toString(): string {
		if (!this.canParry) return "No"
		const buffer = new StringBuilder()
		buffer.push(this.modifier.toString())
		if (this.fencing) buffer.push("F")
		if (this.unbalanced) buffer.push("U")
		return buffer.toString()
	}

	override tooltip(_w: BaseAttack): string {
		if (!this.canParry || (!this.fencing && !this.unbalanced)) {
			return ""
		}
		const tooltip = new TooltipGURPS()
		if (this.fencing)
			tooltip.push(
				game.i18n.format("GURPS.Tooltip.ParryFencing", {
					retreatingParry: this.modifier + 3,
					normalParry: this.modifier + 1,
				}),
			)
		if (this.unbalanced) {
			if (tooltip.length !== 0) tooltip.push("\n\n")
			tooltip.push(game.i18n.localize("GURPS.Tooltip.ParryUnbalanced"))
		}
		return tooltip.toString()
	}

	override resolve(w: BaseAttack, tooltip: TooltipGURPS | null): WeaponParry {
		const result = this.toObject()
		result.canParry = w.resolveBoolFlag(wswitch.Type.CanParry, result.canParry)
		if (result.canParry) {
			result.fencing = w.resolveBoolFlag(wswitch.Type.Fencing, result.fencing)
			result.unbalanced = w.resolveBoolFlag(wswitch.Type.Unbalanced, result.unbalanced)

			const actor = this.parent.actor
			if (actor?.isOfType(ActorType.Character)) {
				const primaryTooltip = new TooltipGURPS()
				const preAdj = w.skillLevelBaseAdjustment(actor, primaryTooltip)
				const postAdj = w.skillLevelPostAdjustment(actor, primaryTooltip)
				let best = Number.MIN_SAFE_INTEGER
				for (const def of w.defaults) {
					let level = def.skillLevelFast(actor, w.replacements, false, new Set(), true)
					if (level === Number.MIN_SAFE_INTEGER) continue
					level += preAdj
					if (def.type !== gid.Parry) level = Math.trunc(level / 2)
					level += postAdj
					if (best < level) best = level
				}
				if (best !== Number.MIN_SAFE_INTEGER) {
					tooltip?.appendToNewLine(primaryTooltip.toString())
					result.modifier += 3 + best + actor.system.bonuses.parry.value
					tooltip?.appendToNewLine(actor.system.bonuses.parry.tooltip)
					let percentModifier = 0
					for (const bonus of w.collectWeaponBonuses(1, tooltip, feature.Type.WeaponParryBonus)) {
						const amt = bonus.adjustedAmountForWeapon(w)
						if (bonus.percent) percentModifier += amt
						else result.modifier += amt
					}
					if (percentModifier !== 0) result.modifier += Math.trunc((result.modifier * percentModifier) / 100)
					result.modifier = Math.trunc(Math.max(result.modifier, 0))
				} else {
					result.modifier = 0
				}
			}
		}
		return new WeaponParry(result)
	}

	static override cleanData(
		source?: Partial<foundry.abstract.DataModel.ConstructorDataFor<WeaponParry>>,
		options?: Parameters<fields.SchemaField.Any["clean"]>[1],
	): object {
		let { modifier, canParry, fencing, unbalanced } = {
			modifier: 0,
			canParry: false,
			fencing: false,
			unbalanced: false,
			...source,
		}

		if (!canParry) {
			modifier = 0
			fencing = false
			unbalanced = false
		}

		return super.cleanData({ ...source, modifier, canParry, fencing, unbalanced }, options)
	}
}

type WeaponParrySchema = {
	canParry: ToggleableBooleanField<{ required: true; nullable: false }>
	fencing: ToggleableBooleanField<{ required: true; nullable: false }>
	unbalanced: ToggleableBooleanField<{ required: true; nullable: false }>
	modifier: ToggleableNumberField<{ required: true; nullable: false }>
}

export { WeaponParry, type WeaponParrySchema }
