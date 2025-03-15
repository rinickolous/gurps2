import { SystemDataModel, SystemDataModelMetadata } from "@data/abstract.ts"
import { ItemSystemFlags } from "@documents/item-system-flags.ts"
import { ItemType, ItemTemplateType, ErrorGURPS } from "@util"
import { ItemDataModelClasses, ItemDataTemplateClasses, ItemTemplateInstance } from "./types.ts"
import { CellData, CellDataOptions } from "@data/cell-data.ts"
import { SheetButton } from "@data/sheet-button.ts"
import { DeepPartial } from "fvtt-types/utils"

type ItemDataModelMetadata = SystemDataModelMetadata<typeof ItemSystemFlags>

class ItemDataModel<Schema extends foundry.data.fields.DataSchema> extends SystemDataModel<
	Schema,
	Item.Implementation
> {
	/**
	 * Maximum depth items can be nested in containers.
	 */
	static MAX_DEPTH = 10

	/* -------------------------------------------- */

	variableResolverExclusions = new Set<string>()

	/* -------------------------------------------- */

	cachedVariables = new Map<string, string>()

	static testItem() {
		return "hey"
	}

	/* -------------------------------------------- */

	static override metadata: ItemDataModelMetadata = Object.freeze(
		foundry.utils.mergeObject(
			super.metadata,
			{
				enchantable: false,
			},
			{ inplace: false },
		),
	)

	// static override metadata: SystemDataModelMetadata<typeof ItemSystemFlags> = Object.freeze(
	// 	foundry.utils.mergeObject(
	// 		super.metadata,
	// 		{ systemFlagsModel: ItemSystemFlags },
	// 		{ inplace: false },
	// 	) as ItemDataModelMetadata,
	// )

	// static override metadata: ItemDataModelMetadata = Object.freeze(
	// 	foundry.utils.mergeObject(
	// 		super.metadata,
	// 		{ systemFlagsModel: ItemSystemFlags },
	// 		{ inplace: false },
	// 	) as ItemDataModelMetadata,
	// )

	override get metadata(): ItemDataModelMetadata {
		return this.constructor.metadata
	}

	/* -------------------------------------------- */

	/**
	 * Type safe way of verifying if an Item is of a particular type.
	 */
	isOfType<T extends ItemType>(...types: T[]): this is ItemDataModelClasses[T] {
		return types.some(t => this.parent.type === (t as string))
	}

	/* -------------------------------------------- */

	/**
	 * Type safe way of verifying if an Item contains a template
	 */
	hasTemplate<T extends ItemTemplateType>(template: T): this is ItemDataTemplateClasses[T] {
		return this.constructor._schemaTemplates.some(t => t.name === template)
	}

	/* -------------------------------------------- */
	/*  Getters                                     */
	/* -------------------------------------------- */

	// get item(): this["parent"] {
	// 	return this.parent
	// }

	/* -------------------------------------------- */

	get actor(): Actor.Implementation | null {
		return this.parent.actor
	}

	/* -------------------------------------------- */

	get ratedStrength(): number {
		return 0
	}

	/* -------------------------------------------- */

	get container(): MaybePromise<ItemTemplateInstance<ItemTemplateType.Container>> | null {
		return this.parent.container
	}

	/* -------------------------------------------- */
	/*  Item Sheet                                  */
	/* -------------------------------------------- */

	cellData(_options: CellDataOptions = {}): Record<string, CellData> {
		throw ErrorGURPS(`ItemDataModel#cellData must be implemented.`)
	}

	/* -------------------------------------------- */

	get sheetButtons(): SheetButton[] {
		return [
			new SheetButton(
				{
					classList: ["fa-solid", "fa-ellipsis-vertical"],
					dataset: { contextMenu: "" },
					permission: foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
				},
				{ parent: this },
			),
		]
	}

	/* -------------------------------------------- */
	/*  Socket Event Handlers                       */
	/* -------------------------------------------- */

	/**
	 * Trigger a render on all sheets for items within which this item is contained.
	 */
	async _renderContainers(
		options: {
			formerContainer?: `Item.${string}`
		} & foundry.applications.api.ApplicationV2.RenderOptions,
	) {
		// Render this item's container & any containers it is within
		const parentContainers = await this.allContainers()
		parentContainers.forEach(c => c.render(false, options))

		// Render the actor sheet, compendium, or sidebar
		if (this.parent.isEmbedded)
			this.parent.actor!.sheet?.render(
				//@ts-expect-error: This does match an overload but not sure why it's not recognised here.
				options as DeepPartial<foundry.applications.api.ApplicationV2.RenderOptions>,
			)
		else if (this.parent.pack) game.packs?.get(this.parent.pack)?.apps.forEach(a => a.render(false, options))
		//@ts-expect-error waiting for types to catch up to v13
		else ui.items?.render(false, options)

		// Render former container if it was moved between containers
		if (options.formerContainer) {
			const former = await fromUuid(options.formerContainer)
			if (former instanceof Item) {
				former?.render(false, options)
				if (former?.system instanceof ItemDataModel)
					former?.system._renderContainers({ ...options, formerContainer: undefined })
			}
		}
	}

	/* -------------------------------------------- */
	/*  Helpers                                     */
	/* -------------------------------------------- */

	/**
	 * Prepare type-specific data for the Item sheet.
	 * @param  context  Sheet context data.
	 */
	async getSheetData(_context: Record<string, unknown>): Promise<void> {}

	/**
	 * All of the containers this item is within up to the parent actor or collection.
	 */
	async allContainers(): Promise<ItemTemplateInstance<ItemTemplateType.Container>[]> {
		let item = this.parent
		let container
		let depth = 0
		const containers = []
		while ((container = await (item as Item.Implementation).container) && depth < ItemDataModel.MAX_DEPTH) {
			containers.push(container)
			item = container
			depth += 1
		}
		return containers as ItemTemplateInstance<ItemTemplateType.Container>[]
	}
}

interface ItemDataModel<Schema extends foundry.data.fields.DataSchema> extends SystemDataModel<Schema, Item> {
	constructor: typeof ItemDataModel
}

export { ItemDataModel }
