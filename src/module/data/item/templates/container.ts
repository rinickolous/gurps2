import { ItemDataModel } from "../base.ts"
import fields = foundry.data.fields
import { ItemTemplateType, ItemType, ItemTypes } from "@util"
import { ItemDataModelClasses, ItemInstance } from "../types.ts"
import { ItemGURPS } from "@documents"

class ContainerTemplate extends ItemDataModel<ContainerSchema> {
	static override defineSchema(): ContainerSchema {
		return containerSchema
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
	// get contents(): MaybePromise<Collection<ItemGURPS>> {
	// 	// If in a compendium, fetch using getDocuments and return a promise
	// 	if (this.parent.pack && !this.parent.isEmbedded) {
	// 		const pack = game.packs?.get(this.parent.pack)
	// 		if (!pack) {
	// 			console.error(`Compendium pack ${this.parent.pack} not found`)
	// 			return new Collection()
	// 		}
	// 		return pack
	// 			.getDocuments({ system: { container: this.parent.id } })
	// 			.then(d => new Collection(d.map(d => [d.id, d]))) as Promise<Collection<ItemGURPS>>
	// 	}
	//
	// 	// Otherwise use local document collection
	// 	return (this.parent.isEmbedded ? this.parent.actor!.items : game.items).reduce(
	// 		(collection: Collection<ItemGURPS>, item: ItemGURPS) => {
	// 			if (item.system.hasTemplate(ItemTemplateType.BasicInformation))
	// 				if (item.system.container === this.parent.id) collection.set(item.id!, item)
	// 			return collection
	// 		},
	// 		new Collection(),
	// 	)
	// }

	contents(relationship: string): MaybePromise<Collection<ItemGURPS>> {
		// If in a compendium, fetch using getDocuments and return a promise
		if (this.parent.pack && !this.parent.isEmbedded) {
			const pack = game.packs?.get(this.parent.pack)
			if (!pack) {
				console.error(`Compendium pack ${this.parent.pack} not found`)
				return new Collection()
			}
			return pack
				.getDocuments({ system: { container: this.parent.id, relationship } })
				.then(d => new Collection(d.map(d => [d.id, d]))) as Promise<Collection<ItemGURPS>>
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

	/* -------------------------------------------- */

	get children(): MaybePromise<Collection<ItemGURPS>> {
		return this.contents("child")
	}

	/* -------------------------------------------- */

	/* -------------------------------------------- */

	get modifiers(): MaybePromise<Collection<ItemGURPS>> {
		return this.contents("modifier")
	}

	/* -------------------------------------------- */

	get allContents(): Collection<ItemGURPS> {
		//TODO: maybe support promises later
		const contents = this.contents
		if (contents instanceof Promise) return new Collection()
		return contents.reduce((collection: Collection<ItemGURPS>, item: ItemGURPS) => {
			collection.set(item.id!, item)
			if (item.system.hasTemplate(ItemTemplateType.Container)) {
				if (!(item.system.contents instanceof Promise))
					item.system.contents.forEach((e: ItemGURPS) => {
						collection.set(e.id!, e)
					})
			}
			return collection
		}, new Collection())
	}

	/* -------------------------------------------- */

	get allModifiers(): Collection<ItemGURPS> {
		console.error(
			"ContainerTemplate#allModifiers does not have a base implementation and must be used in a subclass.",
		)
		return new Collection()
	}
}

const containerSchema = {
	childIds: new fields.ArrayField(new fields.ForeignDocumentField(ItemGURPS, { idOnly: true })),
	modifierIds: new fields.ArrayField(new fields.ForeignDocumentField(ItemGURPS, { idOnly: true })),
}

type ContainerSchema = typeof containerSchema

export { ContainerTemplate, type ContainerSchema }
