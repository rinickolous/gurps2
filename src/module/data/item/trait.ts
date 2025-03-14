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
import { SystemDataModel } from "@data/abstract.ts"

class TraitData extends SystemDataModel.mixin<
	// typeof ItemDataModel,
	[
		// typeof ActionHolderTemplate,
		typeof BasicInformationTemplate,
		// typeof ContainerTemplate,
		// typeof FeatureHolderTemplate,
		// typeof PrereqHolderTemplate,
		// typeof ReplacementHolderTemplate,
		// typeof StudyHolderTemplate,
	],
	TraitSchema
>(
	// ActionHolderTemplate,
	BasicInformationTemplate,
	// ContainerTemplate,
	// FeatureHolderTemplate,
	// PrereqHolderTemplate,
	// ReplacementHolderTemplate,
	// StudyHolderTemplate,
) {
	// static override modifierTypes = new Set([ItemType.TraitModifier, ItemType.TraitModifierContainer])
	/* -------------------------------------------- */
	// override get allModifiers(): MaybePromise<Collection<ItemInstance<ItemType.TraitModifier>>> {}
}

const traitSchema = {
	enabled: new fields.BooleanField(),
}

type TraitSchema = ActionHolderSchema &
	BasicInformationSchema &
	ContainerSchema &
	// FeatureHolderSchema &
	// PrereqHolderSchema &
	// ReplacementHolderSchema &
	// StudyHolderSchema &
	typeof traitSchema

export { TraitData, type TraitSchema }
