import { ItemTemplateType, ItemType, ItemTypes, SYSTEM_NAME } from "@util"
import fields = foundry.data.fields
import { ItemDataModelClasses, ItemInstance } from "../types.ts"
import { ItemDataModel } from "../base.ts"
// import { ItemTemplateType, ItemType } from "@util"
// import { ItemDataModelClasses, ItemInstance } from "../types.ts"

/* -------------------------------------------- */
/* SUPPORTING TYPES 													  */
/* -------------------------------------------- */

type ItemInstancesFromSet<S extends Set<ItemType>> = {
	[K in S extends Set<infer T> ? T : never]: ItemInstance<K>
}[S extends Set<infer T> ? T : never]

type CollectionFromSet<S extends Set<ItemType>> = Collection<ItemInstancesFromSet<S>>

class ContainerTemplate extends ItemDataModel<ContainerSchema> {
	constructor(...args: any[]) {
		super(...args)
	}
	static override defineSchema(): ContainerSchema {
		return containerSchema
	}

	/* -------------------------------------------- */

	/**
	 * Valid contents types for this item type
	 */
	static get contentsTypes(): Set<ItemType> {
		return new Set([...this.childTypes, ...this.modifierTypes])
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
		const contents = this.contents() as Collection<Item.Implementation>

		const types = Object.fromEntries(ItemTypes.map((t: ItemType): [ItemType, Item.Implementation[]] => [t, []]))
		for (const item of contents) {
			types[item.type].push(item)
		}
		return types as { [K in keyof ItemDataModelClasses]: ItemInstance<K>[] }
	}

	async #itemTypes(): Promise<{ [K in keyof ItemDataModelClasses]: ItemInstance<K>[] }> {
		const contents = await this.contents()

		const types = Object.fromEntries(ItemTypes.map((t: ItemType): [ItemType, Item.Implementation[]] => [t, []]))
		for (const item of contents.values()) {
			types[item.type].push(item)
		}
		return types as { [K in keyof ItemDataModelClasses]: ItemInstance<K>[] }
	}

	/* -------------------------------------------- */

	/**
	 * Get all of the items contained in this container. A promise if item is within a compendium.
	 */
	contents(relationship?: string): MaybePromise<Collection<Item.Implementation>> {
		// Helper to filter items based on container and optional relationship
		const filterItem = (item: Item.Implementation): boolean => {
			if (item.getFlag(SYSTEM_NAME, "containerId") !== this.parent.id) return false
			if (relationship !== undefined && relationship !== "") {
				return item.getFlag(SYSTEM_NAME, "containerRelationship") === relationship
			}
			return true // No relationship filter if undefined or empty
		}

		// Compendium mode
		if (this.parent.pack && !this.parent.isEmbedded) {
			const pack = game.packs?.get(this.parent.pack)
			if (!pack) {
				console.error(`Compendium pack ${this.parent.pack} not found`)
				return new Collection()
			}

			// Build query conditionally
			const query: Record<string, any> = { system: { container: this.parent.id } }
			if (relationship !== undefined && relationship !== "") {
				query.system.relationship = relationship
			}

			return pack
				.getDocuments(query)
				.then(docs => new Collection(docs.map(d => [d.id, d as Item.Implementation])))
		}

		// Item in Actor or global collection
		const source = this.parent.isEmbedded ? this.parent.actor?.items : game.items
		if (!source) {
			console.warn("No valid item source found for local contents retrieval")
			return new Collection()
		}

		return source.reduce((collection: Collection<Item.Implementation>, item: Item.Implementation) => {
			if (filterItem(item)) {
				collection.set(item.id!, item)
			}
			return collection
		}, new Collection())
	}

	/* -------------------------------------------- */

	get children(): MaybePromise<Collection<Item.Implementation>> {
		return this.contents("child")
	}

	/* -------------------------------------------- */

	get modifiers(): MaybePromise<Collection<Item.Implementation>> {
		return this.contents("modifier")
	}

	/* -------------------------------------------- */

	get allContents(): MaybePromise<Collection<Item.Implementation>> {
		async function getRecursiveContents(
			c: Collection<Item.Implementation>,
		): Promise<Collection<Item.Implementation>> {
			const collection = new Collection<Item.Implementation>()
			const allPromises: Promise<void>[] = []

			// First pass: Collect all items and promises without awaiting
			for (const item of c) {
				collection.set(item.id!, item)

				if (item.system instanceof ItemDataModel && item.system.hasTemplate(ItemTemplateType.Container)) {
					const itemContents = item.system.contents()

					if (itemContents instanceof Promise) {
						allPromises.push(
							itemContents.then(async contents => {
								const nested = await getRecursiveContents(contents)
								nested.forEach(e => collection.set(e.id!, e))
							}),
						)
					} else {
						// For non-promise contents, still recurse but collect the promise
						allPromises.push(
							getRecursiveContents(itemContents).then(nested => {
								nested.forEach(e => collection.set(e.id!, e))
							}),
						)
					}
				}
			}

			// Resolve all promises at once
			await Promise.all(allPromises)
			return collection
		}

		const contents = this.contents()
		if (contents instanceof Promise) {
			return contents.then(c => getRecursiveContents(c))
		}
		return getRecursiveContents(contents)
	}
}

const containerSchema = {
	open: new fields.BooleanField({ required: true, nullable: false, initial: false }),
}

type ContainerSchema = typeof containerSchema

export { ContainerTemplate, type ContainerSchema, type CollectionFromSet, type ItemInstancesFromSet }
