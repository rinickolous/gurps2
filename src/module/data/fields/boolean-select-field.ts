// NOTE: no longer in use. See ExtendedBooleanField instead.
//
// import fields = foundry.data.fields
//
// /**
// 	* A Boolean field which displays as a selectbox
// 	*/
// class BooleanSelectField<
// 	const Options extends BooleanSelectField.Options = BooleanSelectField.DefaultOptions
// > extends fields.BooleanField<Options> {
// 	choices:
// 		| readonly boolean[]
// 		| Record<string, string>
// 		| (() => readonly boolean[] | Record<string | number, string>) = {
// 			true: "GURPS.Enum.Boolean.true",
// 			false: "GURPS.Enum.Boolean.false",
// 		}
//
// 	/* -------------------------------------------- */
//
// 	constructor(
// 		options?: Options,
// 		context?: fields.DataField.Context
// 	) {
// 		super(options, context)
// 		if (options?.choices) this.choices = options.choices
// 	}
//
// 	/* -------------------------------------------- */
//
// 	protected override _toInput(config: fields.DataField.ToInputConfig<boolean>): HTMLElement | HTMLCollection {
// 		super._toInput(config)
// 		const choices = this.choices
// 		config.options = Object.values(choices).map(e => BooleanSelectField.#getChoiceFromEntry(e))
// 		return foundry.applications.fields.createSelectInput(config)
// 	}
//
// 	// HACK: this method is gross
// 	static #getChoiceFromEntry(
// 		entry: string | object,
// 		{ labelAttr, valueAttr, localize }: { labelAttr?: string; valueAttr?: string; localize?: boolean } = {},
// 	): FormSelectOption {
// 		const choice: Partial<FormSelectOption> & Record<string, unknown> = {}
//
// 		const isObject = (e: unknown): e is Record<string, unknown> => {
// 			return foundry.utils.getType(e) === "Object"
// 		}
//
// 		if (isObject(entry)) {
// 			if (valueAttr && valueAttr in entry) choice.value = entry[valueAttr] as string
// 			if (labelAttr && labelAttr in entry) choice.label = entry[labelAttr] as string
// 			for (const k of ["group", "disabled", "rule"]) {
// 				if (k in entry) choice[k] = entry[k]
// 			}
// 		} else choice.label = String(entry)
// 		if (localize && choice.label) choice.label = game.i18n.localize(choice.label)
//
// 		return choice as FormSelectOption
// 	}
//
//
// }
//
// export { BooleanSelectField }
