import { AttributeDefinition } from "./attribute/attribute-definition.ts"
import fields = foundry.data.fields
import { ErrorGURPS, threshold } from "@util"
import { ActorGURPS } from "@documents/actor.ts"
import { evaluateToNumber, VariableResolver } from "@util/gcs/index.ts"

class PoolThreshold extends foundry.abstract.DataModel<
	PoolThresholdSchema,
	AttributeDefinition | ResourceTrackerDefinition
> {
	static override defineSchema(): PoolThresholdSchema {
		const fields = foundry.data.fields
		return {
			state: new fields.StringField({
				required: true,
				nullable: false,
				initial: "",
				label: "GURPS.Attribute.Threshold.FIELDS.State.Name",
			}),
			explanation: new fields.StringField({
				required: false,
				nullable: false,
				initial: "",
				label: "GURPS.Attribute.Threshold.FIELDS.Explanation.Name",
			}),
			expression: new fields.StringField({
				required: true,
				nullable: false,
				initial: "",
				label: "GURPS.Attribute.Threshold.FIELDS.Expression.Name",
			}),
			ops: new fields.ArrayField(
				new fields.StringField({
					required: false,
					nullable: false,
					choices: threshold.OpsChoices,
				}),
				{ required: false, nullable: false, label: "GURPS.Attribute.Threshold.FIELDS.Ops.Name" },
			),
		}
	}

	/* -------------------------------------------- */

	get actor(): ActorGURPS {
		return this.parent.actor
	}

	/* -------------------------------------------- */

	/*
	 * Returns the index of this threshold within the Attribute definition it is contained in
	 */
	get index(): number {
		const index = this.parent.thresholds?.indexOf(this) ?? null
		if (index === null) throw ErrorGURPS(`Pool Threshold with state "${this.state} has no index.`)
		return index
	}

	/* -------------------------------------------- */

	/*
	 * Returns the minimum value which falls within this threshold
	 */
	get min(): number {
		const nextThreshold = this.parent.thresholds![this.index - 1] ?? null
		if (this.index === 0 || nextThreshold === null) return Number.MIN_SAFE_INTEGER
		return nextThreshold.threshold()
	}

	/* -------------------------------------------- */

	/*
	 * Returns the maximum value which falls within this threshold
	 */
	get max(): number {
		return this.threshold()
	}

	/* -------------------------------------------- */

	threshold(actor: VariableResolver = this.actor.system): number {
		return evaluateToNumber(this.expression, actor)
	}

	/* -------------------------------------------- */
}

type PoolThresholdSchema = {
	state: fields.StringField<{ required: true; nullable: false }>
	explanation: fields.StringField<{ required: false; nullable: false }>
	expression: fields.StringField<{ required: true; nullable: false }>
	ops: fields.ArrayField<
		fields.StringField<{ required: false; nullable: false }, threshold.Op>,
		threshold.Op[],
		threshold.Op[],
		{ required: false; nullable: false }
	>
}

export { PoolThreshold, type PoolThresholdSchema }
