import { createDummyElement, feature, getAttributeChoices, GID, stlimit } from "@util"
import { BaseFeature, BaseFeatureSchema } from "./base-feature.ts"
import { ExtendedStringField } from "@data/fields/extended-string-field.ts"

class AttributeBonus extends BaseFeature<AttributeBonusSchema> {
	static override TYPE = feature.Type.AttributeBonus

	static override defineSchema(): AttributeBonusSchema {
		return {
			...super.defineSchema(),
			...attributeBonusSchema
		}
	}

	get actualLimitation(): stlimit.Option {
		if (this.attribute === GID.Strength) return this.limitation ?? stlimit.Option.None
		return stlimit.Option.None
	}

	override toFormElement(enabled: boolean): HTMLElement {
		const prefix = `system.features.${this.index}`
		const element = super.toFormElement(enabled)

		if (!enabled) {
			element.append(createDummyElement(`${prefix}.attribute`, this.attribute))
			element.append(createDummyElement(`${prefix}.limitation`, this.limitation))
		}

		const attributeChoices = Object.entries(
			getAttributeChoices(this.parent.actor, this.attribute, "GURPS.Item.Features.FIELDS.Attribute.Attribute", {
				blank: false,
				ten: false,
				size: true,
				dodge: true,
				parry: true,
				block: true,
				skill: false,
			}).choices,
		).map(([value, label]) => {
			return { value, label }
		})

		const rowElement = document.createElement("div")
		rowElement.classList.add("form-fields", "secondary")

		rowElement.append(
			foundry.applications.fields.createSelectInput({
				name: enabled ? `${prefix}.attribute` : "",
				value: this.attribute,
				localize: true,
				options: attributeChoices,
				disabled: !enabled,
			}),
		)

		rowElement.append(
			this.schema.fields.limitation.toInput({
				name: enabled ? `${prefix}.limitation` : "",
				value: this.attribute === GID.Strength ? this.limitation : stlimit.Option.None,
				disabled: !enabled || this.attribute !== GID.Strength,
				localize: true,
			}) as HTMLElement,
		)

		element.append(rowElement)

		return element
	}

	fillWithNameableKeys(_m: Map<string, string>, _existing: Map<string, string>): void { }
}

const attributeBonusSchema = {
	attribute: new ExtendedStringField({
		required: true,
		nullable: false,
		choices:
			getAttributeChoices(
				null,
				GID.Strength,
				"GURPS.Item.Features.FIELDS.Attribute.Attribute",
				{
					blank: false,
					ten: false,
					size: true,
					dodge: true,
					parry: true,
					block: true,
					skill: false,
				},
			).choices,
		initial: GID.Strength,
		toggleable: true,
	}),
	limitation: new ExtendedStringField({
		required: true,
		nullable: false,
		blank: false,
		choices: stlimit.OptionsChoices,
		initial: stlimit.Option.None,
		toggleable: true,
	}),
}

type AttributeBonusSchema = BaseFeatureSchema & typeof attributeBonusSchema

export { AttributeBonus }
