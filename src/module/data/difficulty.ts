import { ExtendedStringField } from "./fields/index.ts"
import fields = foundry.data.fields
import { getAttributeChoices, ItemType } from "@util"
import { ItemDataModel } from "./item/base.ts"
import { CharacterSettings } from "./actor/fields/character-settings.ts"

namespace Difficulty {
	export type Options = fields.EmbeddedDataField.Options<foundry.abstract.DataModel.AnyConstructor> & {
		attributeChoices?: fields.StringField.Choices
		difficultyChoices?: fields.StringField.Choices
	}

	/* -------------------------------------------- */

	export type DefaultOptions = fields.EmbeddedDataField.DefaultOptions & {
		attributeChoices: fields.StringField.Choices
		difficultyChoices: fields.StringField.Choices
	}

	/* -------------------------------------------- */

	export type ExtraConstructorOptions = {
		attributeChoices?: fields.StringField.Choices
		difficultyChoices?: fields.StringField.Choices
	}
}

class Difficulty extends foundry.abstract.DataModel<
	DifficultySchema,
	foundry.abstract.DataModel.Any | null,
	Difficulty.ExtraConstructorOptions
> {
	constructor(
		data?: foundry.abstract.DataModel.CreateData<DifficultySchema>,
		options?: foundry.abstract.DataModel.DataValidationOptions<foundry.abstract.DataModel.Any | null> &
			Difficulty.ExtraConstructorOptions,
	) {
		super(data, options)

		// Allow blank attributes only for techniques
		// TODO: evaluate if we can move this to be specifically declared in Techniques which may be neater.
		const blank = options?.parent instanceof ItemDataModel && options?.parent.isOfType(ItemType.Technique)

		this.schema.fields.attribute.choices = this._getAttributeChoices(blank)
	}

	/* -------------------------------------------- */

	static defineSchema(): DifficultySchema {
		return difficultySchema
	}

	/* -------------------------------------------- */

	protected _getAttributeChoices(blank = false): Record<string, string> {
		return getAttributeChoices(this.actor, this.attribute, "GURPS.AttributeDifficulty.AttributeKey", {
			blank,
			ten: true,
			size: false,
			dodge: false,
			parry: false,
			block: false,
			skill: false,
		}).choices
	}

	/* -------------------------------------------- */

	get actor(): Actor.Implementation | null {
		return this.parent instanceof ItemDataModel ? this.parent.actor : null
	}

	/* -------------------------------------------- */

	override toString(): string {
		const attributes = CharacterSettings.for(this.actor).attributes
		const attributeDefinition = attributes.find(e => e.id === this.attribute)
		const attributeLabel = attributeDefinition?.name ?? this.attribute

		// TODO: change when adding support for custom difficulties
		const difficultyLabel = `${this.difficulty}`.toUpperCase()

		return `${attributeLabel}/${difficultyLabel}`
	}
}

const difficultySchema = {
	attribute: new ExtendedStringField({
		required: true,
		nullable: false,
		// TODO: see if we can pre-populate this with default values.
		choices: [],
	}),
	difficulty: new ExtendedStringField({ required: true, nullable: false, choices: [] }),
}

type DifficultySchema = typeof difficultySchema

export { Difficulty, type DifficultySchema }
