import fields = foundry.data.fields
import { i18n } from "@util"


class ExtendedNumberField<
	const Options extends ExtendedField.Options<fields.NumberField.Options> = fields.NumberField.DefaultOptions,
	const AssignmentType = fields.NumberField.AssignmentType<Options>,
	const InitializedType = fields.NumberField.InitializedType<Options>,
	const PersistedType extends number | null | undefined = fields.NumberField.InitializedType<Options>,
> extends fields.NumberField<Options, AssignmentType, InitializedType, PersistedType> {
	toggleable: boolean
	replaceable: boolean


	constructor(options?: Options, context?: fields.DataField.Context) {
		super(options, context)

		this.toggleable = options?.toggleable ?? false
		this.replaceable = options?.replaceable ?? false
	}

	/* -------------------------------------------- */


	override  toInput(
		config?: ExtendedField.ToInputConfig<InitializedType> | ExtendedField.ToInputConfigWithOptions<InitializedType>
	): HTMLElement | HTMLCollection;
	override  toInput(
		config?: ExtendedField.ToInputConfigWithChoices<InitializedType, Options["choices"]>
	): HTMLElement | HTMLCollection {
		return super.toInput(config)
	}

	/* -------------------------------------------- */

	protected override _toInput(
		config: ExtendedField.ToInputConfig<InitializedType> | ExtendedField.ToInputConfigWithOptions<InitializedType>
	): HTMLElement | HTMLCollection;
	protected override _toInput(
		config: ExtendedField.ToInputConfigWithChoices<InitializedType, Options["choices"]>
	): HTMLElement | HTMLCollection {

		let options: Record<string, string> = {}

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

export { ExtendedNumberField }
