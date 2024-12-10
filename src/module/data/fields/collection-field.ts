import DataModel = foundry.abstract.DataModel
import fields = foundry.data.fields

class CollectionField<
	ModelType extends DataModel.AnyConstructor,
	AssignmentElementType = CollectionField.AssignmentElementType<fields.EmbeddedDataField<ModelType>>,
	InitializedElementType extends
		DataModel.Any = CollectionField.InitializedElementType<// fields.EmbeddedDataField<ModelType>
	ModelType>,
	Options extends
		CollectionField.Options<AssignmentElementType> = CollectionField.DefaultOptions<AssignmentElementType>,
	AssignmentType = CollectionField.AssignmentType<AssignmentElementType, Options>,
	InitializedType = CollectionField.InitializedType<AssignmentElementType, InitializedElementType, Options>,
	PersistedElementType = CollectionField.PersistedElementType<fields.EmbeddedDataField<ModelType>>,
	PersistedType extends PersistedElementType[] | null | undefined = CollectionField.PersistedType<
		AssignmentElementType,
		PersistedElementType,
		Options
	>,
> extends fields.ArrayField<
	fields.EmbeddedDataField<ModelType>,
	AssignmentElementType,
	InitializedElementType,
	Options,
	AssignmentType,
	InitializedType,
	PersistedElementType,
	PersistedType
> {
	constructor(model: ModelType, options?: Options, context?: fields.DataField.Context) {
		const fields = foundry.data.fields
		super(new fields.EmbeddedDataField(model), options, context)
	}

	/* -------------------------------------------- */

	static get implementation(): typeof Collection {
		return Collection
	}

	/* -------------------------------------------- */

	static override hierarchical = true

	/* -------------------------------------------- */

	get model(): ModelType {
		return this.element.model
	}

	/* -------------------------------------------- */

	get schema(): this["model"]["schema"] {
		return this.model.schema
	}

	/* -------------------------------------------- */

	protected override _cast(value: AssignmentType): InitializedType {
		if (foundry.utils.getType(value) !== "Map") return super._cast(value)
		const arr = []
		// @ts-expect-error weird types, TODO: fix
		for (const [id, v] of value.entries()) {
			if (!("_id" in v)) v._id = id
			arr.push(v)
		}
		// @ts-expect-error weird types, TODO: fix
		return super._cast(arr)
	}

	/* -------------------------------------------- */

	protected override _cleanType(value: InitializedType, options?: fields.DataField.CleanOptions): InitializedType {
		// @ts-expect-error weird types, TODO: fix
		return value.map((v: InitializedElementType) => this.schema.clean(v, { ...options, source: v }))
	}
}

export { CollectionField }
