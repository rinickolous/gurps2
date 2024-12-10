// import * as dice from "@module/dice/index.ts"
import * as documents from "@documents/index.ts"
import * as dataModels from "@data/index.ts"
import { ActorType, ItemType } from "@util"

export const Load = {
	listen(): void {
		CONFIG.Actor.documentClass = documents.ActorGURPS
		CONFIG.Item.documentClass = documents.ItemGURPS

		CONFIG.Actor.dataModels = {
			[ActorType.Character]: dataModels.CharacterData,
		}

		CONFIG.Item.dataModels = {
			[ItemType.Trait]: dataModels.TraitData,
			[ItemType.Skill]: dataModels.SkillData,
			[ItemType.Spell]: dataModels.SpellData,
			[ItemType.Technique]: dataModels.TechniqueData,
			[ItemType.RitualMagicSpell]: dataModels.RitualMagicSpellData,
			[ItemType.TraitContainer]: dataModels.TraitContainerData,
			[ItemType.SpellContainer]: dataModels.SpellContainerData,
			[ItemType.SkillContainer]: dataModels.SkillContainerData,
			[ItemType.TraitModifier]: dataModels.TraitModifierData,
			[ItemType.Equipment]: dataModels.EquipmentData,
			[ItemType.EquipmentContainer]: dataModels.EquipmentContainerData,
			[ItemType.EquipmentModifier]: dataModels.EquipmentModifierData,
			[ItemType.EquipmentModifierContainer]: dataModels.EquipmentModifierContainerData,
			[ItemType.Note]: dataModels.NoteData,
			[ItemType.NoteContainer]: dataModels.NoteContainerData,
		}
	},
}
