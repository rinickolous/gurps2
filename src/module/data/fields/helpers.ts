import fields = foundry.data.fields

type ExtendedToInputBaseConfig = {
	editable?: boolean
	replacements?: Map<string, string>
}

type ExtendedFieldOptions<BaseOptions = fields.DataField.Options.Any> = BaseOptions & {
	toggleable?: boolean
	replaceable?: boolean
}

type ExtendedToInputConfig<InitializedType> = ExtendedToInputBaseConfig & fields.DataField.ToInputConfig<InitializedType>

type ExtendedToInputConfigWithOptions<InitializedType> = ExtendedToInputBaseConfig & fields.DataField.ToInputConfigWithOptions<InitializedType>

type ExtendedToInputConfigWithChoices<InitializedType, Choices extends foundry.data.fields.DataField.AnyChoices | undefined> = ExtendedToInputBaseConfig & fields.DataField.ToInputConfigWithChoices<InitializedType, Choices>



/* -------------------------------------------- */




export type { ExtendedToInputConfig, ExtendedToInputConfigWithOptions, ExtendedToInputConfigWithChoices, ExtendedFieldOptions }

// interface ToToggleableInputConfig<InitializedType> extends fields.DataField.ToInputConfig<InitializedType> {
// 	editable?: boolean
// }
//
// interface ToToggleableInputConfigWithOptions<InitializedType>
// 	extends fields.DataField.ToInputConfigWithOptions<InitializedType> {
// 	editable?: boolean
// }
//
// interface ToReplaceableInputConfig<InitializedType> extends ToToggleableInputConfig<InitializedType> {
// 	replacements?: Map<string, string>
// }
//
// interface ToReplaceableInputConfigWithOptions<InitializedType>
// 	extends ToToggleableInputConfigWithOptions<InitializedType> {
// 	replacements?: Map<string, string>
// }
//
// export type {
// 	ToReplaceableInputConfig,
// 	ToReplaceableInputConfigWithOptions,
// 	ToToggleableInputConfig,
// 	ToToggleableInputConfigWithOptions,
// }
