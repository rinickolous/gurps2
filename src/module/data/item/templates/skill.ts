import { DifficultyField, ExtendedBooleanField, ExtendedNumberField, ExtendedStringField } from "@data/fields/index.ts"
import fields = foundry.data.fields
import { ItemDataModel } from "../base.ts"
import { AnyMutableObject } from "fvtt-types/utils"
import { difficulty, display, i18n, ItemTemplateType, ItemType, StringBuilder } from "@util"
import { CharacterSettings } from "@data/actor/fields/character-settings.ts"
import { Study } from "@data/study.ts"

class SkillTemplate extends ItemDataModel<SkillTemplateSchema> {
	constructor(...args: any[]) {
		super(...args)
	}

	/* -------------------------------------------- */

	static override defineSchema(): SkillTemplateSchema {
		return skillTemplateSchema
	}

	/* -------------------------------------------- */

	static override _cleanData(source?: AnyMutableObject, options?: Parameters<fields.SchemaField.Any["clean"]>[1]) {
		if (source && Object.hasOwn(source, "techLevelRequired") && typeof source.techLevelRequired === "boolean") {
			source.techLevel = source.techLevelRequired ? source.techLevel || "" : null
		}
		return super._cleanData(source, options)
	}

	/* -------------------------------------------- */

	/**
	 * @returns the locale-formatted name of the Skill-like Item, including Tech Level and Specialization if present.
	 */
	get displayName(): string {
		const buffer = new StringBuilder()

		if (this.hasTemplate(ItemTemplateType.BasicInformation)) {
			buffer.push(this._processNameable(this.name))
		}

		if (this.techLevelRequired) {
			buffer.push(i18n.format("GURPS.TechLevelShort", { level: this.techLevel }))
		}

		if (this.isOfType(ItemType.Skill) && this.specialization !== "") {
			buffer.push(
				i18n.format("GURPS.SkillSpecialization", {
					specialization: this._processNameable(this.specialization),
				}),
			)
		}

		return buffer.toString()
	}

	/* -------------------------------------------- */

	/* -------------------------------------------- */

	/**
	 * @returns the locale-formatted notes for the Skill-like item, including any Skill it may default to.
	 * */
	secondaryText(optionChecker: (option: display.Option) => boolean): string {
		const buffer = new StringBuilder()

		const settings = CharacterSettings.for(this.actor)
		if (optionChecker(settings.modifiersDisplay)) {
			const notes = this.modifierNotes
			if (notes !== "") buffer.push(notes)
		}
		if (optionChecker(settings.notesDisplay)) {
			const notes = this.hasTemplate(ItemTemplateType.BasicInformation) ? this.notes : ""
			buffer.appendToNewLine(this._processNameable(notes))

			if (this.hasTemplate(ItemTemplateType.StudyHolder)) {
				buffer.appendToNewLine(Study.progressText(Study.resolveHours(this), this.studyHoursNeeded, false))
			}
		}

		return buffer.toString()
	}

	protected _addTooltipForSkillLevelAdj(
		optionChecker: (option: display.Option) => boolean,
		settings: CharacterSettings,
		level: SkillTemplate["level"],
	)

	/* -------------------------------------------- */

	/**
	 * @returns The notes for the modifiers of the Skill-like item.
	 * (This is a placeholder, implemented in Skill and Technique).
	 */
	get modifierNotes(): string {
		return ""
	}
}

/* -------------------------------------------- */

const skillTemplateSchema = {
	difficulty: new DifficultyField({ required: true, nullable: false }),
	techLevel: new ExtendedStringField({
		required: true,
		nullable: true,
		initial: null,
		label: "GURPS.Item.Skill.FIELDS.TechLevel.Name",
		toggleable: true,
	}),
	techLevelRequired: new ExtendedBooleanField({
		required: true,
		nullable: false,
		initial: false,
		label: "GURPS.Item.Skill.FIELDS.TechLevelRequired.Name",
		toggleable: true,
	}),
	points: new ExtendedNumberField({
		required: true,
		nullable: false,
		integer: true,
		min: 0,
		initial: 0,
		label: "GURPS.Item.Skill.FIELDS.Points.Name",
		toggleable: true,
	}),
}

type SkillTemplateSchema = typeof skillTemplateSchema

export { SkillTemplate, type SkillTemplateSchema }
