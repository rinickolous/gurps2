import { ItemDataModelClasses, ItemDataTemplateClasses } from "@data/item/types.ts"
import { ItemType, ItemTemplateType } from "@util"

class ItemGURPS extends Item {
	/* -------------------------------------------- */

	/**
	 * Type safe way of verifying if an Item is of a particular type.
	 */
	isOfType<T extends ItemType>(...types: T[]): this is { system: ItemDataModelClasses[T] } {
		return types.some(t => this.type === t)
	}

	/* -------------------------------------------- */

	/**
	 * Type safe way of verifying if an Item contains a template
	 */
	hasTemplate<T extends ItemTemplateType>(template: T): this is { system: ItemDataTemplateClasses[T] } {
		return this.system.hasTemplate(template)
	}

	/* -------------------------------------------- */
	/* -------------------------------------------- */
	/*  Item Properties                             */
	/* -------------------------------------------- */
	/**
	 * The item that contains this item, if it is in a container. Returns a promise if the item is located
	 * in a compendium pack.
	 */
	get container(): MaybePromise<ItemGURPS> | null {
		if (!Object.hasOwn(this.system, "container")) return null
		if (this.isEmbedded) return this.actor!.items.get((this.system as any).container) ?? null
		if (this.pack) {
			const pack = game.packs?.get(this.pack)
			const item = pack?.getDocument((this.system as unknown as { container: string }).container)
			return (item as Promise<ItemGURPS>) ?? null
		}

		return game.items?.get((this.system as unknown as { container: string }).container) ?? null
	}
}

export { ItemGURPS }
