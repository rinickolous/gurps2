import { ExtendedStringField } from "@data/fields/extended-string-field.ts"
import { ItemDataModel } from "./base.ts"
import { ActionHolderTemplate } from "./templates/action-holder.ts"
import { BasicInformationTemplate } from "./templates/basic-information.ts"
import { FeatureHolderTemplate } from "./templates/feature-holder.ts"
import { PrereqHolderTemplate } from "./templates/prereq-holder.ts"
import { ReplacementHolderTemplate } from "./templates/replacement-holder.ts"
import { SkillTemplate } from "./templates/skill.ts"

class SkillFields extends ItemDataModel<SkillFieldsSchema> {
	static override defineSchema(): SkillFieldsSchema {
		return skillFieldsSchema
	}
}

/* -------------------------------------------- */

const skillFieldsSchema = {
	specialization: new ExtendedStringField({
		required: true,
		nullable: false,
		blank: true,
		initial: "",
		label: "GURPS.Item.Skill.FIELDS.Specialization.Name",
		toggleable: true,
		replaceable: true,
	}),
}

type SkillFieldsSchema = typeof skillFieldsSchema

/* -------------------------------------------- */

class SkillData extends ItemDataModel.mixin(
	ActionHolderTemplate,
	BasicInformationTemplate,
	FeatureHolderTemplate,
	PrereqHolderTemplate,
	ReplacementHolderTemplate,
	SkillTemplate,
	SkillFields,
) {}

export { SkillData }
