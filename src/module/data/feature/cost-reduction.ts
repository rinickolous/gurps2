import { createButton, createDummyElement, feature, getAttributeChoices, GID, i18n } from "@util"
import { BaseFeature, BaseFeatureSchema } from "./base-feature.ts"
import { ExtendedNumberField, ExtendedStringField } from "@data/fields/index.ts"

function getCostReductionChoices() {
	return Object.freeze(
		Object.fromEntries(
			[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80].map(value => [
				value,
				i18n.format("GURPS.Item.Features.FIELDS.CostReduction.Reduction", { value }),
			]),
		),
	)
}

class CostReduction extends BaseFeature<CostReductionSchema> {
	static override TYPE = feature.Type.CostReduction

	static override defineSchema(): CostReductionSchema {
		return {
			...super.defineSchema(),
			...costReductionSchema
		}
	}

	override toFormElement(this: CostReduction, enabled: boolean): HTMLElement {
		const element = document.createElement("li")
		const prefix = `system.features.${this.index}`

		element.append(createDummyElement(`${prefix}.temporary`, this.temporary))
		if (!enabled) {
			element.append(createDummyElement(`${prefix}.type`, this.type))
			element.append(createDummyElement(`${prefix}.attribute`, this.attribute))
			element.append(createDummyElement(`${prefix}.percentage`, this.percentage))
		}

		const rowElement = document.createElement("div")
		rowElement.classList.add("form-fields")

		rowElement.append(
			createButton({
				icon: ["fa-regular", "fa-trash"],
				label: "",
				data: {
					deleteFeature: "",
					index: this.index.toString(),
				},
				disabled: !enabled,
			}),
		)

		rowElement.append(
			foundry.applications.fields.createSelectInput({
				name: enabled ? `${prefix}.type` : "",
				value: this.type,
				dataset: {
					selector: "feature-type",
					index: this.index.toString(),
				},
				localize: true,
				options: this.getTypeChoices(),
				disabled: !enabled,
			}),
		)

		rowElement.append(
			this.schema.fields.attribute.toInput({
				name: enabled ? `${prefix}.attribute` : "",
				value: this.attribute,
				localize: true,
				disabled: !enabled,
			}) as HTMLElement,
		)

		rowElement.append(
			this.schema.fields.percentage.toInput({
				name: enabled ? `${prefix}.percentage` : "",
				value: this.percentage,
				localize: true,
				disabled: !enabled,
			}) as HTMLElement,
		)

		element.append(rowElement)

		return element
	}

	fillWithNameableKeys(_m: Map<string, string>, _existing: Map<string, string>): void { }
}

const costReductionSchema = {
	attribute: new ExtendedStringField({
		required: true,
		nullable: false,
		choices: getAttributeChoices(
			null,
			GID.Strength,
			"GURPS.Item.Features.FIELDS.CostReduction.Attribute",
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
	}),
	percentage: new ExtendedNumberField({
		required: true,
		nullable: false,
		choices: getCostReductionChoices(),
		initial: 40,
	}),
}

type CostReductionSchema = BaseFeatureSchema & typeof costReductionSchema

export { CostReduction, type CostReductionSchema }
