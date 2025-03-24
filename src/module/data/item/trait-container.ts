import { ItemTemplateType, ItemType } from "@util"
import { ItemDataModel } from "./base.ts"
import {
	BasicInformationTemplate,
	CollectionFromSet,
	ContainerTemplate,
	FeatureHolderTemplate,
	ItemInstancesFromSet,
} from "./templates/index.ts"

class TraitContainerData extends ItemDataModel.mixin(
	BasicInformationTemplate,
	ContainerTemplate,
	FeatureHolderTemplate,
) {
	static override modifierTypes = new Set([ItemType.TraitModifier, ItemType.TraitModifierContainer])

	/* -------------------------------------------- */

	/**
	 * Returns all modifiers for this trait container and any inherited from its containers.
	 */
	get allModifiers(): MaybePromise<CollectionFromSet<TraitContainerData["modifierTypes"]>> {
		const allModifiers = new Collection<ItemInstancesFromSet<TraitContainerData["modifierTypes"]>>()
		const promises: Promise<void>[] = []

		// Helper function to process a single item's modifiers
		const processModifiers = (collection: MaybePromise<Collection<Item.Implementation>>): void => {
			if (collection instanceof Promise) {
				promises.push(
					collection.then(mods =>
						mods.forEach(item => {
							if (this.modifierTypes.has(item.type as ItemType)) {
								allModifiers.set(item.id!, item as any)
							}
						}),
					),
				)
			} else {
				collection.forEach(item => {
					if (this.modifierTypes.has(item.type as ItemType)) {
						allModifiers.set(item.id!, item as any)
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
							if (c?.hasTemplate(ItemTemplateType.Container)) {
								processModifiers(c.system.modifiers) // Direct modifiers only
								return c.system.container // Chain to next container
							}
							return null
						})
						.then(nextContainer => {
							currentContainer = nextContainer
						}),
				)
			} else if (currentContainer.hasTemplate(ItemTemplateType.Container)) {
				processModifiers(currentContainer.system.modifiers) // Direct modifiers only
				currentContainer = currentContainer.system.container
			} else {
				currentContainer = null
			}
		}

		return promises.length > 0 ? Promise.all(promises).then(() => allModifiers) : allModifiers
	}
}

// type TraitContainerSchema = {}

export {
	TraitContainerData,
	// type TraitContainerSchema
}
