import { ExtendedStringField, StringArrayField } from "@data/fields/index.ts"
import { ItemDataModel } from "../base.ts"

class SpellTemplate extends ItemDataModel<SpellTemplateSchema> {
	constructor(...args: any[]) {
		super(...args)
	}

	/* -------------------------------------------- */

	static override defineSchema(): SpellTemplateSchema {
		return spellTemplateSchema
	}

	/* -------------------------------------------- */
}

const spellTemplateSchema = {
	/* The following are handled by the SkillTemplate schema instead:
	 * - Difficulty
	 * - Tech Level
	 * - Points
	 */
	college: new StringArrayField({
		required: true,
		nullable: false,
		toggleable: true,
		label: "GURPS.Item.Spell.FIELDS.College.Name",
	}),
	powerSource: new ExtendedStringField({
		required: true,
		nullable: false,
		toggleable: true,
		label: "GURPS.Item.Spell.FIELDS.PowerSource.Name",
	}),
	spellClass: new ExtendedStringField({
		required: true,
		nullable: false,
		toggleable: true,
		label: "GURPS.Item.Spell.FIELDS.SpellClass.Name",
	}),
	resist: new ExtendedStringField({
		required: true,
		nullable: false,
		toggleable: true,
		label: "GURPS.Item.Spell.FIELDS.Resist.Name",
	}),

	castingCost: new ExtendedStringField({
		required: true,
		nullable: false,
		toggleable: true,
		label: "GURPS.Item.Spell.FIELDS.CastingCost.Name",
	}),
	maintenanceCost: new ExtendedStringField({
		required: true,
		nullable: false,
		toggleable: true,
		label: "GURPS.Item.Spell.FIELDS.MaintenanceCost.Name",
	}),
	castingTime: new ExtendedStringField({
		required: true,
		nullable: false,
		toggleable: true,
		label: "GURPS.Item.Spell.FIELDS.CastingTime.Name",
	}),
	duration: new ExtendedStringField({
		required: true,
		nullable: false,
		toggleable: true,
		label: "GURPS.Item.Spell.FIELDS.Duration.Name",
	}),
}

type SpellTemplateSchema = typeof spellTemplateSchema

export { SpellTemplate, type SpellTemplateSchema }
