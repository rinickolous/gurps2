import { Stat, StatClass } from "@data/stat/types.ts";
import { MappingField } from "./mapping-field.ts";
import { AnyObject } from "fvtt-types/utils";
import fields = foundry.data.fields
import { ActorDataModel } from "@data/actor/base.ts";

class StatsField<
	const	ModelType extends StatClass,
	const	Options extends MappingField.Options<AnyObject>
> extends MappingField<
	StatField<ModelType>,
	Options,
	StatField<ModelType>,
	StatField<ModelType>,
	Collection<InstanceType<ModelType>>,
	Collection<InstanceType<ModelType>>,
	AnyObject,
	Record<string, AnyObject>
> {

	constructor(model: ModelType, options?: Options) {
		super(new StatField(model), options)
	}

	/* -------------------------------------------- */

	override initialize(value: any, model: foundry.abstract.DataModel.Any, options?: AnyObject): Collection<InstanceType<ModelType>> {
		super.initialize(value, model)
		const stats = Object.values(super.initialize(value, model, options) as unknown as Record<string, InstanceType<ModelType>>)
		// stats.sort((a, b) => a.sort - b.sort)
		return new Collection(stats.map(e => [e.id, e]))
	}

}

class StatField<
	const ModelType extends StatClass,
	const Options extends fields.DataField.Options<InstanceType<ModelType>> = fields.DataField.DefaultOptions,
> extends fields.DataField<Options, Stat, Stat, AnyObject> {

	/* -------------------------------------------- */

	static override recursive = true

	/* -------------------------------------------- */

	private _model: ModelType

	/* -------------------------------------------- */

	constructor(model: ModelType, options?: Options) {
		super(options)
		this._model = model
	}

	/* -------------------------------------------- */

	protected override _cast(value: InstanceType<ModelType>): InstanceType<ModelType> {
		console.log(value)
		return value
	}

	/* -------------------------------------------- */

	protected override _cleanType(value: InstanceType<ModelType>, options?: fields.DataField.CleanOptions): InstanceType<ModelType> {
		return this._model.cleanData(value, { ...options }) as InstanceType<ModelType>
	}

	/* -------------------------------------------- */

	override initialize(value: AnyObject, model: ActorDataModel, options?: AnyObject): InstanceType<ModelType> {
		return new this._model(value as object, { parent: model, ...options }) as InstanceType<ModelType>
	}

	/* -------------------------------------------- */

	migrateSource(_sourceData: object, fieldData: any) {
		this._model.migrateDataSafe(fieldData)
	}

}

export { StatsField }
