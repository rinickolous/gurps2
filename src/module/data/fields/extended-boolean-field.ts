import { ExtendedFieldOptions, ExtendedToInputConfig, ExtendedToInputConfigWithOptions } from "./helpers.ts"
import fields = foundry.data.fields
import { SimpleMerge } from "fvtt-types/utils";


class ExtendedBooleanField<
	const Options extends ExtendedFieldOptions<fields.BooleanField.Options> = fields.BooleanField.DefaultOptions,
	const AssignmentType = fields.BooleanField.AssignmentType<SimpleMerge<Options, fields.BooleanField.DefaultOptions>>,
	const InitializedType = fields.BooleanField.InitializedType<SimpleMerge<Options, fields.BooleanField.DefaultOptions>>,
	const PersistedType extends boolean | null | undefined = fields.BooleanField.InitializedType<
		SimpleMerge<Options, fields.BooleanField.DefaultOptions>
	>,
> extends fields.BooleanField<Options, AssignmentType, InitializedType, PersistedType> {


	constructor(options?: Options, context?: fields.DataField.Context) {
		super(options, context)
	}

	/* -------------------------------------------- */

	override  toInput(
		config?: ExtendedToInputConfig<InitializedType> | ExtendedToInputConfigWithOptions<InitializedType>
	): HTMLElement | HTMLCollection {
		return super.toInput(config)
	}

	/* -------------------------------------------- */

	protected override _toInput(
		config: ExtendedToInputConfig<InitializedType> | ExtendedToInputConfigWithOptions<InitializedType>
	): HTMLElement | HTMLCollection {

		if (config && !config.editable) {
			return super._toInput({ ...config, disabled: true })
		}
		return super._toInput(config)
	}
}

export { ExtendedBooleanField }
