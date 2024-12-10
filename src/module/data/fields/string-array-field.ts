import { ToReplaceableInputConfig, ToToggleableInputConfigWithOptions } from "./helpers.ts"
import fields = foundry.data.fields

class StringArrayField<
	// const AssignmentElementType = fields.ArrayField.AssignmentElementType<fields.StringField>,
	// const InitializedElementType = fields.ArrayField.InitializedElementType<fields.StringField>,
	const Options extends fields.ArrayField.Options<string> = fields.ArrayField.DefaultOptions<string>,
	const AssignmentType = fields.ArrayField.AssignmentType<string, Options>,
	const InitializedType = fields.ArrayField.InitializedType<string, string, Options>,
	const PersistedElementType = fields.ArrayField.PersistedElementType<fields.StringField>,
> extends fields.ArrayField<
	fields.StringField<{
		required: true
		nullable: false
		blank: false
	}>,
	string,
	string,
	// AssignmentElementType,
	// InitializedElementType,
	Options,
	AssignmentType,
	InitializedType,
	PersistedElementType
> {
	constructor(options?: Options, context?: fields.DataField.Context) {
		super(new fields.StringField({ required: true, nullable: false, blank: false }), options, context)
	}

	protected override _toInput(
		config: ToReplaceableInputConfig<InitializedType> | ToToggleableInputConfigWithOptions<InitializedType>,
	): HTMLElement | HTMLCollection {
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

	override clean(value: AssignmentType, options?: fields.DataField.CleanOptions) {
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
		return super.clean(newValue as AssignmentType, options)
	}
}

export { StringArrayField }
