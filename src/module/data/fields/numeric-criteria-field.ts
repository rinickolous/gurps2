import { NumericCriteria } from "@data/shared/index.ts";
import fields = foundry.data.fields
import { NumericComparison } from "@util";

class NumericCriteriaField<
	Options extends fields.EmbeddedDataField.Options<typeof NumericCriteria> & CriteriaFieldOptions,
> extends fields.EmbeddedDataField<typeof NumericCriteria, Options> {

	constructor(
		options?: Options,
		context?: fields.DataField.Context
	) {
		if (options && "choices" in options) {
			const { choices, ...restOptions } = options
			super(NumericCriteria, restOptions as Options, context)
				; (this as any).fields.compare.choices = options.choices as Record<NumericComparison.Option, string>
		} else {
			super(NumericCriteria, options, context)
		}
	}
}

export { NumericCriteriaField }
