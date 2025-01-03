import { AbstractStatDefinition, abstractStatDefinitionSchema, AbstractStatDefinitionSchema } from "../abstract-stat/abstract-stat-definition.ts"
import fields = foundry.data.fields
import { PoolThreshold } from "../pool-threshold.ts"
import { ActorDataModel } from "@data/actor/base.ts"

class ResourceTrackerDefinition extends AbstractStatDefinition<ResourceTrackerDefinitionSchema> {
	static override defineSchema(): ResourceTrackerDefinitionSchema {
		return {
			...abstractStatDefinitionSchema,
			...resourceTrackerDefinitionSchema
		}
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

	baseValue(_resolver: ActorDataModel): number {
		return this.max
	}
}

const resourceTrackerDefinitionSchema = {
	id: new fields.StringField({
		required: true,
		nullable: false,
		initial: "id",
		label: "GURPS.ResourceTracker.Definition.FIELDS.Id.Name",
	}),
	base: new fields.StringField({
		required: true,
		nullable: false,
		initial: "10",
		label: "GURPS.ResourceTracker.Definition.FIELDS.Base.Name",
	}),
	name: new fields.StringField({
		required: true,
		nullable: false,
		initial: "id",
		label: "GURPS.ResourceTracker.Definition.FIELDS.Name.Name",
	}),
	full_name: new fields.StringField({
		required: false,
		nullable: false,
		initial: "",
		label: "GURPS.ResourceTracker.Definition.FIELDS.FullName.Name",
	}),
	thresholds: new fields.ArrayField(new fields.EmbeddedDataField(PoolThreshold), {
		required: true,
		nullable: false,
		label: "GURPS.ResourceTracker.Definition.FIELDS.Thresholds.Name",
	}),
	max: new fields.NumberField({
		required: true,
		nullable: false,
		integer: true,
		initial: 10,
		label: "GURPS.ResourceTracker.Definition.FIELDS.Max.Name",
	}),
	min: new fields.NumberField({
		required: true,
		nullable: false,
		integer: true,
		initial: 0,
		label: "GURPS.ResourceTracker.Definition.FIELDS.Min.Name",
	}),
	isMaxEnforced: new fields.BooleanField({
		required: true,
		nullable: false,
		initial: false,
		label: "GURPS.ResourceTracker.Definition.FIELDS.IsMaxEnforced.Name",
	}),
	isMinEnforced: new fields.BooleanField({
		required: true,
		nullable: false,
		initial: false,
		label: "GURPS.ResourceTracker.Definition.FIELDS.IsMinEnforced.Name",
	}),
}

type ResourceTrackerDefinitionSchema = AbstractStatDefinitionSchema & typeof resourceTrackerDefinitionSchema

export { ResourceTrackerDefinition, type ResourceTrackerDefinitionSchema }
