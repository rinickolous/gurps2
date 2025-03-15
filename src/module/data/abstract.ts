import { DocumentSystemFlags } from "@documents/system-flags.ts"
import fields = foundry.data.fields
import DataSchema = foundry.data.fields.DataSchema
import { SYSTEM_NAME } from "@util"
import { AnyMutableObject, AnyObject, DeepPartial } from "fvtt-types/utils"

// Immiscible keys
const immiscibleKeys = new Set([
	"prototype",
	"length",
	"name",
	"mixed",
	"cleanData",
	"_cleanData",
	"validateJoint",
	"_validateJoint",
	"migrateData",
	"_migrateData",
	"shimData",
	"_shimData",
	"defineSchema",
] as const)

type ImmiscibleKeys = typeof immiscibleKeys extends Set<infer Key> ? Key : never

declare class AnySystemDataModel extends SystemDataModel<any, any> {
	constructor(...args: any[])
}

// Combined class type
type Mixed<T extends Array<typeof AnySystemDataModel>> = ImmiscibleToConcrete<_Mixed<T>>

// Combine static types, excluding immiscible keys
type _Mixed<T extends (typeof AnySystemDataModel)[]> = T extends [
	infer First extends typeof AnySystemDataModel,
	...infer Rest extends (typeof AnySystemDataModel)[],
]
	? ImmiscibleToAny<First> & _Mixed<Rest>
	: {}

// @ts-expect-error - This is effectively a faux subclass of `T` which tsc isn't too fond of.
// It can be unsound but in this case there's no other way to do it.
interface ImmiscibleToAny<T extends object> extends Record<ImmiscibleKeys, any>, T {}

// @ts-expect-error - This is effectively a faux subclass of `T` which tsc isn't too fond of.
// It can be unsound but in this case there's no other way to do it.
interface ImmiscibleToConcrete<T extends object> extends ConcreteImmiscible, T {}

interface ConcreteImmiscible {
	prototype: typeof AnySystemDataModel.prototype
	length: number
	name: string
	cleanData: typeof AnySystemDataModel.cleanData
	validateJoint: typeof SystemDataModel.validateJoint
	migrateData: typeof SystemDataModel.migrateData
	shimData: typeof SystemDataModel.shimData
	defineSchema: typeof SystemDataModel.defineSchema

	mixed: unknown // This may be relevant to your repo.
	// These are probably dnd5e constructs.
	_cleanData: unknown
	_validateJoint: unknown
	_migrateData: unknown
	_shimData: unknown
}

/* -------------------------------------------- */

interface SystemDataModelMetadata<T extends DocumentSystemFlags = DocumentSystemFlags> {
	systemFlagsModel: Constructor<T> | null
}

/* -------------------------------------------- */

class SystemDataModel<
	Schema extends DataSchema = DataSchema,
	Parent extends Item | Actor = Item | Actor,
