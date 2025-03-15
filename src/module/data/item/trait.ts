import { ItemType } from "@util"
import { ItemDataModel } from "./base.ts"
import {
	ActionHolderSchema,
	ActionHolderTemplate,
	BasicInformationSchema,
	BasicInformationTemplate,
	ContainerSchema,
	ContainerTemplate,
	FeatureHolderSchema,
	FeatureHolderTemplate,
	PrereqHolderSchema,
	PrereqHolderTemplate,
	ReplacementHolderSchema,
	ReplacementHolderTemplate,
	StudyHolderSchema,
	StudyHolderTemplate,
} from "./templates/index.ts"
import fields = foundry.data.fields

class TraitData extends ItemDataModel.mixin(
	ActionHolderTemplate,
	BasicInformationTemplate,
	ContainerTemplate,
	FeatureHolderTemplate,
	PrereqHolderTemplate,
	ReplacementHolderTemplate,
	StudyHolderTemplate,
) {
	static override modifierTypes = new Set([ItemType.TraitModifier, ItemType.TraitModifierContainer])

	/* -------------------------------------------- */

	// get allModifiers(): MaybePromise<Collection<ItemInstance<ItemType.TraitModifier>>> {}
}

const traitSchema = {
	enabled: new fields.BooleanField(),
}

type TraitSchema = ActionHolderSchema &
	BasicInformationSchema &
	ContainerSchema &
	FeatureHolderSchema &
	PrereqHolderSchema &
	ReplacementHolderSchema &
	StudyHolderSchema &
	typeof traitSchema

export { TraitData, type TraitSchema }
