import { ItemDataModel } from "@data/item/base.ts"
import fields = foundry.data.fields
import { PseudoDocument, PseudoDocumentMetaData, PseudoDocumentSchema } from "../pseudo-document.ts"
import { CellData, CellDataOptions } from "@data/cell-data.ts"
import { ActionType, ErrorGURPS, ItemTemplateType } from "@util"
import { ActionDataModelClasses } from "./types.ts"
import { SheetButton } from "@data/sheet-button.ts"
import { ItemDataTemplateClasses } from "@data/item/types.ts"

type ActionMetadata = PseudoDocumentMetaData

class BaseAction<Schema extends BaseActionSchema = BaseActionSchema> extends PseudoDocument<
	Schema,
	ItemDataModel
> {
	static override metadata: ActionMetadata = Object.freeze({
		...super.metadata,
		// name: DOCUMENTS.ACTION,
		img: "/icons/svg/item-bag.svg",
		// sheetClass: ActionSheetGURPS,
	})

	static override defineSchema(): BaseActionSchema {
		return {
			...super.defineSchema(),
			...baseActionSchema
		}
	}

	/* -------------------------------------------- */

	/**
	 * HACK: only used to ensure hasTemplate is true for SkillDefaultHolder for weapons
	 */
	hasTemplate<T extends ItemTemplateType>(_template: T): this is ItemDataTemplateClasses[T] {
		return false
	}

	/* -------------------------------------------- */

	async getSheetData(_context: Record<string, unknown>): Promise<void> { }

	/* -------------------------------------------- */

	cellData(_options: CellDataOptions = {}): Record<string, CellData> {
		// throw ErrorGURPS(`${DOCUMENTS.ACTION}#cellData must be implemented.`)
		throw ErrorGURPS(`Action#cellData must be implemented.`)
	}

	/* -------------------------------------------- */

	/**
	 * Type safe way of verifying if an Item is of a particular type.
	 */
	isOfType<T extends ActionType>(...types: T[]): this is ActionDataModelClasses[T] {
		return types.some(t => this.type === t)
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
				{ parent: this.parent },
			),
		]
	}
}

const baseActionSchema = {
	activation: new fields.SchemaField({}),
	consumption: new fields.SchemaField({}),
	target: new fields.SchemaField({}),
	actionRange: new fields.SchemaField({}),
	// effects: new fields.ArrayField(new AppliedEffectField()),
}

type BaseActionSchema = PseudoDocumentSchema & typeof baseActionSchema

export { BaseAction, type BaseActionSchema, type ActionMetadata }
