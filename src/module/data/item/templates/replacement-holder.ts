import { Nameable } from "@util"
import { MappingField } from "@data/fields/mapping-field.ts"
import { AnyObject } from "fvtt-types/utils"
import fields = foundry.data.fields
import { SystemDataModel } from "@data/abstract.ts"

class ReplacementHolderTemplate extends SystemDataModel<ReplacementHolderSchema> {
	constructor(...args: any[]) {
		super(...args)
	}
	static override defineSchema(): ReplacementHolderSchema {
		return replacementHolderSchema
	}

	/* -------------------------------------------- */

	override prepareBaseData(): void {
		super.prepareBaseData()
		this.prepareNameableKeys()
	}

	/* -------------------------------------------- */

	/** This function is public so that it can be called from other items,
	 * i.e. when weapon data updates should trigger
	 * nameable key updates in their containers
	 */
	prepareNameableKeys(): void {
		const replacements = new Map<string, string>()
		this.fillWithNameableKeys(replacements, this.replacements)
		for (const key of this.replacements.keys()) {
			if (!replacements.has(key)) replacements.delete(key)
		}
		this.replacements = new Map(replacements.entries())
	}

	/* -------------------------------------------- */

	fillWithNameableKeys(m: Map<string, string | null>, existing: Map<string, string> = this.replacements): void {
		Nameable.extract(this.parent.name, m, existing)
	}
}

class ReplacementsField<const Options extends MappingField.Options<AnyObject>> extends MappingField<
	fields.StringField,
	Options,
	fields.StringField,
	string,
	Map<string, string>,
	Map<string, string>,
	string,
	Record<string, string>
> {
	constructor(options: Options) {
		super(new fields.StringField(), options)
	}

	/* -------------------------------------------- */

	override initialize(
		value: Record<string, string>,
		model: foundry.abstract.DataModel.Any,
		options?: AnyObject,
	): Map<string, string> {
		super.initialize(value, model)
		const records = Object.entries(super.initialize(value as any, model, options) as unknown as [string, string])
		return new Map(records) as any
	}

	/* -------------------------------------------- */

	override toObject(value: Map<string, string>): Record<string, string> {
		return Object.fromEntries(value)
	}
}

const replacementHolderSchema = {
	replacements: new ReplacementsField({ required: true, nullable: false }),
}

type ReplacementHolderSchema = typeof replacementHolderSchema

export { ReplacementHolderTemplate, type ReplacementHolderSchema }
