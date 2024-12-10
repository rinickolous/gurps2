import { ToToggleableInputConfig, ToToggleableInputConfigWithOptions } from "./helpers.ts"
import fields = foundry.data.fields

class ToggleableBooleanField<
	const Options extends fields.BooleanField.Options = { required: false; nullable: false },
	const AssignmentType = fields.BooleanField.AssignmentType<Options>,
	const InitializedType = fields.BooleanField.InitializedType<Options>,
> extends fields.BooleanField<Options, AssignmentType, InitializedType> {
	/* -------------------------------------------- */

	protected override _toInput(
		config: ToToggleableInputConfig<InitializedType> | ToToggleableInputConfigWithOptions<InitializedType>,
	): HTMLElement | HTMLCollection {
		if (config && !config.editable) {
			return super._toInput({ ...config, disabled: true })
		}
		return super._toInput(config)
	}
}

export { ToggleableBooleanField }
