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
import { ItemInstance } from "./types.ts"

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

	/**
	 * Returns all modifiers for this trait and any inherited from its containers.
	 */
	// get allModifiers(): MaybePromise<
	// 	Collection<ItemInstance<ItemType.TraitModifier | ItemType.TraitModifierContainer>>
	// > {
	// 	const allModifiers = new Collection<ItemInstance<ItemType.TraitModifier | ItemType.TraitModifierContainer>>()
	// 	const promises: Promise<void>[] = []
	//
	// 	function appendModifiers(collection: MaybePromise<Collection<Item.Implementation>>) {
	// 		if (collection instanceof Promise) {
	// 			promises.push(
	// 				collection.then((mods: Collection<Item.Implementation>) =>
	// 					mods.forEach(item => {
	// 						if (item.isOfType(ItemType.TraitModifier, ItemType.TraitModifierContainer))
	// 							allModifiers.set(item.id!, item)
	// 					}),
	// 				),
	// 			)
	// 		} else {
	// 			collection.forEach(item => {
	// 				if (item.isOfType(ItemType.TraitModifier, ItemType.TraitModifierContainer))
	// 					allModifiers.set(item.id!, item)
	// 			})
	// 		}
	// 	}
	//
	// 	const ownModifiers = this.modifiers
	// 	const container = this.container
	//
	// 	appendModifiers(ownModifiers)
	//
	// 	if (container instanceof Promise) {
	// 		promises.push(
	// 			container.then(c => {
	// 				if (c.isOfType(ItemType.TraitContainer)) appendModifiers(c.system.allModifiers)
	// 			}),
	// 		)
	// 	} else {
	// 		if (container && container.isOfType(ItemType.TraitContainer)) appendModifiers(container.system.allModifiers)
	// 	}
	//
	// 	if (promises.length > 0) return Promise.all(promises).then(() => allModifiers)
	// 	return allModifiers
	// }
	get allModifiers(): MaybePromise<
		Collection<ItemInstance<ItemType.TraitModifier | ItemType.TraitModifierContainer>>
	> {
		const allModifiers = new Collection<ItemInstance<ItemType.TraitModifier | ItemType.TraitModifierContainer>>()
		const promises: Promise<void>[] = []

		// Helper function to process a single item's modifiers
		const processModifiers = (collection: MaybePromise<Collection<Item.Implementation>>): void => {
			if (collection instanceof Promise) {
				promises.push(
					collection.then(mods =>
						mods.forEach(item => {
							if (item.isOfType(ItemType.TraitModifier, ItemType.TraitModifierContainer)) {
								allModifiers.set(item.id!, item)
							}
						}),
					),
				)
			} else {
				collection.forEach(item => {
					if (item.isOfType(ItemType.TraitModifier, ItemType.TraitModifierContainer)) {
						allModifiers.set(item.id!, item)
					}
				})
			}
		}

		// Process this level's modifiers directly
		processModifiers(this.modifiers)

		// Handle container hierarchy
		let currentContainer = this.container
		while (currentContainer) {
			if (currentContainer instanceof Promise) {
				promises.push(
					currentContainer
						.then(c => {
							if (c?.isOfType(ItemType.TraitContainer)) {
								processModifiers(c.system.modifiers) // Direct modifiers only
								return c.system.container // Chain to next container
							}
							return null
						})
						.then(nextContainer => {
							currentContainer = nextContainer
						}),
				)
			} else if (currentContainer.isOfType(ItemType.TraitContainer)) {
				processModifiers(currentContainer.system.modifiers) // Direct modifiers only
				currentContainer = currentContainer.system.container
			} else {
				currentContainer = null
			}
		}

		return promises.length > 0 ? Promise.all(promises).then(() => allModifiers) : allModifiers
	}
}

export { TraitData }
