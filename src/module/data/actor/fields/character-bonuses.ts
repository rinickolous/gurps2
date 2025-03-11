import { ActorGURPS } from "@documents"
import fields = foundry.data.fields
import { ActorDataModel } from "../base.ts"

class CharacterBonuses extends foundry.abstract.DataModel<CharacterBonusesSchema, ActorDataModel> {
	get actor(): ActorGURPS {
		return this.parent.parent
	}

	static override defineSchema(): CharacterBonusesSchema {
		return characterBonusesSchema
	}
}

const characterBonusesSchema = {
	liftingStrength: new fields.NumberField({ required: true, nullable: false, min: 0, step: 1, initial: 0 }),
	strikingStrength: new fields.NumberField({ required: true, nullable: false, min: 0, step: 1, initial: 0 }),
	throwingStrength: new fields.NumberField({ required: true, nullable: false, min: 0, step: 1, initial: 0 }),
	dodge: new fields.NumberField({ required: true, nullable: false, min: 0, step: 1, initial: 0 }),
	parry: new fields.NumberField({ required: true, nullable: false, min: 0, step: 1, initial: 0 }),
	parryTooltip: new fields.StringField({ required: true, nullable: false, blank: true }),
	block: new fields.NumberField({ required: true, nullable: false, min: 0, step: 1, initial: 0 }),
	blockTooltip: new fields.StringField({ required: true, nullable: false, blank: true }),
}
type CharacterBonusesSchema = typeof characterBonusesSchema

export { CharacterBonuses }
