import { AbstractStatDefinition, AbstractStatDefinitionSchema } from "../abstract-stat/abstract-stat-definition.ts"
import fields = foundry.data.fields
import { evaluateToNumber, VariableResolver } from "@util/gcs/eval.ts"
import { MoveTypeOverride } from "./move-type-override.ts"

class MoveTypeDefinition extends AbstractStatDefinition<MoveTypeDefinitionSchema> {
	static override defineSchema(): MoveTypeDefinitionSchema {
		const fields = foundry.data.fields

		return {
			id: new fields.StringField({
				required: true,
				nullable: false,
				initial: "id",
				label: "GURPS.MoveType.Definition.FIELDS.Id.Name",
			}),
			base: new fields.StringField({
				required: true,
				nullable: false,
				initial: "$basic_move",
				label: "GURPS.MoveType.Definition.FIELDS.Base.Name",
			}),
			name: new fields.StringField({
				required: true,
				nullable: false,
				initial: "id",
				label: "GURPS.MoveType.Definition.FIELDS.Name.Name",
			}),
			cost_per_point: new fields.NumberField({
				required: true,
				nullable: false,
				min: 0,
				initial: 0,
				label: "GURPS.MoveType.Definition.FIELDS.CostPerPoint.Name",
			}),
			overrides: new fields.ArrayField(new fields.EmbeddedDataField(MoveTypeOverride), {
				required: true,
				nullable: false,
				initial: [],
				label: "GURPS.MoveType.Definition.FIELDS.Overrides.Name",
			}),
		}
	}

	baseValue(resolver: VariableResolver): number {
		return evaluateToNumber(this.base, resolver)
	}

	// override generateNewAttribute(): MoveType {
	// 	return new MoveType({ id: this.id }, { parent: this.actor.system, order: 0 })
	// }
}

type MoveTypeDefinitionSchema = AbstractStatDefinitionSchema & {
	name: fields.StringField<{ required: true; nullable: false }>
	cost_per_point: fields.NumberField<{ required: true; nullable: false }>
	overrides: fields.ArrayField<
		fields.EmbeddedDataField<typeof MoveTypeOverride>,
		MoveTypeOverride[],
		MoveTypeOverride[],
		{ required: true; nullable: false }
	>
}
export { MoveTypeDefinition, type MoveTypeDefinitionSchema }
