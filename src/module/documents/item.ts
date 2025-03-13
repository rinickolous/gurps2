import { ItemDataModelClasses, ItemDataTemplateClasses } from "@data/item/types.ts"
import { ItemType, ItemTemplateType, SYSTEM_NAME } from "@util"
import { ActorGURPS } from "./actor.ts"

class ItemGURPS extends Item {
	/* -------------------------------------------- */
	/*  System Flags Functionality                  */
	/* -------------------------------------------- */

	get _systemFlagsDataModel() {
		return this.system?.metadata?.systemFlagsModel ?? null
	}

	/* -------------------------------------------- */

	prepareData() {
		super.prepareData()
		if (SYSTEM_NAME in this.flags && this._systemFlagsDataModel) {
			// @ts-expect-error: Just catching this on a bad commit. Should be fixed soon.
			this.flags[SYSTEM_NAME] = new this._systemFlagsDataModel(this._source.flags[SYSTEM_NAME], { parent: this })
		}
	}

	/* -------------------------------------------- */

	async setFlag(scope: string, key: string, value: any): Promise<this> {
		if (scope === SYSTEM_NAME && this._systemFlagsDataModel) {
			let diff
			const changes = foundry.utils.expandObject({ [key]: value })
			// @ts-expect-error: Just catching this on a bad commit. Should be fixed soon.
			if (this.flags[SYSTEM_NAME]) diff = this.flags[SYSTEM_NAME].updateSource(changes, { dryRun: true })
			// @ts-expect-error: Just catching this on a bad commit. Should be fixed soon.
			else diff = new this._systemFlagsDataModel(changes, { parent: this }).toObject()
			// @ts-expect-error: Just catching this on a bad commit. Should be fixed soon.
			return this.update({ flags: { [SYSTEM_NAME]: diff } }, {})
		}
		// @ts-expect-error: Just catching this on a bad commit. Should be fixed soon.
		return super.setFlag(scope, key, value)
	}

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
