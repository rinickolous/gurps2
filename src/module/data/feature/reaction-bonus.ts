import { ReplaceableStringField } from "@data/fields/index.ts"
import { BaseFeature, BaseFeatureSchema } from "./base-feature.ts"
import { createDummyElement, feature, i18n, Nameable } from "@util"

class ReactionBonus extends BaseFeature<ReactionBonusSchema> {
	static override TYPE = feature.Type.ReactionBonus

	static override defineSchema(): ReactionBonusSchema {
		return {
			...super.defineSchema(),
			...reactionBonusSchema
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

const reactionBonusSchema = {
	situation: new ReplaceableStringField({
		required: true,
		nullable: false,
		initial: i18n.localize("gurps.feature.reaction_bonus"),
	}),
}

type ReactionBonusSchema = BaseFeatureSchema & typeof reactionBonusSchema


export { ReactionBonus, type ReactionBonusSchema }
