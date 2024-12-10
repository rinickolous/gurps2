import fields = foundry.data.fields
import { WeaponField } from "./weapon-field.ts"
import { Int, StringBuilder, TooltipGURPS, feature, i18n, wswitch } from "@util"
import { BaseAttack } from "../base-attack.ts"
import { ToggleableBooleanField, ToggleableNumberField } from "@data/fields/index.ts"

class WeaponReach extends WeaponField<WeaponReachSchema, BaseAttack> {
	static override defineSchema(): WeaponReachSchema {
		return {
			min: new ToggleableNumberField({
				required: true,
				nullable: false,
				initial: 1,
			}),
			max: new ToggleableNumberField({
				required: true,
				nullable: false,
				initial: 1,
			}),
			closeCombat: new ToggleableBooleanField({ required: true, nullable: false, initial: false }),
			changeRequiresReady: new ToggleableBooleanField({ required: true, nullable: false, initial: false }),
		}
	}

	static override fromString(s: string): WeaponReach {
		const wr = new WeaponReach({}).toObject()
		s = s.replaceAll(" ", "")
		if (s !== "") {
			s = s.toLowerCase()
			if (!s.includes("spec")) {
				s = s.replaceAll("-", ",")
				wr.closeCombat = s.includes("c")
				wr.changeRequiresReady = s.includes("*")
				s = s.replaceAll("*", "")
				const parts = s.split(",")
				;[wr.min] = Int.extract(parts[0])
				if (parts.length > 1) {
					wr.max = Math.max(
						...parts.map(e => {
							const [n] = Int.extract(e)
							return n
						}),
					)
				}
			}
		}
		return new WeaponReach(wr)
	}

	override toString(): string {
		const buffer = new StringBuilder()
		if (this.closeCombat) buffer.push("C")
		if (this.min !== 0 || this.max !== 0) {
			if (buffer.length !== 0) buffer.push(",")

			buffer.push(this.min.toString())
			if (this.min !== this.max) {
				buffer.push(`-${this.max}`)
			}
		}
		if (this.changeRequiresReady) buffer.push("*")
		return buffer.toString()
	}

	override tooltip(_w: BaseAttack): string {
		if (this.changeRequiresReady) return i18n.localize("GURPS.Tooltip.ReachChangeRequiresReady")
		return ""
	}

	override resolve(w: BaseAttack, tooltip: TooltipGURPS | null): WeaponReach {
		const result = this.toObject()
		result.closeCombat = w.resolveBoolFlag(wswitch.Type.CloseCombat, result.closeCombat)
		result.changeRequiresReady = w.resolveBoolFlag(
			wswitch.Type.ReachChangeRequiresReady,
			result.changeRequiresReady,
		)
		let [percentMin, percentMax] = [0, 0]
		for (const bonus of w.collectWeaponBonuses(
			1,
			tooltip,
			feature.Type.WeaponMinReachBonus,
			feature.Type.WeaponMaxReachBonus,
		)) {
			const amt = bonus.adjustedAmountForWeapon(w)
			if (bonus.type === feature.Type.WeaponMinReachBonus) {
				if (bonus.percent) percentMin += amt
				else result.min += amt
			} else if (bonus.type === feature.Type.WeaponMaxReachBonus) {
				if (bonus.percent) percentMax += amt
				else result.max += amt
			}
		}
		if (percentMin !== 0) {
			result.min += Int.from((result.min * percentMin) / 100)
		}
		if (percentMax !== 0) {
			result.max += Int.from((result.max * percentMin) / 100)
		}
		return new WeaponReach(result)
	}

	static override cleanData(
		source?: Partial<foundry.abstract.DataModel.ConstructorDataFor<WeaponReach>>,
		options?: Parameters<fields.SchemaField.Any["clean"]>[1],
	): object {
		let { min, max } = { min: 0, max: 0, ...source }
		if (min === 0 && max !== 0) {
			min = 1
		} else if (min !== 0 && max === 0) {
			max = min
		}
		max = Math.max(max ?? 0, min ?? 0)
		return super.cleanData({ min, max }, options)
	}
}

type WeaponReachSchema = {
	min: ToggleableNumberField<{ required: true; nullable: false }>
	max: ToggleableNumberField<{ required: true; nullable: false }>
	closeCombat: ToggleableBooleanField<{ required: true; nullable: false }>
	changeRequiresReady: ToggleableBooleanField<{ required: true; nullable: false }>
}

export { WeaponReach, type WeaponReachSchema }
