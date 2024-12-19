import { createDummyElement, feature, i18n, Nameable } from "@util"
import { BaseFeature, BaseFeatureSchema } from "./base-feature.ts"
import { ReplaceableStringField } from "@data/fields/index.ts"

class ConditionalModifierBonus extends BaseFeature<ConditionalModifierBonusSchema> {
	static override TYPE = feature.Type.ConditionalModifierBonus

	static override defineSchema(): ConditionalModifierBonusSchema {
		return {
			...super.defineSchema(),
			situation: new ReplaceableStringField({
				required: true,
				nullable: false,
				initial: i18n.localize("gurps.feature.conditional_modifier"),
			}),
		}
	}

	override toFormElement(enabled: boolean): HTMLElement {
		const prefix = `system.features.${this.index}`
		const element = super.toFormElement(enabled)
		const replacements = this.replacements

		if (!enabled) {
			element.append(createDummyElement(`${prefix}.situation`, this.situation))
		}

		const rowElement = document.createElement("div")
		rowElement.classList.add("form-fields", "secondary")

		rowElement.append(
			this.schema.fields.situation.toInput({
				name: enabled ? `${prefix}.situation` : "",
				value: this.situation,
				localize: true,
				disabled: !enabled,
				replacements,
			}) as HTMLElement,
		)

		element.append(rowElement)

		return element
	}

	fillWithNameableKeys(m: Map<string, string>, existing: Map<string, string>): void {
		Nameable.extract(this.situation, m, existing)
	}
}

type ConditionalModifierBonusSchema = BaseFeatureSchema & {
	situation: ReplaceableStringField<{ required: true, nullable: false, initial: string }>
}
export { ConditionalModifierBonus, type ConditionalModifierBonusSchema }

