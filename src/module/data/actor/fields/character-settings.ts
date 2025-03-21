import { ActorTemplateType, ErrorGURPS, SETTINGS, SYSTEM_NAME } from "@util"
import {
	AttributeSettings,
	AttributeSettingsSchema,
	HitLocationSettings,
	HitLocationSettingsSchema,
	SheetSettings,
	SheetSettingsSchema,
} from "@module/settings/index.ts"
import { ActorDataModel } from "../base.ts"

type CharacterSettingsSchema = SheetSettingsSchema & AttributeSettingsSchema & HitLocationSettingsSchema

class CharacterSettings extends foundry.abstract.DataModel<CharacterSettingsSchema, ActorDataModel> {
	get actor(): Actor.Implementation {
		return this.parent.parent
	}

	static override defineSchema(): CharacterSettingsSchema {
		const sheetSettings = game.settings?.get(SYSTEM_NAME, SETTINGS.DEFAULT_SHEET_SETTINGS)
		const sheetSettingsSchema = SheetSettings.defineSchema()
		for (const key of Object.keys(sheetSettingsSchema) as (keyof SheetSettingsSchema)[]) {
			sheetSettingsSchema[key].initial = sheetSettings![key]
		}

		const attributeSettings = game.settings?.get(SYSTEM_NAME, SETTINGS.DEFAULT_ATTRIBUTES)
		const attributeSettingsSchema = AttributeSettings.defineSchema()
		for (const key of Object.keys(attributeSettingsSchema) as (keyof AttributeSettingsSchema)[]) {
			attributeSettingsSchema[key].initial = attributeSettings![key]
		}

		const hitLocationSettings = game.settings?.get(SYSTEM_NAME, SETTINGS.DEFAULT_HIT_LOCATIONS)
		const hitLocationSettingsSchema = HitLocationSettings.defineSchema()
		for (const key of Object.keys(hitLocationSettingsSchema) as (keyof HitLocationSettingsSchema)[]) {
			hitLocationSettingsSchema[key].initial = hitLocationSettings![key]
		}

		return {
			...sheetSettingsSchema,
			...attributeSettingsSchema,
			...hitLocationSettingsSchema,
		}
	}

	static default(): CharacterSettings {
		return new CharacterSettings({
			...game.settings?.get(SYSTEM_NAME, SETTINGS.DEFAULT_SHEET_SETTINGS),
			...game.settings?.get(SYSTEM_NAME, SETTINGS.DEFAULT_ATTRIBUTES),
			...game.settings?.get(SYSTEM_NAME, SETTINGS.DEFAULT_HIT_LOCATIONS),
		} as foundry.abstract.DataModel.CreateData<CharacterSettingsSchema>)
	}

	static for(actor: Actor.Implementation | null): CharacterSettings {
		if (actor instanceof Actor) {
			if (actor.hasTemplate(ActorTemplateType.Settings)) {
				return actor.system.settings
			} else {
				console.error(`Actor "${actor?.name}" does not support Sheet Settings. Returning default settings.`)
			}
		} else {
			ErrorGURPS(`Actor does not exist.Returning default settings.`)
		}
		return CharacterSettings.default()
	}
}

export { CharacterSettings, type CharacterSettingsSchema }
