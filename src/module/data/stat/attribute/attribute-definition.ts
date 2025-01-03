import { ActorTemplateType, attribute, evaluateToNumber, GID, progression, VariableResolver } from "@util"
import fields = foundry.data.fields
import { AbstractStatDefinition } from "../abstract-stat/abstract-stat-definition.ts"
import { PoolThreshold } from "../pool-threshold.ts"
import { ActorDataModel } from "@data/actor/base.ts"

class AttributeDefinition extends AbstractStatDefinition<AttributeDefinitionSchema> {
	static override defineSchema(): AttributeDefinitionSchema {
		return attributeDefinitionSchema
	}

	static override cleanData(source?: object, options?: Parameters<fields.SchemaField.Any["clean"]>[1]): object {

		let { type, thresholds }: AnyObject = {
			type: undefined,
			thresholds: undefined,
			...source,
		}
		if (type === attribute.Type.Pool || type === attribute.Type.PoolRef) {
			thresholds ||= [new PoolThreshold().toObject()]
		} else {
			thresholds = undefined
		}
		return super.cleanData({ ...source, type, thresholds }, options)
	}

	get fullName(): string {
		if (!this.full_name) return this.name
		return this.full_name
	}

	get combinedName(): string {
		if (!this.full_name) return this.name
		if (!this.name || this.name === this.full_name) return this.full_name
		return `${this.full_name} (${this.name})`
	}

	get isPrimary(): boolean {
		if (this.type === attribute.Type.PrimarySeparator) return true
		if (
			this.type === attribute.Type.Pool ||
			this.type === attribute.Type.PoolRef ||
			this.type === attribute.Type.SecondarySeparator ||
			this.isSeparator
		)
			return false
		if (this.placement === attribute.Placement.Primary) return true
		return !isNaN(parseInt(this.base))
	}

	get isSecondary(): boolean {
		if (this.type === attribute.Type.SecondarySeparator) return true
		if (
			this.type === attribute.Type.Pool ||
			this.type === attribute.Type.PoolRef ||
			this.type === attribute.Type.PrimarySeparator ||
			this.isSeparator
		)
			return false
		if (this.placement === attribute.Placement.Secondary) return true
		return isNaN(parseInt(this.base))
	}

	get isSeparator(): boolean {
		return [
			attribute.Type.PrimarySeparator,
			attribute.Type.SecondarySeparator,
			attribute.Type.PoolSeparator,
		].includes(this.type)
	}

	baseValue(resolver: VariableResolver): number {
		return evaluateToNumber(this.base, resolver)
	}

	computeCost(actor: ActorDataModel, value: number, cost_reduction: number, size_modifier: number): number {
		if (!actor.hasTemplate(ActorTemplateType.Settings)) {
			console.error("Actor does not have settings. Cannot compute cost")
			return 0
		}
		let cost = value * (this.cost_per_point || 0)
		if (
			size_modifier > 0 &&
			(this.cost_adj_percent_per_sm ?? 0) > 0 &&
			!(
				this.id === GID.HitPoints &&
				actor.settings.damage_progression === progression.Option.KnowingYourOwnStrength
			)
		)
			cost_reduction = size_modifier * (this.cost_adj_percent_per_sm ?? 0)
		if (cost_reduction > 0) {
			if (cost_reduction > 80) cost_reduction = 80
			cost = (cost * (100 - cost_reduction)) / 100
		}
		return Math.round(cost)
	}

	// generateNewAttribute(): AttributeGURPS {
	// 	return new AttributeGURPS({ id: this.id }, { parent: this.actor.system, order: 0 })
	// }
}

const attributeDefinitionSchema = {
	type: new fields.StringField({
		required: true,
		nullable: false,
		choices: attribute.TypesChoices,
		initial: attribute.Type.Integer,
		label: "GURPS.Attribute.Definition.FIELDS.Type.Name",
	}),
	placement: new fields.StringField({
		required: false,
		nullable: false,
		blank: false,
		choices: attribute.PlacementsChoices,
		initial: attribute.Placement.Automatic,
		label: "GURPS.Attribute.Definition.FIELDS.Placement.Name",
	}),
	id: new fields.StringField({
		required: true,
		nullable: false,
		initial: "id",
		label: "GURPS.Attribute.Definition.FIELDS.Id.Name",
	}),
	base: new fields.StringField({
		required: true,
		nullable: false,
		initial: "10",
		label: "GURPS.Attribute.Definition.FIELDS.Base.Name",
	}),
	name: new fields.StringField({
		required: true,
		nullable: false,
		initial: "id",
		label: "GURPS.Attribute.Definition.FIELDS.Name.Name",
	}),
	full_name: new fields.StringField({
		required: false,
		nullable: false,
		initial: "",
		label: "GURPS.Attribute.Definition.FIELDS.FullName.Name",
	}),
	cost_per_point: new fields.NumberField({
		required: true,
		nullable: false,
		min: 0,
		initial: 0,
		label: "GURPS.Attribute.Definition.FIELDS.CostPerPoint.Name",
	}),
	cost_adj_percent_per_sm: new fields.NumberField({
		required: false,
		nullable: false,
		integer: true,
		min: 0,
		max: 80,
		initial: 0,
		label: "GURPS.Attribute.Definition.FIELDS.CostAdjPercentPerSm.Name",
	}),
	thresholds: new fields.ArrayField(new fields.EmbeddedDataField(PoolThreshold), {
		required: false,
		nullable: false,
		label: "GURPS.Attribute.Definition.FIELDS.Thresholds.Name",
	}),
}

type AttributeDefinitionSchema = typeof attributeDefinitionSchema


export { AttributeDefinition, type AttributeDefinitionSchema }