> extends foundry.abstract.TypeDataModel<Schema, Parent> {
	static _enableV10Validation = true

	/* -------------------------------------------- */

	/**
	 * System type that this system data model represents (e.g. "character", "npc", "vehicle").
	 */
	static _systemType: string

	/* -------------------------------------------- */

	/**
	 * Base templates used for construction.
	 */
	static _schemaTemplates: (typeof SystemDataModel)[] = []

	/* -------------------------------------------- */

	/**
	 * The field names of the base templates used for construction.
	 */
	private static get _schemaTemplateFields(): Set<string> {
		const fieldNames = Object.freeze(new Set(this._schemaTemplates.map(t => t.schema.keys()).flat()))
		Object.defineProperty(this, "_schemaTemplateFields", {
			value: fieldNames,
			writable: false,
			configurable: false,
		})
		return fieldNames
	}

	/* -------------------------------------------- */

	/**
	 * A list of properties that should not be mixed-in to the final type.
	 */
	private static _immiscible: Set<string> = immiscibleKeys

	/* -------------------------------------------- */

	/**
	 * Metadata that describes this DataModel.
	 */
	static metadata: SystemDataModelMetadata = Object.freeze({
		systemFlagsModel: null,
	})

	get metadata(): SystemDataModelMetadata {
		return this.constructor.metadata
	}

	/* -------------------------------------------- */

	static override defineSchema(): DataSchema {
		const schema = {}
		for (const template of this._schemaTemplates) {
			if (!template.defineSchema) {
				throw new Error(
					`Invalid ${SYSTEM_NAME} template mixin ${template} defined on class ${this.constructor}`,
				)
			}
			this.mergeSchema(schema, template.defineSchema())
		}
		return schema
	}

	/* -------------------------------------------- */

	/**
	 * Merge two schema definitions together as well as possible.
	 * @param {DataSchema} a  First schema that forms the basis for the merge. *Will be mutated.*
	 * @param {DataSchema} b  Second schema that will be merged in, overwriting any non-mergeable properties.
	 * @returns {DataSchema}  Fully merged schema.
	 */
	static mergeSchema<A extends DataSchema, B extends DataSchema>(a: A, b: B): A & B {
		Object.assign(a, b)
		return a as A & B
	}

	/* -------------------------------------------- */
	/*  Data Cleaning                               */
	/* -------------------------------------------- */

	// static override cleanData(source?: AnyMutableObject, options?: Record<string, unknown>): object {
	static override cleanData(
		source?: AnyMutableObject,
		options?: Parameters<fields.SchemaField.Any["clean"]>[1],
	): AnyMutableObject {
		this._cleanData(source, options)
		return super.cleanData(source, options)
	}

	/* -------------------------------------------- */

	/**
	 * Performs cleaning without calling DataModel.cleanData.
	 * @param {object} [source]         The source data
	 * @param {object} [options={}]     Additional options (see DataModel.cleanData)
	 */
	static _cleanData(source?: AnyMutableObject, options?: Parameters<fields.SchemaField.Any["clean"]>[1]) {
		for (const template of this._schemaTemplates) {
			template._cleanData(source, options)
		}
	}

	/* -------------------------------------------- */
	/*  Data Initialization                         */
	/* -------------------------------------------- */

	static override *_initializationOrder(): Generator<[string, foundry.data.fields.DataField], void> {
		for (const template of this._schemaTemplates) {
			for (const entry of template._initializationOrder()) {
				entry[1] = this.schema.get(entry[0])!
				yield entry
			}
		}
		for (const entry of this.schema.entries()) {
			if (this._schemaTemplateFields.has(entry[0])) continue
			yield entry
		}
	}

	/* -------------------------------------------- */
	/*  Socket Event Handlers                       */
	/* -------------------------------------------- */

	/**
	 * Pre-creation logic for this system data.
	 * @param _data               The initial data object provided to the document creation request.
	 * @param _options            Additional options which modify the creation request.
	 * @param _user               The User requesting the document creation.
	 * @returns {Promise<boolean|void>}   A return value of false indicates the creation operation should be cancelled.
	 */
	protected override async _preCreate(
		_data: foundry.abstract.TypeDataModel.ParentAssignmentType<Schema, Parent>,
		_options: foundry.abstract.Document.Database.PreCreateOptions<any>,
		_user: User,
	): Promise<boolean | void> {}

	/**
	 * Pre-update logic for this system data.
	 * @param _data               The initial data object provided to the document creation request.
	 * @param _options            Additional options which modify the creation request.
	 * @param _user               The User requesting the document creation.
	 * @returns {Promise<boolean|void>}   A return value of false indicates the creation operation should be cancelled.
	 */
	async _preUpdate(
		_changes: DeepPartial<foundry.abstract.TypeDataModel.ParentAssignmentType<Schema, Parent>>,
		_options: foundry.abstract.Document.Database.PreUpdateOptions<any>,
		_user: User.Implementation,
	): Promise<boolean | void> {}

	/**
	 * Pre-delete logic for this system data.
	 * @param _options Additional options which modify the creation request.
	 * @param _user    The User requesting the document creation.
	 * @returns        A return value of false indicates the creation operation should be cancelled.
	 */
	async _preDelete(
		_options: foundry.abstract.Document.Database.PreDeleteOperationInstance<any>,
		_user: User,
	): Promise<boolean | void> {}

	override _onCreate(
		data: foundry.abstract.TypeDataModel.ParentAssignmentType<Schema, Parent>,
		options: foundry.abstract.Document.Database.CreateOptions<any>,
		userId: string,
	): void {
		super._onCreate(data, options, userId)
	}

	/* -------------------------------------------- */

	_onUpdate(
		_changed: DeepPartial<foundry.abstract.TypeDataModel.ParentAssignmentType<Schema, Parent>>,
		_options: foundry.abstract.Document.Database.UpdateOperation<any>,
		_userId: string,
	) {}

	/* -------------------------------------------- */

	_onDelete(_options: foundry.abstract.Document.Database.DeleteOptions<any>, _userId: string) {}

	/* -------------------------------------------- */
	/*  Data Validation                             */
	/* -------------------------------------------- */

	override validate(options?: {
		/**
		 * A specific set of proposed changes to validate, rather than the full source data of the model.
		 */
		changes?: fields.SchemaField.AssignmentData<Schema>

		/**
		 * If changes are provided, attempt to clean the changes before validating them?
		 * @defaultValue `false`
		 */
		clean?: boolean

		/**
		 * Allow replacement of invalid values with valid defaults?
		 * @defaultValue `false`
		 */
		fallback?: boolean

		/**
		 * If true, invalid embedded documents will emit a warning and
		 * be placed in the invalidDocuments collection rather than
		 * causing the parent to be considered invalid.
		 * @defaultValue `false`
		 */
		dropInvalidEmbedded: boolean

		/**
		 * Throw if an invalid value is encountered, otherwise log a warning?
		 * @defaultValue `true`
		 */
		strict?: boolean

		/**
		 * Perform validation on individual fields?
		 * @defaultValue `true`
		 */
		fields?: boolean

		/**
		 * Perform joint validation on the full data model?
		 * Joint validation will be performed by default if no changes are passed.
		 * Joint validation will be disabled by default if changes are passed.
		 * Joint validation can be performed on a complete set of changes (for
		 * example testing a complete data model) by explicitly passing true.
		 */
		joint?: boolean
	}) {
		if (this.constructor._enableV10Validation === false) return true
		return super.validate(options)
	}

	/* -------------------------------------------- */
	/*  Data Validation                             */
	/* -------------------------------------------- */

	// static override validateJoint(data: Record<string, unknown>) {
	// TODO: see if this does anything anymore
	static override validateJoint(data: never) {
		this._validateJoint(data)
		return super.validateJoint(data)
	}

	/* -------------------------------------------- */

	/**
	 * Performs joint validation without calling DataModel.validateJoint.
	 * @param  data The source data
	 * @throws      An error if a validation failure is detected
	 */
	protected static _validateJoint(data: Record<string, unknown>) {
		for (const template of this._schemaTemplates) {
			template._validateJoint(data)
		}
	}

	/* -------------------------------------------- */
	/*  Data Migration                              */
	/* -------------------------------------------- */

	/** @inheritdoc */
	static override migrateData(source: AnyObject) {
		this._migrateData(source)
		return super.migrateData(source)
	}

	/* -------------------------------------------- */

	/**
	 * Performs migration without calling DataModel.migrateData.
	 */
	static _migrateData(source: AnyObject) {
		for (const template of this._schemaTemplates) {
			template._migrateData(source)
		}
	}

	/* -------------------------------------------- */

	static override shimData(
		data: AnyMutableObject,
		options?: foundry.abstract.DataModel.ShimDataOptions,
	): AnyMutableObject {
		this._shimData(data, options)
		return super.shimData(data, options)
	}

	/* -------------------------------------------- */

	/**
	 * Performs shimming without calling DataModel.shimData.
	 * @param {object} data         The source data
	 * @param {object} [options]    Additional options (see DataModel.shimData)
	 * @protected
	 */
	static _shimData(data: AnyMutableObject, options?: foundry.abstract.DataModel.ShimDataOptions): void {
		for (const template of this._schemaTemplates) {
			template._shimData(data, options)
		}
	}

	/* -------------------------------------------- */
	/*  Data Preparation                            */
	/* -------------------------------------------- */

	override prepareBaseData(): void {
		super.prepareDerivedData()
	}

	/* -------------------------------------------- */

	override prepareDerivedData(): void {
		super.prepareDerivedData()
	}

	/* -------------------------------------------- */

	// override  toObject(source: true): this["_source"];
	override toObject<Source extends boolean | undefined>(
		source?: Source,
	): Source extends false
		? fields.SchemaField.PersistedData<Schema>
		: Readonly<fields.SchemaField.PersistedData<Schema>> {
		return super.toObject(source)
	}

	/* -------------------------------------------- */
	/*  Mixins                                      */
	/* -------------------------------------------- */

	/**
	 * Mix multiple templates with the base type.
	 */
	static mixin<T extends Array<typeof SystemDataModel<any, any>>>(...templates: T): Mixed<T> {
		for (const template of templates) {
			if (!(template.prototype instanceof SystemDataModel)) {
				throw new Error(`${template.name} is not a subclass of SystemDataModel`)
			}
		}

		const Base = class extends this {}
		Object.defineProperty(Base, "_schemaTemplates", {
			value: Object.seal([...this._schemaTemplates, ...templates]),
			writable: false,
			configurable: false,
		})

		for (const template of templates) {
			// Take all static methods and fields from template and mix in to base class
			for (const [key, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(template))) {
				if (this._immiscible.has(key)) continue
				Object.defineProperty(Base, key, descriptor)
			}

			// Take all instance methods and fields from template and mix in to base class
			for (const [key, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(template.prototype))) {
				if (["constructor"].includes(key)) continue
				Object.defineProperty(Base.prototype, key, descriptor)
			}
		}

		// HACK: need to see if this works
		return Base as any
	}
}

interface SystemDataModel<Schema extends DataSchema, Parent extends Item | Actor>
	extends foundry.abstract.TypeDataModel<Schema, Parent> {
	constructor: typeof SystemDataModel<Schema, Parent>
}

export { SystemDataModel, type SystemDataModelMetadata }
