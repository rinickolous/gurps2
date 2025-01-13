import { createDummyElement, feature, i18n, Nameable } from "@util"
import { BaseFeature, BaseFeatureSchema } from "./base-feature.ts"
import { ExtendedStringField } from "@data/fields/index.ts"

class ConditionalModifierBonus extends BaseFeature<ConditionalModifierBonusSchema> {
	static override TYPE = feature.Type.ConditionalModifierBonus

	static override defineSchema(): ConditionalModifierBonusSchema {
		return {
			...super.defineSchema(),
			...conditionalModifierBonusSchema
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

const conditionalModifierBonusSchema = {
	situation: new ExtendedStringField({
		required: true,
		nullable: false,
		toggleable: true,
		replaceable: true,
		initial: i18n.localize("gurps.feature.conditional_modifier"),
	}),
}

type ConditionalModifierBonusSchema = BaseFeatureSchema & typeof conditionalModifierBonusSchema
export { ConditionalModifierBonus, type ConditionalModifierBonusSchema }

