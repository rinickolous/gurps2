import { Feature, FeatureClass, FeatureSet, FeatureTypes } from "@data/feature/types.ts"
import { ErrorGURPS, feature, ItemType } from "@util"
import { ItemDataModel } from "../base.ts"
import { DRBonus } from "@data/feature/dr-bonus.ts"
import { MappingField } from "@data/fields/mapping-field.ts"
import { ItemGURPS } from "@documents/item.ts"
import { AnyObject } from "fvtt-types/utils"
import fields = foundry.data.fields

class PrereqHolderTemplate extends ItemDataModel<PrereqHolderSchema> {

	defineSchema(): PrereqHolderSchema {
		return prereqHolderSchema
	}


}


class PrereqsField<
	Options extends MappingField.Options<PrereqField>
> extends MappingField<
	PrereqField,
	Options,
	PrereqField,
	PrereqField,
	Prereq[],
	Prereq[]
> {
	constructor(options: Options) {
		super(new PrereqField(), options)
	}

	/* -------------------------------------------- */

	override initialize(value: any, model: foundry.abstract.DataModel.Any, options?: AnyObject): Array<Prereq> {
		super.initialize(value, model)
		const prereqs = Object.values(super.initialize(value, model, options) as unknown as Record<string, Prereq>)
		// actions.sort((a, b) => a.sort - b.sort)
		return prereqs
		// return new ActionCollection(model, actions)
	}
}

class PrereqField<
	const Options extends fields.DataField.Options<Prereq> = fields.DataField.DefaultOptions,
> extends fields.DataField<Options, Prereq, Prereq, AnyObject> {
	/* -------------------------------------------- */

	static override recursive = true

	/* -------------------------------------------- */

	protected override _cast(value: Prereq): Prereq {
		console.log(value)
		return value
	}

	/* -------------------------------------------- */

	protected override _cleanType(value: Prereq, options?: fields.DataField.CleanOptions): Prereq {
		// if (!(typeof value === "object")) value = {}

		const cls = this.getModel(value)
		if (cls) return cls.cleanData(value, { ...options }) as Prereq
		return value
	}

	/* -------------------------------------------- */

	getModel(value: object): PrereqClass | null {
		if (
			// isObject(value) &&
			Object.hasOwn(value, "type") &&
			Object.keys(PrereqTypes).includes((value as any).type)
		) {
			return PrereqTypes[(value as any).type as prereq.Type] as PrereqClass
		}
		return null
	}

	/* -------------------------------------------- */

	override initialize(value: AnyObject, model: ItemDataModel, options?: AnyObject): Prereq {
		const cls = this.getModel(value)
		if (cls) return new cls(value as object, { parent: model, ...options })
		return foundry.utils.deepClone(value) as unknown as Prereq
	}

	/* -------------------------------------------- */

	migrateSource(_sourceData: object, fieldData: any) {
		const cls = this.getModel(fieldData)
		if (cls) cls.migrateDataSafe(fieldData)
	}
}

const prereqHolderSchema = {
	prereqs: new PrereqsField({ required: true, nullable: false })
}

type PrereqHolderSchema = typeof prereqHolderSchema
