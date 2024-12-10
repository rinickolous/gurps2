import fields = foundry.data.fields

interface ToToggleableInputConfig<InitializedType> extends fields.DataField.ToInputConfig<InitializedType> {
	editable?: boolean
}

interface ToToggleableInputConfigWithOptions<InitializedType>
	extends fields.DataField.ToInputConfigWithOptions<InitializedType> {
	editable?: boolean
}

interface ToReplaceableInputConfig<InitializedType> extends ToToggleableInputConfig<InitializedType> {
	replacements?: Map<string, string>
}

interface ToReplaceableInputConfigWithOptions<InitializedType>
	extends ToToggleableInputConfigWithOptions<InitializedType> {
	replacements?: Map<string, string>
}

export type {
	ToReplaceableInputConfig,
	ToReplaceableInputConfigWithOptions,
	ToToggleableInputConfig,
	ToToggleableInputConfigWithOptions,
}
