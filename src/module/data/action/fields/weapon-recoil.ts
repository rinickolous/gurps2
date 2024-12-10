import { WeaponField } from "./weapon-field.ts"
import { Int, StringBuilder, TooltipGURPS, feature, i18n } from "@util"
import { BaseAttack } from "../base-attack.ts"
import { ToggleableNumberField } from "@data/fields/index.ts"

class WeaponRecoil extends WeaponField<WeaponRecoilSchema, BaseAttack> {
	static override defineSchema(): WeaponRecoilSchema {
		return {
			shot: new ToggleableNumberField({
				required: true,
				nullable: false,
				min: 0,
				initial: 0,
			}),
			slug: new ToggleableNumberField({
				required: true,
				nullable: false,
				min: 0,
				initial: 0,
			}),
		}
	}

	static override fromString(s: string): WeaponRecoil {
		const wr = new WeaponRecoil().toObject()
		s = s.replaceAll(" ", "").replaceAll(",", "")
		const parts = s.split("/")
		;[wr.shot] = Int.extract(parts[0])
		if (parts.length > 1) {
			;[wr.slug] = Int.extract(parts[1])
		}
		return new WeaponRecoil(wr)
	}

	override toString(): string {
		if (this.shot === 0 && this.slug === 0) return ""
		const buffer = new StringBuilder()
		buffer.push(this.shot.toString())
		if (this.slug !== 0) buffer.push("/", this.slug.toString())
		return buffer.toString()
	}

	override tooltip(_w: BaseAttack): string {
		if (this.shot !== 0 && this.slug !== 0 && this.shot !== this.slug) i18n.localize("GURPS.Tooltip.Recoil")
		return ""
	}

	override resolve(w: BaseAttack, tooltip: TooltipGURPS | null): WeaponRecoil {
		const result = this.toObject()
		if (this.shot > 0 || this.slug > 0) {
			let percent = 0
			for (const bonus of w.collectWeaponBonuses(1, tooltip, feature.Type.WeaponRecoilBonus)) {
				const amt = bonus.adjustedAmountForWeapon(w)
				if (bonus.percent) percent += amt
				else {
					result.shot += amt
					result.slug += amt
				}
			}
			if (percent !== 0) {
				result.shot += Math.trunc((result.shot * percent) / 100)
				result.slug += Math.trunc((result.slug * percent) / 100)
			}
			if (this.shot > 0) result.shot = Math.max(result.shot, 1)
			else result.shot = 0

			if (this.slug > 0) result.slug = Math.max(result.slug, 1)
			else result.slug = 0
		}
		return new WeaponRecoil(result)
	}
}

type WeaponRecoilSchema = {
	shot: ToggleableNumberField<{ required: true; nullable: false }>
	slug: ToggleableNumberField<{ required: true; nullable: false }>
}

export { WeaponRecoil, type WeaponRecoilSchema }
