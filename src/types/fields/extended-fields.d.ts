import fields = foundry.data.fields

export {}

declare global {
	namespace ExtendedField {
		type ToInputBaseConfig = {
			editable?: boolean
			replacements?: Map<string, string>
		}

		type Options<BaseOptions = fields.DataField.Options.Any> = BaseOptions & {
			toggleable?: boolean
			replaceable?: boolean
		}

		type DefaultOptions = fields.DataField.DefaultOptions

		type ToInputConfig<InitializedType> = ToInputBaseConfig & fields.DataField.ToInputConfig<InitializedType>

		type ToInputConfigWithOptions<InitializedType> = ToInputBaseConfig &
			fields.DataField.ToInputConfigWithOptions<InitializedType>

		type ToInputConfigWithChoices<
			InitializedType,
			Choices extends fields.DataField.AnyChoices | undefined,
		> = ToInputBaseConfig & fields.DataField.ToInputConfigWithChoices<InitializedType, Choices>
	}

	namespace ExtendedBooleanField {
		type Options = ExtendedField.Options<fields.BooleanField.Options> & {
			choices?: Choices | undefined
		}

		type BaseChoices = {
			readonly true: string
			readonly false: string
		}

		type Choices = BaseChoices | (() => BaseChoices)
	}
}
