import { ItemDataModel } from "./base.ts"
import fields = foundry.data.fields
import {
	BasicInformationSchema,
	BasicInformationTemplate,
	FeatureHolderSchema,
	FeatureHolderTemplate,
	ReplacementHolderSchema,
	ReplacementHolderTemplate,
} from "./templates/index.ts"
import { affects, tmcost } from "@util"

class TraitModifierData extends ItemDataModel.mixin<
	typeof ItemDataModel,
	[typeof BasicInformationTemplate, typeof FeatureHolderTemplate, typeof ReplacementHolderTemplate],
	TraitModifierSchema
>(BasicInformationTemplate, FeatureHolderTemplate, ReplacementHolderTemplate) {
	static override defineSchema(): TraitModifierSchema {
		return this.mergeSchema(super.defineSchema(), traitModifierSchema) as TraitModifierSchema
	}

	get enabled(): boolean {
		return !this.disabled
	}
}
const traitModifierSchema = {
	cost: new fields.NumberField({ required: true, nullable: false }),
	costType: new fields.StringField({ required: true, nullable: false, choices: tmcost.TypesChoices }),
	useLevelFromTrait: new fields.BooleanField({ required: true, nullable: false }),
	showNotesOnWeapon: new fields.BooleanField({ required: true, nullable: false }),
	affects: new fields.StringField({ required: true, nullable: false, choices: affects.OptionsChoices }),
	levels: new fields.NumberField({ required: true, nullable: true }),
	disabled: new fields.BooleanField({ required: true, nullable: false, initial: false }),
}

type TraitModifierSchema = BasicInformationSchema &
	FeatureHolderSchema &
	ReplacementHolderSchema &
	typeof traitModifierSchema

export { TraitModifierData }
