import { ActorDataModel } from "./base.ts"
import { AttributeHolderTemplate, FeatureHolderTemplate, SettingsHolderTemplate } from "./templates/index.ts"

class CharacterData extends ActorDataModel.mixin(
	SettingsHolderTemplate,
	AttributeHolderTemplate,
	FeatureHolderTemplate,
) {}

export { CharacterData }
