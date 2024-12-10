import fields = foundry.data.fields

class DiceField<Options = fields.EmbeddedDataField.Options<DiceGURPS>> extends fields.EmbeddedDataField<
	DiceGURPS,
	Options
> {
	constructor(
		options?: fields.ObjectFieldOptions<
			SourceFromSchema<DiceGURPS["schema"]["fields"]>,
			TRequired,
			TNullable,
			THasInitial
		>,
		context?: fields.DataFieldContext,
	) {
		super(DiceGURPS, options, context)
	}

	protected override _toInput(config?: ToggleableFormInputConfig<string>): HTMLElement | HTMLCollection {
		const name = config?.name ?? this.name
		const input = foundry.applications.fields.createTextInput({
			...config,
			name,
			value: String(config?.value ?? this.parent?.[name]),
		})
		if (config && config.editable === false) {
			const element = document.createElement("span")
			element.innerHTML = config.value ?? ""
			return element
		}
		return input
	}

	override clean(
		value: unknown,
		options?: fields.CleanFieldOptions | undefined,
	): fields.MaybeSchemaProp<SourceFromSchema<DiceSchema>, TRequired, TNullable, THasInitial> {
		if (typeof value === "string") {
			value = DiceGURPS.fromString(value).toObject()
		}
		return super.clean(value, options)
	}
}

export { DiceField }
