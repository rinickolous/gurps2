import { DifficultyField, ExtendedNumberField, ExtendedStringField } from "@data/fields/index.ts"
import fields = foundry.data.fields
import { ItemDataModel } from "../base.ts"
import { AnyMutableObject } from "fvtt-types/utils"

class SkillTemplate extends ItemDataModel<SkillTemplateSchema> {
	static override defineSchema(): SkillTemplateSchema {
		return skillTemplateSchema
	}

	static override _cleanData(source?: AnyMutableObject, options?: Parameters<fields.SchemaField.Any["clean"]>[1]) {
		if (source && Object.hasOwn(source, "techLevelRequired") && typeof source.techLevelRequired === "boolean") {
			source.techLevel = source.techLevelRequired ? source.techLevel || "" : null
		}
		super._cleanData(source, options)
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
