import { ActorDataModel } from "@data/actor/base.ts"
import { AbstractStatDefinition } from "./abstract-stat-definition.ts"
import { ActorGURPS } from "@documents"
import fields = foundry.data.fields
import { AnyObject } from "fvtt-types/utils"

abstract class AbstractStat<
	Schema extends AbstractStatSchema = AbstractStatSchema,
	Parent extends ActorDataModel = ActorDataModel,
> extends foundry.abstract.DataModel<Schema, Parent> {
	static override defineSchema(): AbstractStatSchema {
		const fields = foundry.data.fields
		return {
			id: new fields.StringField({ required: true, nullable: false, initial: "id" }),
		}
	}

	/* -------------------------------------------- */


	constructor(
		data?: foundry.abstract.DataModel.ConstructorData<Schema>,
		options?: foundry.abstract.DataModel.DataValidationOptions<Parent> & AnyObject
	) {
		super(data, options)
	}

	/* -------------------------------------------- */

	abstract get definition(): AbstractStatDefinition | null

	/* -------------------------------------------- */

	get actor(): ActorGURPS {
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
	id: fields.StringField<{ required: true, nullable: false }>
}

// interface AbstractStatConstructionOptions<TActor extends ActorDataModel> extends DataModelConstructionOptions<TActor> {
// 	order?: number
// }

// export { AbstractStat, type AbstractStatSchema, type AbstractStatConstructionOptions }
export { AbstractStat, type AbstractStatSchema }
