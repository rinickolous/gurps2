import type DataModel from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/data.d.mts"
import type {
	ArrayField,
	DataField,
	EmbeddedDataField,
} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/fields.d.mts"

declare global {
	declare class CollectionField<
		ModelType extends DataModel.AnyConstructor,
		AssignmentElementType = CollectionField.AssignmentElementType<ModelType>,
		InitializedElementType extends DataModel.Any = CollectionField.InitializedElementType<ModelType>,
		Options extends
			CollectionField.Options<AssignmentElementType> = CollectionField.DefaultOptions<AssignmentElementType>,
		AssignmentType = CollectionField.AssignmentType<AssignmentElementType, Options>,
		InitializedType = CollectionField.InitializedType<AssignmentElementType, InitializedElementType, Options>,
		PersistedElementType = CollectionField.PersistedElementType<ModelType>,
		PersistedType extends PersistedElementType[] | null | undefined = CollectionField.PersistedType<
			AssignmentElementType,
			PersistedElementType,
			Options
		>,
	> extends ArrayField<
		fields.EmbeddedDataField<ModelType>,
		// ElementFieldType,
		AssignmentElementType,
		InitializedElementType,
		Options,
		AssignmentType,
		InitializedType,
		PersistedElementType,
		PersistedType
	> {
		/**
		 * @param element - The type of DataModel which belongs to this collection
		 * @param options - Options which configure the behavior of the field
		 */
		constructor(element: ElementFieldType, options?: Options, context?: DataField.Context)

		protected static override _validateElementType<T extends DataField.Any | DataModel.AnyConstructor>(
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

		protected override _cleanType(value: InitializedType, options?: DataField.CleanOptions): InitializedType

		protected override _validateElements(
			value: any[],
			options?: DataField.ValidationOptions<DataField.Any>,
		): DataModelValidationFailure | void

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

	declare namespace CollectionField {
		type Any = CollectionField<any, any, any, any, any, any, any, any>

		/**
		 * A shorthand for the options of an CollectionField class.
		 * @typeParam AssignmentElementType - the assignment type of the elements of the CollectionField
		 */
		type Options<AssignmentElementType> = DataFieldOptions<ArrayField.BaseAssignmentType<AssignmentElementType>>

		/**
		 * The type of the default options for the {@link CollectionField} class.
		 * @typeParam AssignmentElementType - the assignment type of the elements of the CollectionField
		 */
		type DefaultOptions<AssignmentElementType> = ArrayField.DefaultOptions<AssignmentElementType>

		/**
		 * A helper type for the given options type merged into the default options of the CollectionField class.
		 * @typeParam AssignmentElementType - the assignment type of the elements of the CollectionField
		 * @typeParam Opts                  - the options that override the default options
		 */
		type MergedOptions<AssignmentElementType, Opts extends Options<AssignmentElementType>> = SimpleMerge<
			DefaultOptions<AssignmentElementType>,
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
		type AssignmentElementType<ModelType extends DataModel.AnyConstructor> = ElementFieldType extends new (
			...args: any[]
		) => DataModel<infer Schema extends DataSchema, any>
			? SchemaField.InnerAssignmentType<Schema>
			: never

		/**
		 * A type to infer the initialized element type of an CollectionField from its ElementFieldType.
		 * @typeParam ElementFieldType - the DataField type of the elements in the CollectionField
		 */
		// type InitializedElementType<ElementFieldType extends EmbeddedDataField> = InstanceType<ElementFieldType>
		type InitializedElementType<ModelType extends DataModel.AnyConstructor> = InstanceType<ModelType>

		/**
		 * A type to infer the initialized element type of an CollectionField from its ElementFieldType.
		 * @typeParam ElementFieldType - the DataField type of the elements in the CollectionField
		 */
		// type PersistedElementType<ElementFieldType extends EmbeddedDataField> = ElementFieldType extends new (
		// 	...args: any[]
		// ) => DataModel<infer Schema extends DataSchema, any>
		// 	? SchemaField.InnerPersistedType<Schema>
		// 	: never
		type PersistedElementType<ModelType extends DataModel.AnyConstructor> = ElementFieldType extends new (
			...args: any[]
		) => DataModel<infer Schema extends DataSchema, any>
			? SchemaField.InnerPersistedType<Schema>
			: never

		/**
		 * A shorthand for the assignment type of an ArrayField class.
		 * @typeParam AssignmentElementType - the assignment type of the elements of the CollectionField
		 * @typeParam Opts                  - the options that override the default options
		 */
		type AssignmentType<
			AssignmentElementType,
			Opts extends Options<AssignmentElementType>,
		> = DataField.DerivedAssignmentType<
			AssignmentElementType[],
			// ArrayField.BaseAssignmentType<AssignmentElementType>,
			MergedOptions<AssignmentElementType, Opts>
		>

		/**
		 * A shorthand for the initialized type of an ArrayField class.
		 * @typeParam AssignmentElementType  - the assignment type of the elements of the CollectionField
		 * @typeParam InitializedElementType - the initialized type of the elements of the CollectionField
		 * @typeParam Opts                   - the options that override the default options
		 */
		type InitializedType<
			AssignmentElementType,
			InitializedElementType extends DataModel.Any,
			Opts extends Options<AssignmentElementType>,
		> = DataField.DerivedInitializedType<
			Collection<InitializedElementType>,
			// EmbeddedCollection<Document.Internal.Instance.Complete<InitializedElementType>, ParentDataModel>,
			MergedOptions<AssignmentElementType, Opts>
		>

		/**
		 * A shorthand for the persisted type of an ArrayField class.
		 * @typeParam AssignmentElementType - the assignment type of the elements of the CollectionField
		 * @typeParam PersistedElementType  - the perssited type of the elements of the CollectionField
		 * @typeParam Opts                  - the options that override the default options
		 */
		type PersistedType<
			AssignmentElementType,
			PersistedElementType,
			Opts extends Options<AssignmentElementType>,
		> = DataField.DerivedInitializedType<PersistedElementType[], MergedOptions<AssignmentElementType, Opts>>
	}
}
