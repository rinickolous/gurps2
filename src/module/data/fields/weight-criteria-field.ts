import { WeightCriteria } from "@data/shared/index.ts";
import fields = foundry.data.fields
import { NumericComparison } from "@util";

class WeightCriteriaField<
	Options extends fields.EmbeddedDataField.Options<typeof WeightCriteria> & CriteriaFieldOptions,
> extends fields.EmbeddedDataField<typeof WeightCriteria, Options> {

	constructor(
		options?: Options,
		context?: fields.DataField.Context
	) {
		if (options && "choices" in options) {
			const { choices, ...restOptions } = options
			super(WeightCriteria, restOptions as Options, context)
				; (this as any).fields.compare.choices = options.choices as Record<NumericComparison.Option, string>
		} else {
			super(WeightCriteria, options, context)
		}
	}
}

export { WeightCriteriaField }
