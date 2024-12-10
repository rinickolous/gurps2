import { ActorDataModel } from "../base.ts"
import fields = foundry.data.fields
import { CharacterSettings } from "../fields/character-settings.ts"

class SettingsHolderTemplate extends ActorDataModel<SettingsHolderSchema> {
	static override defineSchema(): SettingsHolderSchema {
		const fields = foundry.data.fields
		return {
			settings: new fields.EmbeddedDataField(CharacterSettings, { required: true, nullable: false }),
		}
	}
}

type SettingsHolderSchema = {
	settings: fields.EmbeddedDataField<typeof CharacterSettings, { required: true; nullable: false }>
}

export { SettingsHolderTemplate, type SettingsHolderSchema }
