import { ToReplaceableInputConfig, ToReplaceableInputConfigWithOptions } from "./helpers.ts"
import fields = foundry.data.fields
import { ToggleableStringField } from "./toggleable-string-field.ts"
import { Nameable } from "@util"

class ReplaceableStringField<
	const Options extends StringFieldOptions = { required: false; nullable: false },
	const AssignmentType = fields.StringField.AssignmentType<Options>,
	const InitializedType = fields.StringField.InitializedType<Options>,
> extends ToggleableStringField<Options, AssignmentType, InitializedType> {
	/* -------------------------------------------- */

	override toInput(
		config?: ToReplaceableInputConfig<InitializedType> | ToReplaceableInputConfigWithOptions<InitializedType>,
	): HTMLElement | HTMLCollection {
		return super.toInput(config)
	}

	protected override _toInput(
		config: ToReplaceableInputConfig<InitializedType> | ToReplaceableInputConfigWithOptions<InitializedType>,
	): HTMLElement | HTMLCollection {
		if (config && !config.editable && config?.replacements) {
			config.value = Nameable.applyToElement(String(config.value), config.replacements) as InitializedType
		}
		return super._toInput(config)
	}
}

export { ReplaceableStringField }
