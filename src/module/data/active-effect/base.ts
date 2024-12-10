type EffectDataModelMetadata = SystemDataModelMetadata<ItemSystemFlags>

class EffectDataModel<Schema extends EffectDataSchema = EffectDataSchema> extends SystemDataModel<Schema, ItemGURPS> {
	/**
	 * Maximum depth items can be nested in containers.
	 */
	static MAX_DEPTH = 10

	/* -------------------------------------------- */

	variableResolverExclusions = new Set<string>()

	/* -------------------------------------------- */

	cachedVariables = new Map<string, string>()

	/* -------------------------------------------- */

	static override metadata: EffectDataModelMetadata = Object.freeze(
		foundry.utils.mergeObject(
			super.metadata,
			{ systemFlagsModel: ItemSystemFlags },
			{ inplace: false },
		) as EffectDataModelMetadata,
	)

	override get metadata(): EffectDataModelMetadata {
		return this.constructor.metadata
	}

	/* -------------------------------------------- */

	/**
	 * Type safe way of verifying if an Item is of a particular type.
	 */
	isOfType<T extends ItemType>(...types: T[]): this is EffectDataModelClasses[T] {
		return types.some(t => this.parent.type === (t as string))
	}

	/* -------------------------------------------- */
	/*  Getters                                     */
	/* -------------------------------------------- */

	get item(): ItemGURPS | null {
		return this.parent
	}

	/* -------------------------------------------- */

	get actor(): ActorGURPS | null {
		return this.parent.actor
	}

	/* -------------------------------------------- */

	get ratedStrength(): number {
		return 0
	}

	/* -------------------------------------------- */
	/*  Item Sheet                                  */
	/* -------------------------------------------- */

	cellData(_options: CellDataOptions = {}): Record<string, CellData> {
		throw ErrorGURPS(`EffectDataModel#cellData must be implemented.`)
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
			formerContainer?: string
		} & ApplicationV2.RenderOptions,
	) {
		// Render this item's container & any containers it is within
		const parentContainers = await this.allContainers()
		parentContainers.forEach(c => c.sheet?.render(false, options))

		// Render the actor sheet, compendium, or sidebar
		if (this.parent.isEmbedded) this.parent.actor!.sheet?.render(false, options)
		// @ts-expect-error waiting for types to catch up
		else if (this.parent.pack) game.packs?.get(this.parent.pack)?.apps.forEach(a => a.render(false, options))
		// @ts-expect-error waiting for types to catch up
		else ui.items?.render(false, options)

		// Render former container if it was moved between containers
		if (options.formerContainer) {
			const former = await fromUuid(options.formerContainer)
			if (former instanceof ItemGURPS) {
				former?.render(false, options)
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
		while ((container = await item.container) && depth < EffectDataModel.MAX_DEPTH) {
			containers.push(container)
			item = container
			depth += 1
		}
		return containers as ItemTemplateInstance<ItemTemplateType.Container>[]
	}
}

interface EffectDataModel<Schema extends EffectDataSchema> extends SystemDataModel<Schema, ActiveEffectGURPS> {
	constructor: typeof EffectDataModel
}

type EffectDataSchema = {}

export { EffectDataModel }
