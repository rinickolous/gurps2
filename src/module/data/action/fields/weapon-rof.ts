import fields = foundry.data.fields
import { WeaponField } from "./weapon-field.ts"
import { i18n, TooltipGURPS, wswitch } from "@util"
import { WeaponROFMode } from "./weapon-rof-mode.ts"
import { BaseAttack } from "../base-attack.ts"
import { ToggleableBooleanField } from "@data/fields/index.ts"

class WeaponROF extends WeaponField<WeaponROFSchema, BaseAttack> {
	static override defineSchema(): WeaponROFSchema {
		const fields = foundry.data.fields
		return {
			mode1: new fields.EmbeddedDataField(WeaponROFMode, { required: true, nullable: false }),
			mode2: new fields.EmbeddedDataField(WeaponROFMode, { required: true, nullable: false }),
			jet: new ToggleableBooleanField({ required: true, nullable: false, initial: false }),
		}
	}

	static override fromString(s: string): WeaponROF {
		const wr = new WeaponROF().toObject()
		s = s.replaceAll(" ", "").toLowerCase()
		if (s.includes("")) {
			wr.jet = true
		} else {
			const parts = s.split("/")
			wr.mode1 = WeaponROFMode.fromString(parts[0])
			if (parts.length > 1) {
				wr.mode2 = WeaponROFMode.fromString(parts[0])
			}
		}
		return new WeaponROF(wr)
	}

	override toString(): string {
		if (this.jet) return "Jet"
		const s1 = this.mode1.toString()
		const s2 = this.mode2.toString()
		if (s1 === "") return s2
		if (s2 !== "") {
			return s1 + "/" + s2
		}
		return s1
	}

	override tooltip(w: BaseAttack): string {
		if (this.jet) return ""
		const buffer = new TooltipGURPS()
		const t1 = this.mode1.tooltip(w)
		const t2 = this.mode2.tooltip(w)
		if (t1 !== "") {
			if (t2 !== "") buffer.push(i18n.localize("GURPS.Tooltip.ROFMode1"), "\n")
			buffer.push(t1)
		}
		if (t2 !== "") {
			if (t1 !== "") buffer.push(i18n.localize("GURPS.Tooltip.ROFMode2"), "\n")
			buffer.push(t2)
		}
		return buffer.toString()
	}

	override resolve(w: BaseAttack, tooltip: TooltipGURPS | null): WeaponROF {
		const result = this.clone()

		if (result instanceof Promise) return this

		result.jet = w.resolveBoolFlag(wswitch.Type.Jet, result.jet)
		if (!result.jet) {
			const buf1 = new TooltipGURPS()
			const buf2 = new TooltipGURPS()
			result.mode1 = result.mode1.resolve(w, buf1, true)
			result.mode2 = result.mode2.resolve(w, buf2, false)
			if (tooltip !== null) {
				if (buf1.length !== 0) {
					if (buf2.length !== 0) {
						tooltip.push(i18n.localize("GURPS.Tooltip.ROFMode1"), "\n")
					}
					tooltip.push(buf1.toString())
				}
				if (buf2.length !== 0) {
					if (buf1.length !== 0) {
						tooltip.push("\n\n", i18n.localize("GURPS.Tooltip.ROFMode2"), "\n")
					}
					tooltip.push(buf2.toString())
				}
			}
		}
		return result
	}
}

type WeaponROFSchema = {
	mode1: fields.EmbeddedDataField<typeof WeaponROFMode, { required: true; nullable: false }>
	mode2: fields.EmbeddedDataField<typeof WeaponROFMode, { required: true; nullable: false }>
	jet: ToggleableBooleanField<{ required: true; nullable: false }>
}

export { WeaponROF, type WeaponROFSchema }
