import fields = foundry.data.fields

class ReplaceableStringCriteriaField<
	Options extends fields.EmbeddedDataField.Options<ReplaceableStringCriteria>
> extends fields.EmbeddedDataField<ReplaceableStringCriteria, Options> {

	constructor(options?: Options, context?: fields.DataField.Context) {
		if (options?.choices) {
			const { choices, ...restOptions } = options
			super(ReplaceableStringCriteria, restOptions, context)
				; (this.fields.compare as any).choices = options.choices as Record<StringComparison.Option, string>
		} else {
			super(ReplaceableStringCriteria, options, context)
		}
	}
}

export { ReplaceableStringCriteriaField }
