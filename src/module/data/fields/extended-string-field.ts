import { ExtendedFieldOptions, ExtendedToInputConfig, ExtendedToInputConfigWithChoices, ExtendedToInputConfigWithOptions } from "./helpers.ts"
import fields = foundry.data.fields
import { Nameable, i18n } from "@util"


class ExtendedStringField<
	const Options extends ExtendedFieldOptions<fields.StringField.Options> = fields.StringField.DefaultOptions,
	const AssignmentType = fields.StringField.AssignmentType<Options>,
	const InitializedType = fields.StringField.InitializedType<Options>,
	const PersistedType extends string | null | undefined = fields.StringField.InitializedType<Options>,
> extends fields.StringField<Options, AssignmentType, InitializedType, PersistedType> {

	toggleable: boolean
	replaceable: boolean

	constructor(options?: Options, context?: fields.DataField.Context) {
		super(options, context)

		this.toggleable = options?.toggleable ?? false
		this.replaceable = options?.replaceable ?? false
	}

	/* -------------------------------------------- */


	override  toInput(
		config?: ExtendedToInputConfig<InitializedType> | ExtendedToInputConfigWithOptions<InitializedType>
	): HTMLElement | HTMLCollection;
	override  toInput(
		config?: ExtendedToInputConfigWithChoices<InitializedType, Options["choices"]>
	): HTMLElement | HTMLCollection {
		return super.toInput(config)
	}

	/* -------------------------------------------- */

	protected override _toInput(
		config: ExtendedToInputConfig<InitializedType> | ExtendedToInputConfigWithOptions<InitializedType>
	): HTMLElement | HTMLCollection;
	protected override _toInput(
		config: ExtendedToInputConfigWithChoices<InitializedType, Options["choices"]>
	): HTMLElement | HTMLCollection {

		let options: Record<string, string> = {}

		if (this.options.replaceable && config.editable === false && config.replacements && "value" in config) {
			config.value = Nameable.applyToElement(String(config.value), config.replacements)
		}


		if ("options" in config) {
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

		if (config.editable === false) {
			const element = document.createElement("span")
			element.classList.add("input-disabled")
			if ("value" in config) {
				if (options) element.innerHTML = i18n.localize(options[config.value as string]) ?? ""
				else element.innerHTML = String(config.value)
				return element
			}
		}

		return super._toInput(config)
	}

}

export { ExtendedStringField }
