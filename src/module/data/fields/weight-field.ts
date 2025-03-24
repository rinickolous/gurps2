import { ExtendedStringField } from "./extended-string-field.ts"
import fields = foundry.data.fields
import { Int, Weight } from "@util"

namespace WeightField {
	export type Options = ExtendedField.Options & {
		/* Should the fields allow percentages as a unit?*/
		allowPercent?: boolean
	}

	export type DefaultOptions = ExtendedField.DefaultOptions & { allowPercent: false }
}

class WeightField<const Options extends WeightField.Options = WeightField.DefaultOptions> extends ExtendedStringField<
	Options,
	string,
	string
> {
	allowPercent: boolean

	constructor(options?: Options, context?: fields.DataField.Context) {
		super(options, context)
		this.allowPercent = options?.allowPercent ?? false
	}

	protected override _toInput(
		config: ExtendedField.ToInputConfig<string> | ExtendedField.ToInputConfigWithOptions<string>,
	): HTMLElement | HTMLCollection {
		return super._toInput(config)
	}

	override clean(value: string, options?: fields.DataField.CleanOptions): string {
		if (typeof value !== "string") return super.clean(value, options)

		if (this.allowPercent && value.trim().endsWith("%")) {
			value = `${Int.fromStringForced(value)}%`
		} else {
			value = Weight.format(Weight.fromStringForced(value, Weight.Unit.Pound), Weight.Unit.Pound)
		}

		return super.clean(value, options)
	}
}

export { WeightField }
