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
import { ItemInstance } from "./types.ts"
import { ItemGURPS } from "@documents"
import fields = foundry.data.fields

class TraitData extends ItemDataModel.mixin<
	typeof ItemDataModel,
	[
		typeof ActionHolderTemplate,
		typeof BasicInformationTemplate,
		typeof ContainerTemplate,
		typeof FeatureHolderTemplate,
		typeof PrereqHolderTemplate,
		typeof ReplacementHolderTemplate,
		typeof StudyHolderTemplate,
	],
	TraitSchema
>(
	ActionHolderTemplate,
	BasicInformationTemplate,
	ContainerTemplate,
	FeatureHolderTemplate,
	PrereqHolderTemplate,
	ReplacementHolderTemplate,
	StudyHolderTemplate,
) {
	static override modifierTypes = new Set([ItemType.TraitModifier, ItemType.TraitModifierContainer])

	testFunc() {
		return this.enabled
	}

	/* -------------------------------------------- */

	get allModifiers(): Collection<ItemInstance<ItemType.TraitModifier>> {
		return this.allContents.reduce(
			(collection: Collection<ItemInstance<ItemType.TraitModifier>>, item: ItemGURPS) => {
				if (item.isOfType(ItemType.TraitModifier) && item.system.enabled) collection.set(item.id!, item)
				return collection
			},
			new Collection(),
		)
	}
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
