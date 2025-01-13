import { AnyObject, SimpleMerge } from "fvtt-types/utils"
import DataModel = foundry.abstract.DataModel
import fields = foundry.data.fields

export { }

declare global {

	class CollectionField<
		ModelType extends DataModel.AnyConstructor,
	// AssignmentElementType = CollectionField.AssignmentElementType<ModelType>,
	// InitializedElementType extends DataModel.Any = CollectionField.InitializedElementType<ModelType>,
	// Options extends
	// CollectionField.Options<AssignmentElementType> = CollectionField.DefaultOptions<AssignmentElementType>,
	// AssignmentType = CollectionField.AssignmentType<AssignmentElementType, Options>,
	// InitializedType = CollectionField.InitializedType<AssignmentElementType, InitializedElementType, Options>,
	// PersistedElementType = CollectionField.PersistedElementType<ModelType>,
	// PersistedType extends PersistedElementType[] | null | undefined = CollectionField.PersistedType<
	// 	AssignmentElementType,
	// 	PersistedElementType,
	// 	Options
	// >,
	> extends foundry.data.fields.ArrayField<
		fields.EmbeddedDataField<ModelType>,
		Options,
		AssignmentElementType,
		InitializedElementType,
		AssignmentType,
		InitializedType,
		PersistedElementType,
		PersistedType
	> {
		/**
		 * @param element - The type of DataModel which belongs to this collection
		 * @param options - Options which configure the behavior of the field
		 */
		constructor(element: AssignmentElementType, options?: Options, context?: fields.DataField.Context)

		protected static override _validateElementType<T extends fields.DataField.Any | DataModel.AnyConstructor>(
			element: T,
		): T

		/**
		 * The Collection implementation to use when initializing the collection.
		 */
		static get implementation(): typeof Collection

		/** @defaultValue `true` */
		static override hierarchical: boolean

		/**
		 * A reference to the DataModel subclass of the embedded document element
		 */
		get model(): DataModel.AnyConstructor

		/**
		 * The DataSchema of the contained DataModel.
		 */
		get schema(): this["model"]["schema"]

		protected override _cleanType(value: InitializedType, options?: fields.DataField.CleanOptions): InitializedType

		protected override _validateElements(
			value: any[],
			options?: fields.DataField.ValidationOptions<fields.DataField.Any>,
		): foundry.data.validation.DataModelValidationFailure | void

		override initialize(
			value: PersistedType,
			model: DataModel.Any,
			options?: AnyObject,
		): InitializedType | (() => InitializedType | null)

		override toObject(value: InitializedType): PersistedType

		override apply<Value, Options, Return>(
			fn: keyof this | ((this: this, value: Value, options: Options) => Return),
			value: Value,
			options?: Options,
		): Return

		/**
		 * Migrate this field's candidate source data.
		 * @param sourceData - Candidate source data of the root model
		 * @param fieldData  - The value of this field within the source data
		 */
		migrateSource(sourceData: AnyObject, fieldData: unknown): unknown

		/**
		 * Return the embedded DataModels as a Collection.
		 * @param parent - The parent document.
		 */
		getCollection<P extends DataModel.Any>(parent: P): Collection<P>
	}

	namespace CollectionField {

		type ModelType = DataModel.AnyConstructor


		// type Any = CollectionField<any, any, any, any, any, any, any, any>

		/**
		 * A shorthand for the options of an CollectionField class.
		 * @typeParam AssignmentElementType - the assignment type of the elements of the CollectionField
		 */
		type Options<ModelType> = fields.DataField.Options<fields.ArrayField.BaseAssignmentType<ModelType>>

		/**
		 * The type of the default options for the {@link CollectionField} class.
		 * @typeParam AssignmentElementType - the assignment type of the elements of the CollectionField
		 */
		type DefaultOptions<MType extends ModelType = ModelType> = fields.ArrayField.DefaultOptions<fields.EmbeddedDataField<MType>>

		/**
		 * A helper type for the given options type merged into the default options of the CollectionField class.
		 * @typeParam AssignmentElementType - the assignment type of the elements of the CollectionField
		 * @typeParam Opts                  - the options that override the default options
		 */
		type MergedOptions<
			MType extends ModelType,
			Opts extends Options<MType>,
		> = SimpleMerge<
			DefaultOptions<MType>,
			Opts
		>

		/**
		 * A type to infer the assignment element type of an CollectionField from its ElementFieldType.
		 * @typeParam ElementFieldType - the DataField type of the elements in the CollectionField
		 */
		// type AssignmentElementType<ElementFieldType extends EmbeddedDataField> = ElementFieldType extends new (
		// 	...args: any[]
		// ) => DataModel<infer Schema extends DataSchema, any>
		// 	? SchemaField.InnerAssignmentType<Schema>
		// 	: never
		type AssignmentElementType<MType extends ModelType = ModelType> = MType extends new (
			...args: any[]
		) => DataModel<infer Schema extends fields.DataSchema, any>
			? fields.SchemaField.InnerAssignmentType<Schema>
			: never

		/**
		 * A type to infer the initialized element type of an CollectionField from its ElementFieldType.
		 * @typeParam ElementFieldType - the DataField type of the elements in the CollectionField
		 */
		type InitializedElementType<MType extends ModelType = ModelType> = InstanceType<MType>

		/**
		 * A type to infer the initialized element type of an CollectionField from its ElementFieldType.
		 * @typeParam ElementFieldType - the DataField type of the elements in the CollectionField
		 */
		type PersistedElementType<MType extends ModelType = ModelType> = MType extends new (
			...args: any[]
		) => DataModel<infer Schema extends fields.DataSchema, any>
			? fields.SchemaField.InnerPersistedType<Schema>
			: never

		/**
		 * A shorthand for the assignment type of an ArrayField class.
		 * @typeParam AssignmentElementType - the assignment type of the elements of the CollectionField
		 * @typeParam Opts                  - the options that override the default options
		 */
		type AssignmentType<
			MType extends ModelType,
			Opts extends Options<MType>,
		> = fields.DataField.DerivedAssignmentType<
			MType[],
			// ArrayField.BaseAssignmentType<AssignmentElementType>,
			MergedOptions<MType, Opts>
		>

		/**
		 * A shorthand for the initialized type of an ArrayField class.
		 * @typeParam AssignmentElementType  - the assignment type of the elements of the CollectionField
		 * @typeParam InitializedElementType - the initialized type of the elements of the CollectionField
		 * @typeParam Opts                   - the options that override the default options
		 */
		type InitializedType<
			MType extends ModelType,
			IEType extends InitializedElementType<MType>,
			Opts extends Options<MType> = Options<MType>,
		> = fields.DataField.DerivedInitializedType<
			Collection<IEType>,
			MergedOptions<AssignmentElementType, Opts>
		>

		/**
		 * A shorthand for the persisted type of an ArrayField class.
		 * @typeParam AssignmentElementType - the assignment type of the elements of the CollectionField
		 * @typeParam PersistedElementType  - the perssited type of the elements of the CollectionField
		 * @typeParam Opts                  - the options that override the default options
		 */
		type PersistedType<
			MType extends ModelType,
			PersistedElementType,
			Opts extends Options<MType>,
		> = fields.DataField.DerivedInitializedType<PersistedElementType[], MergedOptions<AssignmentElementType, Opts>>
	}
}
