import { ItemType } from "@util"
import { ItemDataModel } from "./base.ts"
import {
	ActionHolderTemplate,
	BasicInformationTemplate,
	ContainerTemplate,
	FeatureHolderTemplate,
	PrereqHolderTemplate,
	ReplacementHolderTemplate,
	StudyHolderTemplate,
} from "./templates/index.ts"
import fields = foundry.data.fields

/* -------------------------------------------- */

const traitFieldsSchema = {
	enabled: new fields.BooleanField(),
}

/* -------------------------------------------- */

type TraitFieldsSchema = typeof traitFieldsSchema

/* -------------------------------------------- */

class TraitFields extends ItemDataModel<TraitFieldsSchema> {
	static override defineSchema(): TraitFieldsSchema {
		return traitFieldsSchema
	}
}

/* -------------------------------------------- */

class TraitData extends ItemDataModel.mixin(
	ActionHolderTemplate,
	BasicInformationTemplate,
	ContainerTemplate,
	FeatureHolderTemplate,
	PrereqHolderTemplate,
	ReplacementHolderTemplate,
	StudyHolderTemplate,
	TraitFields,
) {
	static override modifierTypes = new Set([ItemType.TraitModifier, ItemType.TraitModifierContainer])

	/* -------------------------------------------- */

	// get allModifiers(): MaybePromise<Collection<ItemInstance<ItemType.TraitModifier>>> {}
}

export { TraitData }
