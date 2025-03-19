import { DifficultyField, ExtendedBooleanField, ExtendedNumberField, ExtendedStringField } from "@data/fields/index.ts"
import fields = foundry.data.fields
import { ItemDataModel } from "../base.ts"
import { AnyMutableObject } from "fvtt-types/utils"
import { i18n, ItemTemplateType, ItemType, StringBuilder } from "@util"

class SkillTemplate extends ItemDataModel<SkillTemplateSchema> {
	constructor(...args: any[]) {
		super(...args)
	}

	/* -------------------------------------------- */

	static override defineSchema(): SkillTemplateSchema {
		return skillTemplateSchema
	}

	/* -------------------------------------------- */

	static override _cleanData(source?: AnyMutableObject, options?: Parameters<fields.SchemaField.Any["clean"]>[1]) {
		if (source && Object.hasOwn(source, "techLevelRequired") && typeof source.techLevelRequired === "boolean") {
			source.techLevel = source.techLevelRequired ? source.techLevel || "" : null
		}
		return super._cleanData(source, options)
	}

	/* -------------------------------------------- */

	/**
	 * Returns the locale-formatted name of the Skill-like Item, including Tech Level and specialization if present.
	 */
	get displayName(): string {
		const buffer = new StringBuilder()

		if (this.hasTemplate(ItemTemplateType.BasicInformation)) {
			buffer.push(this._processNameable(this.name))
		}

		if (this.techLevelRequired) {
			buffer.push(i18n.format("GURPS.TechLevelShort", { level: this.techLevel }))
		}

		if (this.isOfType(ItemType.Skill) && this.specialization !== "") {
			buffer.push(
				i18n.format("GURPS.SkillSpecialization", {
					specialization: this._processNameable(this.specialization),
				}),
			)
		}

		return buffer.toString()
	}
}

/* -------------------------------------------- */

const skillTemplateSchema = {
	difficulty: new DifficultyField({ required: true, nullable: false }),
	techLevel: new ExtendedStringField({
		required: true,
		nullable: true,
		initial: null,
		label: "GURPS.Item.Skill.FIELDS.TechLevel.Name",
		toggleable: true,
	}),
	techLevelRequired: new ExtendedBooleanField({
		required: true,
		nullable: false,
		initial: false,
		label: "GURPS.Item.Skill.FIELDS.TechLevelRequired.Name",
		toggleable: true,
	}),
	points: new ExtendedNumberField({
		required: true,
		nullable: false,
		integer: true,
		min: 0,
		initial: 0,
		label: "GURPS.Item.Skill.FIELDS.Points.Name",
		toggleable: true,
	}),
}

type SkillTemplateSchema = typeof skillTemplateSchema

export { SkillTemplate, type SkillTemplateSchema }
