import { ActorTemplateType, ActorType } from "@util"
import * as ActorDataModels from "./index.ts"
import * as ActorDataTemplates from "./templates/index.ts"
import { ActorGURPS } from "@documents/actor.ts"

export interface ActorDataModelClasses {
	[ActorType.Character]: ActorDataModels.CharacterData
	[ActorType.LegacyCharacter]: ActorDataModels.LegacyCharacterData
	[ActorType.Loot]: ActorDataModels.LootData
}

export interface ActorDataTemplateClasses {
	[ActorTemplateType.Settings]: ActorDataTemplates.SettingsHolderTemplate
	// [ActorTemplateType.Features]: ActorDataTemplates.FeatureHolderTemplate
	[ActorTemplateType.Attributes]: ActorDataTemplates.AttributeHolderTemplate
}

export type ActorInstance<T extends ActorType> = ActorGURPS & { system: ActorDataModelClasses[T] }
