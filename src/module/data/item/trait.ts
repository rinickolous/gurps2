import { ItemType } from "@util"
import { ItemDataModel } from "./base.ts"
import { ActionHolderTemplate, BasicInformationTemplate, ContainerTemplate, FeatureHolderTemplate, PrereqHolderTemplate, ReplacementHolderTemplate, StudyHolderTemplate } from "./templates/index.ts"

// @ts-expect-error TODO: fix later
class TraitData extends ItemDataModel.mixin(
	FeatureHolderTemplate,
	ActionHolderTemplate,
	BasicInformationTemplate,
	ContainerTemplate,
	FeatureHolderTemplate,
	PrereqHolderTemplate,
	ReplacementHolderTemplate,
	StudyHolderTemplate,
) {
	static override modifierTypes = new Set([ItemType.TraitModifier, ItemType.TraitModifierContainer])
}

type TraitSchema = {}

export { TraitData, type TraitSchema }
