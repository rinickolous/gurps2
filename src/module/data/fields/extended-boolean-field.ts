import { i18n } from "@util";
import fields = foundry.data.fields
import { SimpleMerge } from "fvtt-types/utils";
import { getChoiceFromEntry, getChoicesFromConfig } from "./helpers.ts";



class ExtendedBooleanField<
	const Options extends ExtendedBooleanField.Options = fields.BooleanField.DefaultOptions,
	const AssignmentType = fields.BooleanField.AssignmentType<SimpleMerge<Options, fields.BooleanField.DefaultOptions>>,
	const InitializedType = fields.BooleanField.InitializedType<SimpleMerge<Options, fields.BooleanField.DefaultOptions>>,
	const PersistedType extends boolean | null | undefined = fields.BooleanField.InitializedType<
		SimpleMerge<Options, fields.BooleanField.DefaultOptions>
	>,
> extends fields.BooleanField<Options, AssignmentType, InitializedType, PersistedType> {

	/**
	 * An array of values or an object of values/labels which represent
	 * allowed choices for the field. A function may be provided which dynamically
	 * returns the array of choices.
	 * @defaultValue `undefined`
	 */
	choices: Record<"true" | "false", string> | (() => Record<"true" | "false", string>) | undefined;


	constructor(options?: Options, context?: fields.DataField.Context) {
		super(options, context)
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

		let choices = getChoicesFromConfig(config)
		if (choices === null && this.choices) choices = Object.entries(this.choices).map(([key, value]) => {
			return getChoiceFromEntry({ key, value }, { labelAttr: "value", valueAttr: "key", localize: true })
		})

		// If the field is provided with choices, treat as a selectbox
		if (choices !== null) {
			if (!config.editable) {
				const element = document.createElement("span")
				element.classList.add("input-disabled")
				if ("value" in config) {
					if (choices) element.innerHTML = i18n.localize(choices.find(e => e.value === String(config.value))?.label ?? "")
					else element.innerHTML = String(config.value)
					return element
				}
			}
			const element = foundry.applications.fields.createSelectInput({
				name: "name" in config ? String(config.name) : "",
				value: "value" in config ? String(config.value) : "false",
				options: choices,

			})
			return element
		}

		if (!config.editable) {
			return super._toInput({ ...config, disabled: true })
		}
		return super._toInput(config)
	}
}

export { ExtendedBooleanField }
