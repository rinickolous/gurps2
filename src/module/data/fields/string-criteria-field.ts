import { StringCriteria } from "@data/shared/index.ts";
import fields = foundry.data.fields
import { StringComparison } from "@util";

class StringCriteriaField<
	Options extends fields.EmbeddedDataField.Options<typeof StringCriteria> & CriteriaFieldOptions,
> extends fields.EmbeddedDataField<typeof StringCriteria, Options> {

	constructor(
		options?: Options,
		context?: fields.DataField.Context
	) {
		if (options && "choices" in options) {
			const { choices, ...restOptions } = options
			super(StringCriteria, restOptions as Options, context)
				; (this as any).fields.compare.choices = options.choices as Record<StringComparison.Option, string>
		} else {
			super(StringCriteria, options, context)
		}
	}
}

export { StringCriteriaField }
