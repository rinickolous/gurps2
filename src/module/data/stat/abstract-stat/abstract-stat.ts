abstract class AbstractStat<
	TSchema extends AbstractStatSchema = AbstractStatSchema,
	TActor extends ActorDataModel = ActorDataModel,
> extends foundry.abstract.DataModel<TSchema, TActor> {
	static override defineSchema(): AbstractStatSchema {
		const fields = foundry.data.fields
		return {
			id: new fields.StringField({ required: true, nullable: false, initial: "id" }),
		}
	}

	/* -------------------------------------------- */

	constructor(data: DeepPartial<SourceFromSchema<TSchema>>, options?: AbstractStatConstructionOptions<TActor>) {
		super(data, options)
	}

	/* -------------------------------------------- */

	abstract get definition(): AbstractStatDef | null

	/* -------------------------------------------- */

	get actor(): ActorGURPS2 {
		return this.parent.parent
	}

	/* -------------------------------------------- */

	/** Effective value of the attribute, not taking into account modifiers from temporary effects */
	get max(): number {
		const def = this.definition
		if (!def) return 0
		return def.baseValue(this.actor.system)
	}

	/* -------------------------------------------- */

	/** Current value of the attribute, applies only to pools */
	get current(): number {
		return this.max
	}

	/* -------------------------------------------- */

	/** Effective value of the attribute, taking into account modifiers from temporary effects */
	get temporaryMax(): number {
		return this.max
	}
}

type AbstractStatSchema = {
	id: fields.StringField<string, string, true, false>
}
interface AbstractStatConstructionOptions<TActor extends ActorDataModel> extends DataModelConstructionOptions<TActor> {
	order?: number
}
export { AbstractStat, type AbstractStatSchema, type AbstractStatConstructionOptions }
