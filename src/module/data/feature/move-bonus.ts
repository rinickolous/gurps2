import { createDummyElement, feature, GID, movelimit } from "@util"
import fields = foundry.data.fields
import { BaseFeature, BaseFeatureSchema } from "./base-feature.ts"


class MoveBonus extends BaseFeature<MoveBonusSchema> {
	static override TYPE = feature.Type.MoveBonus

	static override defineSchema(): MoveBonusSchema {
		return {
			...super.defineSchema(),
			...moveBonusSchema
		}
	}

	override toFormElement(enabled: boolean): HTMLElement {
		const prefix = `system.features.${this.index}`
		const element = super.toFormElement(enabled)

		if (!enabled) {
			element.append(createDummyElement(`${prefix}.move_type`, this.move_type))
			element.append(createDummyElement(`${prefix}.limitation`, this.limitation))
		}

		const rowElement = document.createElement("div")
		rowElement.classList.add("form-fields", "secondary")

		rowElement.append(
			foundry.applications.fields.createSelectInput({
				name: enabled ? `${prefix}.attribute` : "",
				value: this.move_type,
				localize: true,
				options: [
					{ value: GID.Ground, label: "GROUND" },
					{ value: GID.Water, label: "WATER" },
					{ value: GID.Air, label: "AIR" },
					{ value: GID.Space, label: "SPACE" },
				],
				disabled: !enabled,
			}),
		)

		rowElement.append(
			this.schema.fields.limitation.toInput({
				name: enabled ? `${prefix}.limitation` : "",
				value: this.limitation,
				localize: true,
				disabled: !enabled,
			}) as HTMLElement,
		)

		element.append(rowElement)

		return element
	}

	fillWithNameableKeys(_m: Map<string, string>, _existing: Map<string, string>): void { }
}

const moveBonusSchema = {
	move_type: new fields.StringField({ required: true, nullable: false, blank: false, initial: GID.Ground }),
	limitation: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		choices: movelimit.OptionsChoices,
		initial: movelimit.Option.Base,
	}),
}


type MoveBonusSchema = BaseFeatureSchema & typeof moveBonusSchema

export { MoveBonus, type MoveBonusSchema }
