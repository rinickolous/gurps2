import { ActiveEffectGURPS } from "@module/documents/active-effect.ts"
import fields = foundry.data.fields
import { AnyObject } from "fvtt-types/utils"

class AppliedEffectField<
	Options extends fields.SchemaField.Options<AppliedEffectFieldSchema> = fields.SchemaField.DefaultOptions,
> extends fields.SchemaField<AppliedEffectFieldSchema, Options> {
	constructor(
		fields: { [K in keyof AppliedEffectFieldSchema]: AppliedEffectFieldSchema[K] },
		options?: Options,
		context?: fields.DataField.Context,
	) {
		fields._id ||= new foundry.data.fields.DocumentIdField()
		super(
			{
				...fields,
			},
			options,
			context,
		)
	}

	/* -------------------------------------------- */

	override initialize(
		value: fields.SchemaField.PersistedType<AppliedEffectFieldSchema, Options>,
		model: foundry.abstract.DataModel.Any,
		options?: AnyObject,
	):
		| fields.SchemaField.InitializedType<AppliedEffectFieldSchema, Options>
		| (() => fields.SchemaField.InitializedType<AppliedEffectFieldSchema, Options> | null) {
		const obj = super.initialize(value, model, options)
		const item = model as unknown as Item

		Object.defineProperty(obj, "effect", {
			get(): ActiveEffectGURPS {
				// TODO: review
				return item.effects?.get(this._id) as ActiveEffectGURPS
			},
			configurable: true,
		})
		return obj
	}
}

type AppliedEffectFieldSchema = {
	_id: fields.DocumentIdField
}

export { AppliedEffectField }
