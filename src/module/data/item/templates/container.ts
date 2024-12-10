import { ItemDataModel } from "../base.ts"
import fields = foundry.data.fields
import { ItemTemplateType, ItemType, ItemTypes } from "@util"
import { ItemDataModelClasses, ItemInstance } from "../types.ts"
import { ItemGURPS } from "@documents/item.ts"

class ContainerTemplate extends ItemDataModel<ContainerSchema> {
	static override defineSchema(): ContainerSchema {
		const fields = foundry.data.fields
		return {
			open: new fields.BooleanField({ required: true, nullable: true, initial: null }),
		}
	}

	/* -------------------------------------------- */

	/**
	 * Valid contents types for this item type
	 */
	static get contentsTypes(): Set<ItemType> {
		return new Set([...this.childTypes, ...this.modifierTypes])
		// return new Set([...this.childTypes, ...this.modifierTypes, ...this.weaponTypes])
	}

	/* -------------------------------------------- */

	/**
	 * Valid child types for this item type
	 */
	static childTypes: Set<ItemType> = new Set()

	get childTypes(): Set<ItemType> {
		return (this.constructor as typeof ContainerTemplate).childTypes
	}

	/* -------------------------------------------- */

	/**
	 * Valid modifier types for this item type
	 */
	static modifierTypes: Set<ItemType> = new Set()

	get modifierTypes(): Set<ItemType> {
		return (this.constructor as typeof ContainerTemplate).modifierTypes
	}

	/* -------------------------------------------- */

	get itemTypes(): MaybePromise<{ [K in keyof ItemDataModelClasses]: ItemInstance<K>[] }> {
		if (this.parent.pack) return this.#itemTypes()
		const contents = this.contents as Collection<ItemGURPS>

		const types = Object.fromEntries(ItemTypes.map((t: ItemType): [ItemType, ItemGURPS[]] => [t, []]))
		for (const item of contents) {
			types[item.type].push(item)
		}
		return types as { [K in keyof ItemDataModelClasses]: ItemInstance<K>[] }
	}

	async #itemTypes(): Promise<{ [K in keyof ItemDataModelClasses]: ItemInstance<K>[] }> {
		const contents = await this.contents

		const types = Object.fromEntries(ItemTypes.map((t: ItemType): [ItemType, ItemGURPS[]] => [t, []]))
		for (const item of contents.values()) {
			types[item.type].push(item)
		}
		return types as { [K in keyof ItemDataModelClasses]: ItemInstance<K>[] }
	}

	/* -------------------------------------------- */

	/**
	 * Get all of the items contained in this container. A promise if item is within a compendium.
	 */
	get contents(): MaybePromise<Collection<ItemGURPS>> {
		// If in a compendium, fetch using getDocuments and return a promise
		if (this.parent.pack && !this.parent.isEmbedded) {
			//@ts-expect-error weird types
			const pack = game.packs?.get(this.parent.pack)
			//@ts-expect-error weird types
			return pack!
				.getDocuments({ system: { container: this.parent.id } })
				.then(d => new Collection(d.map(d => [d.id, d])))
		}

		// Otherwise use local document collection
		return (this.parent.isEmbedded ? this.parent.actor!.items : game.items).reduce(
			(collection: Collection<ItemGURPS>, item: ItemGURPS) => {
				if (item.system.hasTemplate(ItemTemplateType.BasicInformation))
					if (item.system.container === this.parent.id) collection.set(item.id!, item)
				return collection
			},
			new Collection(),
		)
	}
}

type ContainerSchema = {
	open: fields.BooleanField<{ required: true; nullable: true }>
}

export { ContainerTemplate, type ContainerSchema }
