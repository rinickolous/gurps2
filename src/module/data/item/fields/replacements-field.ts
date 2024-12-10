import { MappingField, MappingFieldOptions } from "@data/fields/mapping-field.ts"
import fields = foundry.data.fields
import type { AnyObject } from "@league-of-foundry-developers/foundry-vtt-types/src/types/utils.d.mts"

// HACK: this needs some fixing to accoutn for new data models

class ReplacementsField<const Options extends MappingFieldOptions<AnyObject>> extends MappingField<
	Options,
	any,
	Map<string, string>
> {
	constructor(options: Options) {
		super(new fields.StringField(), options)
	}

	/* -------------------------------------------- */

	// @ts-expect-error waiting on types to catch up HACK: maybe I'm the problem?
	override initialize(
		value: Map<string, string>,
		model: foundry.abstract.DataModel.Any,
		options?: AnyObject,
	): Map<string, string> {
		const records = Object.entries(super.initialize(value as any, model, options) as unknown as [string, string])
		return new Map(records) as any
	}

	/* -------------------------------------------- */

	override toObject(value: Map<string, string>): Record<string, string> {
		return Object.fromEntries(value)
	}
}

export { ReplacementsField }
