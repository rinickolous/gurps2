import { SystemDataModel, SystemDataModelMetadata } from "@data/abstract.ts"
import { ActorGURPS, EffectSystemFlags, ItemGURPS } from "@documents"
import { EffectType, ErrorGURPS } from "@util"
import { EffectDataModelClasses } from "./types.ts"
import { CellData, CellDataOptions } from "@data/cell-data.ts"
import { SheetButton } from "@data/sheet-button.ts"
import api = foundry.applications.api

// type EffectDataModelMetadata = SystemDataModelMetadata<EffectSystemFlags>
type EffectDataModelMetadata = SystemDataModelMetadata<EffectSystemFlags>

class EffectDataModel<Schema extends EffectDataSchema = EffectDataSchema> extends SystemDataModel<Schema, ActiveEffectGURPS> {
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
			{ systemFlagsModel: EffectSystemFlags },
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
	isOfType<T extends EffectType>(...types: T[]): this is EffectDataModelClasses[T] {
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


	/* -------------------------------------------- */
	/*  Helpers                                     */
	/* -------------------------------------------- */

	/**
	 * Prepare type-specific data for the Item sheet.
	 * @param  context  Sheet context data.
	 */
	async getSheetData(_context: Record<string, unknown>): Promise<void> { }
}

// interface EffectDataModel<Schema extends EffectDataSchema> extends SystemDataModel<Schema, ActiveEffectGURPS> {
// 	constructor: typeof EffectDataModel
// }

type EffectDataSchema = {}

export { EffectDataModel }
