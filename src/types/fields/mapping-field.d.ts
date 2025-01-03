import { SimpleMerge } from "fvtt-types/utils";
import fields = foundry.data.fields

declare global {

	namespace MappingField {

		/**
		 * A shorthand for the options of an ArrayField class.
		 * @typeParam AssignmentElementType - the assignment type of the elements in the array
		 */
		type Options<AssignmentElementType> = fields.DataField.Options<BaseAssignmentType<AssignmentElementType>>;

		type AnyOptions = Options<unknown>;

		/**
		 * The base assignment type for the {@link MappingField} class.
		 * @typeParam AssignmentElementType - the assignment type of the elements in the array
		 */
		type BaseAssignmentType<AssignmentElementType> =
			| Record<number | string, AssignmentElementType>
		// | Iterable<AssignmentElementType>
		// | AssignmentElementType[]
		// | AssignmentElementType;

		/**
		 * The type of the default options for the {@link ArrayField} class.
		 * @typeParam AssignmentElementType - the assignment type of the elements in the array
		 */
		type DefaultOptions<AssignmentElementType> = SimpleMerge<
			fields.DataField.DefaultOptions,
			{
				required: true;
				nullable: false;
				initial: () => Record<number | string, AssignmentElementType>;
			}
		>;

		/**
		 * A helper type for the given options type merged into the default options of the ArrayField class.
		 * @typeParam AssignmentElementType - the assignment type of the elements of the ArrayField
		 * @typeParam Opts                  - the options that override the default options
		 */
		type MergedOptions<AssignmentElementType, Opts extends AnyOptions> = SimpleMerge<
			DefaultOptions<AssignmentElementType>,
			Opts
		>;

		/**
		 * A type to infer the assignment element type of an ArrayField from its ElementFieldType.
		 * @typeParam ElementFieldType - the DataField type of the elements in the ArrayField
		 */
		type AssignmentElementType<ElementFieldType extends fields.DataField.Any> =
			ElementFieldType extends fields.DataField<any, infer Assign, any, any>
			? Assign
			: never;

		/**
		 * A type to infer the initialized element type of an ArrayField from its ElementFieldType.
		 * @typeParam ElementFieldType - the DataField type of the elements in the ArrayField
		 */
		type InitializedElementType<ElementFieldType extends fields.DataField.Any> =
			ElementFieldType extends fields.DataField<any, any, infer Init, any>
			? Init
			: never;

		/**
		 * A type to infer the initialized element type of an ArrayField from its ElementFieldType.
		 * @typeParam ElementFieldType - the DataField type of the elements in the ArrayField
		 */
		type PersistedElementType<ElementFieldType extends fields.DataField.Any> =
			ElementFieldType extends fields.DataField<any, any, any, infer Persist>
			? Persist
			: never;

		/**
		 * A shorthand for the assignment type of an ArrayField class.
		 * @typeParam AssignmentElementType - the assignment type of the elements of the ArrayField
		 * @typeParam Opts                  - the options that override the default options
		 */
		type AssignmentType<AssignmentElementType, Opts extends AnyOptions> = fields.DataField.DerivedAssignmentType<
			BaseAssignmentType<AssignmentElementType>,
			MergedOptions<AssignmentElementType, Opts>
		>;

		/**
		 * A shorthand for the initialized type of an ArrayField class.
		 * @typeParam AssignmentElementType  - the assignment type of the elements of the ArrayField
		 * @typeParam InitializedElementType - the initialized type of the elements of the ArrayField
		 * @typeParam Opts                   - the options that override the default options
		 */
		type InitializedType<
			AssignmentElementType,
			InitializedElementType,
			Opts extends AnyOptions,
		> = fields.DataField.DerivedInitializedType<Record<number | string, InitializedElementType>, MergedOptions<AssignmentElementType, Opts>>;

		/**
		 * A shorthand for the persisted type of an ArrayField class.
		 * @typeParam AssignmentElementType - the assignment type of the elements of the ArrayField
		 * @typeParam PersistedElementType  - the perssited type of the elements of the ArrayField
		 * @typeParam Opts                  - the options that override the default options
		 */
		type PersistedType<
			AssignmentElementType,
			PersistedElementType,
			Opts extends AnyOptions,
		> = fields.DataField.DerivedInitializedType<Record<number | string, PersistedElementType>, MergedOptions<AssignmentElementType, Opts>>;


	}
}
