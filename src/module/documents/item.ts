import { ItemDataModelClasses, ItemDataTemplateClasses } from "@data/item/types.ts"
import { ItemType, ItemTemplateType } from "@util"
import { ActorGURPS } from "./actor.ts"

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
		const containerId = (this.system as unknown as { container: string | null }).container
		if (this.isEmbedded) return this.actor!.items.get(containerId || "") ?? null
		if (this.pack) {
			const pack = game.packs?.get(this.pack)
			const item = pack?.getDocument(containerId || "")
			return (item as unknown as Promise<ItemGURPS>) ?? null
		}

		return (game.items?.get(containerId || "") as ItemGURPS) ?? null
	}
}

interface ItemGURPS extends Item {
	get actor(): ActorGURPS | null
}

export { ItemGURPS }
