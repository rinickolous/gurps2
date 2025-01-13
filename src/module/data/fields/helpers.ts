import { AnyMutableObject, AnyObject } from "fvtt-types/utils";
import fields = foundry.data.fields
import { i18n } from "@util";
//
// type ExtendedToInputBaseConfig = {
// 	editable?: boolean
// 	replacements?: Map<string, string>
// }
//
// type ExtendedFieldOptions<BaseOptions = fields.DataField.Options.Any> = BaseOptions & {
// 	toggleable?: boolean
// 	replaceable?: boolean
// }
//
// type ExtendedToInputConfig<InitializedType> = ExtendedToInputBaseConfig & fields.DataField.ToInputConfig<InitializedType>
//
// type ExtendedToInputConfigWithOptions<InitializedType> = ExtendedToInputBaseConfig & fields.DataField.ToInputConfigWithOptions<InitializedType>
//
// type ExtendedToInputConfigWithChoices<InitializedType, Choices extends foundry.data.fields.DataField.AnyChoices | undefined> = ExtendedToInputBaseConfig & fields.DataField.ToInputConfigWithChoices<InitializedType, Choices>
//
//
//
// /* -------------------------------------------- */
//
//
//
//
// export type { ExtendedToInputConfig, ExtendedToInputConfigWithOptions, ExtendedToInputConfigWithChoices, ExtendedFieldOptions }
//
// // interface ToToggleableInputConfig<InitializedType> extends fields.DataField.ToInputConfig<InitializedType> {
// // 	editable?: boolean
// // }
// //
// // interface ToToggleableInputConfigWithOptions<InitializedType>
// // 	extends fields.DataField.ToInputConfigWithOptions<InitializedType> {
// // 	editable?: boolean
// // }
// //
// // interface ToReplaceableInputConfig<InitializedType> extends ToToggleableInputConfig<InitializedType> {
// // 	replacements?: Map<string, string>
// // }
// //
// // interface ToReplaceableInputConfigWithOptions<InitializedType>
// // 	extends ToToggleableInputConfigWithOptions<InitializedType> {
// // 	replacements?: Map<string, string>
// // }
// //
// // export type {
// // 	ToReplaceableInputConfig,
// // 	ToReplaceableInputConfigWithOptions,
// // 	ToToggleableInputConfig,
// // 	ToToggleableInputConfigWithOptions,
// // }

function getChoicesFromConfig<
	Options extends fields.StringField.Options,
	InitializedType extends fields.StringField.InitializedType<Options>
>(config: fields.DataField.ToInputConfig<InitializedType> | fields.DataField.ToInputConfigWithOptions<InitializedType> |
	fields.DataField.ToInputConfigWithChoices<InitializedType, Options["choices"]>
): foundry.applications.fields.FormSelectOption[] | null {
	if ("options" in config) return config.options
	if (!("choices" in config)) return null

	const choices = config.choices instanceof Function ? (config.choices as Function)() : config.choices

	// Prepare options array - only accept arrays or records
	if (typeof choices === "object") {
		const options = [];
		for (const [value, entry] of Object.entries(choices)) {
			// @ts-expect-error value being overwritten is fine
			const choice = { value, ...getChoiceFromEntry(entry as string | AnyObject, config) };
			options.push(choice);
		}
		return options.length === 0 ? null : options
	}

	return null
}

/**
 * Convert a choice entry into a standardized FormSelectOption
*/
function getChoiceFromEntry(entry: string | AnyObject, { labelAttr, valueAttr, localize }: { labelAttr?: string, valueAttr?: string, localize?: boolean }): foundry.applications.fields.FormSelectOption {
	const choice: AnyMutableObject = {};
	if (foundry.utils.getType(entry) === "Object") {
		if (valueAttr && (valueAttr in (entry as AnyObject))) choice.value = (entry as AnyObject)[valueAttr];
		if (labelAttr && (labelAttr in (entry as AnyObject))) choice.label = (entry as AnyObject)[labelAttr];
		for (const k of ["group", "disabled", "rule"]) {
			if (k in (entry as AnyObject)) choice[k] = (entry as AnyObject)[k];
		}
	}
	else choice.label = String(entry)
	if (localize && choice.label) choice.label = i18n.localize(String(choice.label))
	return choice as unknown as foundry.applications.fields.FormSelectOption
}

export { getChoicesFromConfig, getChoiceFromEntry }
