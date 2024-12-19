
import { ToggleableStringField } from "./toggleable-string-field.ts"
import fields = foundry.data.fields
import { ToToggleableInputConfig, ToToggleableInputConfigWithOptions } from "./helpers.ts"
import { Int, Weight } from "@util"

interface WeightFieldOptions extends StringFieldOptions {
	/* Should the fields allow percentages as a unit?*/
	allowPercent?: boolean
}

class WeightField<
	const Options extends WeightFieldOptions = { required: true, nullable: false, allowPercent: false },
> extends ToggleableStringField<Options, string, string> {
	allowPercent: boolean


	constructor(options?: Options, context?: fields.DataField.Context) {
		super(options, context)
		this.allowPercent = options?.allowPercent ?? false
	}

	protected override _toInput(
		config: ToToggleableInputConfig<string> | ToToggleableInputConfigWithOptions<string>,
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
