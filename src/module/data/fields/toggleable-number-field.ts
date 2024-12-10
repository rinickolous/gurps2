import { ToToggleableInputConfig, ToToggleableInputConfigWithOptions } from "./helpers.ts"
import fields = foundry.data.fields
import { i18n } from "@util"

class ToggleableNumberField<
	const Options extends NumberFieldOptions = { required: false; nullable: false },
	const AssignmentType = fields.NumberField.AssignmentType<Options>,
	const InitializedType = fields.NumberField.InitializedType<Options>,
> extends fields.NumberField<Options, AssignmentType, InitializedType> {
	/* -------------------------------------------- */

	protected override _toInput(
		config: ToToggleableInputConfig<InitializedType> | ToToggleableInputConfigWithOptions<InitializedType>,
	): HTMLElement | HTMLCollection {
		let options: Record<string, string> = {}

		if (config && "options" in config) {
			options = config?.options
				? Object.values(config.options).reduce((acc: Record<string, string>, c) => {
						acc[c.value] = c.label
						return acc
					}, {})
				: Array.isArray(this.options.choices)
					? this.options.choices.reduce((acc, c) => {
							acc[c] = c
							return c
						}, {})
					: (this.options.choices as Record<string, string>)
		}

		if (config && config.editable === false) {
			const element = document.createElement("span")
			element.classList.add("input-disabled")
			if (options) element.innerHTML = i18n.localize(options[config.value as string]) ?? ""
			else element.innerHTML = String(config.value)
			return element
		}

		return super._toInput(config)
	}
}

export { ToggleableNumberField }
