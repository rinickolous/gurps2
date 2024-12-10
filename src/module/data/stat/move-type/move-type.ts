import { ActorDataModel } from "@data/actor/base.ts"
import fields = foundry.data.fields
import { AbstractStat, AbstractStatSchema } from "../abstract-stat/abstract-stat.ts"
import { CharacterSettings } from "@data/actor/fields/character-settings.ts"
import { MoveTypeDefinition } from "./move-type-definition.ts"
import { ActorTemplateType } from "@util"

class MoveType extends AbstractStat<MoveTypeSchema, ActorDataModel> {
	static override defineSchema(): MoveTypeSchema {
		const fields = foundry.data.fields
		return {
			...super.defineSchema(),
			adj: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
		}
	}

	override get definition(): MoveTypeDefinition | null {
		return CharacterSettings.for(this.actor).move_types.find(att => att.id === this.id) ?? null
	}

	bonus(type: MoveBonusType): number {
		if (!this.parent || !this.parent.hasTemplate(ActorTemplateType.Features)) return 0
		return this.parent.moveBonusFor(this.id, type)
	}

	// Base Move corresponding to this move type
	get base(): number {
		const def = this.definition
		if (!def) return 0
		let base = def.baseValue(this.parent)
		if (!def) return 0
		for (const override of def.overrides) {
			if (override.conditionMet(this.parent)) base = override.baseValue(this.parent)
		}
		return Math.floor(base + this.adj + this.bonus(MoveBonusType.Base))
	}

	// Enhanced Move corresponding to this move type
	get enhanced(): number {
		const def = this.definition
		if (!def) return 0
		let enhanced = def.baseValue(this.parent)
		for (const override of def.overrides) {
			if (override.conditionMet(this.parent)) {
				enhanced = override.baseValue(this.parent)
			}
		}

		enhanced = enhanced << Math.floor(this.bonus(MoveBonusType.Enhanced))
		if (this.bonus(MoveBonusType.Enhanced) % 1 >= 0.5) enhanced *= 1.5
		return enhanced
	}
}

type MoveTypeSchema = AbstractStatSchema & {
	adj: fields.NumberField<{ required: true; nullable: false }>
}
export { MoveType, type MoveTypeSchema }
