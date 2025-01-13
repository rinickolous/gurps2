import fields = foundry.data.fields
import { WeaponField } from "./weapon-field.ts"
import { Int, TooltipGURPS, feature, wswitch } from "@util"
import { BaseAttack } from "../base-attack.ts"
import { ExtendedNumberField, ExtendedBooleanField } from "@data/fields/index.ts"

class WeaponAccuracy extends WeaponField<WeaponAccuracySchema, BaseAttack> {
	static override defineSchema(): WeaponAccuracySchema {
		return weaponAccuracySchema
	}

	static override fromString(s: string): WeaponAccuracy {
		const wa = new WeaponAccuracy().toObject()
		s = s.replaceAll(" ", "").toLowerCase()
		if (s.includes("jet")) wa.jet = true
		else {
			s = s.replaceAll(/^\++/, "")
			const parts = s.split("+")
				;[wa.base] = Int.extract(parts[0])
			if (parts.length > 1) {
				;[wa.scope] = Int.extract(parts[1])
			}
		}
		return new WeaponAccuracy(wa)
	}

	override toString(): string {
		if (this.jet) return "Jet"
		if (this.scope !== 0) return this.base.toString() + this.scope.signedString()
		return this.base.toString()
	}

	override resolve(w: BaseAttack, tooltip: TooltipGURPS | null): WeaponAccuracy {
		const result = this.toObject()
		result.jet = w.resolveBoolFlag(wswitch.Type.Jet, result.jet)

		if (!result.jet) {
			const actor = w.actor
			if (actor !== null) {
				// if (actor !== null && actor.hasTemplate(ActorTemplateType.Features)) {
				let [percentBase, percentScope] = [0, 0]
				for (const bonus of w.collectWeaponBonuses(
					1,
					tooltip,
					feature.Type.WeaponAccBonus,
					feature.Type.WeaponScopeAccBonus,
				)) {
					const amt = bonus.adjustedAmountForWeapon(w)
					switch (bonus.type) {
						case feature.Type.WeaponAccBonus:
							if (bonus.percent) percentBase += amt
							else result.base += amt
							break
						case feature.Type.WeaponScopeAccBonus:
							if (bonus.percent) percentScope += amt
							else result.scope += amt
					}
				}

				if (percentBase !== 0) result.base += Math.trunc((result.base * percentBase) / 100)
				if (percentScope !== 0) result.scope += Math.trunc((result.scope * percentScope) / 100)
			}
		}
		return new WeaponAccuracy(result)
	}

	override tooltip(_w: BaseAttack): string {
		return ""
	}

	static cleanData(
		source?: Partial<foundry.abstract.DataModel.ConstructorData<WeaponAccuracySchema>>,
		options?: Parameters<fields.SchemaField.Any["clean"]>[1],
	): object {
		let { jet, base, scope }: Partial<foundry.abstract.DataModel.ConstructorData<WeaponAccuracySchema>> = {
			jet: false,
			base: 0,
			scope: 0,
			...source,
		}

		if (jet) {
			base = 0
			scope = 0
			return super.cleanData({ ...source, jet, base, scope }, options)
		}
		base = Math.max(base ?? 0, 0)
		scope = Math.max(scope ?? 0, 0)
		return super.cleanData({ ...source, jet, base, scope }, options)
	}
}

const weaponAccuracySchema = {
	base: new ExtendedNumberField({
		required: true,
		nullable: false,
		initial: 0,
		toggleable: true,
	}),
	scope: new ExtendedNumberField({
		required: true,
		nullable: false,
		initial: 0,
		toggleable: true,
	}),
	jet: new ExtendedBooleanField({
		required: true,
		nullable: false,
		initial: false,
		toggleable: true,
	}),

}

type WeaponAccuracySchema = typeof weaponAccuracySchema

export { WeaponAccuracy, type WeaponAccuracySchema }
