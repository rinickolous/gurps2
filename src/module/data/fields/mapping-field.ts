import { ErrorGURPS } from "@util"
import fields = foundry.data.fields
import { AnyObject } from "fvtt-types/utils"

type MappingFieldInitialValueBuilder = (key: string, initial: object, existing: object) => object

class MappingField<
	// const ElementFieldType extends fields.DataField.Any,
	// const ModelType extends AnyConstructor,
	// const AssignmentElementType = MappingField.AssignmentElementType<ElementFieldType>,
	// const InitializedElementType = MappingField.InitializedElementType<ElementFieldType>,
	// const Options extends MappingField.Options<AssignmentElementType, ModelType> = MappingField.DefaultOptions,
	// const AssignmentType = MappingField.AssignmentType<AssignmentElementType, ModelType, Options>,
	// const InitializedType = MappingField.InitializedType<
	// 	AssignmentElementType,
	// 	InitializedElementType,
	// 	ModelType,
	// 	Options
	// >,
	// const PersistedElementType = MappingField.PersistedElementType<ElementFieldType>,
	// const PersistedType extends Record<string, PersistedElementType> | null | undefined = MappingField.PersistedType<
	// 	ModelType,
	// 	AssignmentElementType,
	// 	PersistedElementType,
	// 	Options
	// >,
	const ElementFieldType extends fields.DataField.Any,
	const Options extends MappingField.AnyOptions = MappingField.DefaultOptions<MappingField.AssignmentElementType<ElementFieldType>>,
	const AssignmentElementType = MappingField.AssignmentElementType<ElementFieldType>,
	const InitializedElementType = MappingField.InitializedElementType<ElementFieldType>,
	const AssignmentType = MappingField.AssignmentType<AssignmentElementType, Options>,
	const InitializedType = MappingField.InitializedType<
		AssignmentElementType,
		InitializedElementType,
		Options
	>,
	const PersistedElementType = MappingField.PersistedElementType<ElementFieldType>,
	const PersistedType extends Record<string, PersistedElementType> | null | undefined = MappingField.PersistedType<
		AssignmentElementType,
		PersistedElementType,
		Options
	>,
> extends fields.ObjectField<Options, AssignmentType, InitializedType, PersistedType> {
	model: fields.DataField
	declare initialKeys: string[]
	declare initialValue: MappingFieldInitialValueBuilder
	initialKeysOnly = false

	constructor(model: AssignmentElementType, options: Options) {
		if (!(model instanceof fields.DataField)) {
			throw ErrorGURPS("MappingField must have a DataField as its contained element")
		}
		super(options)

		this.model = model
		model.parent = this
	}

	/* -------------------------------------------- */

	static override get _defaults(): fields.DataField.Options<AnyObject> {
		return foundry.utils.mergeObject(super._defaults, {
			initialKeys: null,
			initialValue: null,
			initialKeysOnly: false,
		})
	}

	/* -------------------------------------------- */

	protected override _cleanType(value: InitializedType, options?: fields.DataField.CleanOptions): InitializedType {
		Object.entries(value as object).forEach(([k, v]) => ((value as any)[k] = this.model.clean(v, options)))
		return value
	}

	/* -------------------------------------------- */

	override getInitialValue(data: fields.DataField.CleanOptions["source"]): InitializedType {
		let keys = this.initialKeys
		const initial = super.getInitialValue(data)
		if (!keys || !foundry.utils.isEmpty(initial as object)) return initial
		if (!(keys instanceof Array)) keys = Object.keys(keys)
		for (const key of keys) (initial as any)[key] = this._getInitialValueForKey(key)
		return initial
	}

	/* -------------------------------------------- */

	/**
	 * Get the initial value for the provided key.
	 * @param {string} key       Key within the object being built.
	 * @param {object} [object]  Any existing mapping data.
	 * @returns {*}              Initial value based on provided field type.
	 */
	_getInitialValueForKey(key: string, object?: object): object {
		const initial = this.model.getInitialValue({})
		return this.initialValue?.(key, initial as object, object ?? {}) ?? initial
	}

	/* -------------------------------------------- */

	override _validateType(value: InitializedType, options?: fields.DataField.ValidationOptions<fields.DataField.Any>) {
		if (foundry.utils.getType(value) !== "Object") throw new Error("must be an Object")
		const errors = this._validateValues(value, options)
		if (!foundry.utils.isEmpty(errors))
			throw new foundry.data.validation.DataModelValidationError(Object.values(errors)[0])
	}

	/* -------------------------------------------- */

	/**
	 * Validate each value of the object.
	 */
	_validateValues(
		value: InitializedType,
		options?: fields.DataField.ValidationOptions<fields.DataField.Any>,
	): Record<string, foundry.data.validation.DataModelValidationFailure> {
		const errors: Record<string, foundry.data.validation.DataModelValidationFailure> = {}
		for (const [k, v] of Object.entries(value as object)) {
			const error = this.model.validate(v, options)
			if (error) errors[k] = error
		}
		return errors
	}

	/* -------------------------------------------- */

	override initialize(
		value: PersistedType,
		model: foundry.abstract.DataModel.Any,
		options?: AnyObject,
	): (() => InitializedType | null) | InitializedType {
		if (!value) return value as unknown as InitializedType

		const obj: Record<string, unknown> = {}
		const initialKeys = this.initialKeys instanceof Array ? this.initialKeys : Object.keys(this.initialKeys ?? {})
		const keys = this.initialKeysOnly ? initialKeys : Object.keys(value)
		for (const key of keys) {
			const data = (value as Record<string, unknown>)[key] ?? this._getInitialValueForKey(key, value)
			obj[key] = this.model.initialize(data, model, options)
		}
		return obj as unknown as InitializedType
	}

	/* -------------------------------------------- */

	protected override _getField(path: string[]): unknown {
		if (path.length === 0) return this
		else if (path.length === 1) return this.model
		path.shift()
		// @ts-expect-error ignoring protected in this case
		return this.model._getField(path)
	}
}

export { MappingField }
