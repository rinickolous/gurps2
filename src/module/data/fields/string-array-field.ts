import fields = foundry.data.fields

class StringArrayField<
	const Options extends ExtendedField.Options<fields.ArrayField.Options<string>> = fields.ArrayField.DefaultOptions<string>
> extends fields.ArrayField<fields.StringField<{ required: true, nullable: false, blank: false }>, Options> {

	constructor(options?: Options, context?: fields.DataField.Context) {
		super(new fields.StringField({ required: true, nullable: false, blank: false }), options, context)
	}

	/* -------------------------------------------- */

	protected override _toInput(config: ExtendedField.ToInputConfig<fields.ArrayField.InitializedType<fields.StringField.AssignmentType<{ required: true; nullable: false; blank: false }>, string, Options>>): HTMLElement | HTMLCollection {
		let value = ""
		if (Array.isArray(config.value)) value = config.value.join(", ")

		if (config.editable === false) {
			const element = document.createElement("span")
			element.classList.add("input-disabled")
			element.innerHTML = value
			return element
		}

		return foundry.applications.fields.createTextInput({ ...config, value })
	}

	/* -------------------------------------------- */

	override clean(value: string, options?: fields.DataField.CleanOptions) {
		function onlyUnique(value: string, index: number, array: string[]) {
			return array.indexOf(value) === index && value !== ""
		}
		let newValue: string[] = []

		if (Array.isArray(value)) {
			newValue = value
				.join(",")
				.split(",")
				.map((e: string) => e.trim())
				.filter((v, i, a) => onlyUnique(v, i, a))
		} else if (typeof value === "string") {
			newValue = value
				.split(",")
				.map((e: string) => e.trim())
				.filter((v, i, a) => onlyUnique(v, i, a))
		}
		return super.clean(newValue as string[], options)
	}

}

export { StringArrayField }
