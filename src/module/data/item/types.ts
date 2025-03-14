import { ItemTemplateType, ItemType } from "@util"
import * as ItemDataModels from "./index.ts"
import * as ItemDataTemplates from "./templates/index.ts"

export interface ItemDataModelClasses {
	[ItemType.EquipmentContainer]: ItemDataModels.EquipmentContainerData
	[ItemType.EquipmentModifierContainer]: ItemDataModels.EquipmentModifierContainerData
	[ItemType.EquipmentModifier]: ItemDataModels.EquipmentModifierData
	[ItemType.Equipment]: ItemDataModels.EquipmentData
	[ItemType.NoteContainer]: ItemDataModels.NoteContainerData
	[ItemType.Note]: ItemDataModels.NoteData
	[ItemType.RitualMagicSpell]: ItemDataModels.RitualMagicSpellData
	[ItemType.SkillContainer]: ItemDataModels.SkillContainerData
	[ItemType.Skill]: ItemDataModels.SkillData
	[ItemType.SpellContainer]: ItemDataModels.SpellContainerData
	[ItemType.Spell]: ItemDataModels.SpellData
	[ItemType.Technique]: ItemDataModels.TechniqueData
	[ItemType.TraitContainer]: ItemDataModels.TraitContainerData
	[ItemType.TraitModifierContainer]: ItemDataModels.TraitModifierContainerData
	[ItemType.TraitModifier]: ItemDataModels.TraitModifierData
	[ItemType.Trait]: ItemDataModels.TraitData
}

export interface ItemDataTemplateClasses {
	[ItemTemplateType.ActionHolder]: ItemDataTemplates.ActionHolderTemplate
	[ItemTemplateType.Skill]: ItemDataTemplates.SkillTemplate
	[ItemTemplateType.BasicInformation]: ItemDataTemplates.BasicInformationTemplate
	[ItemTemplateType.Container]: ItemDataTemplates.ContainerTemplate
	[ItemTemplateType.SkillDefaultHolder]: ItemDataTemplates.SkillDefaultHolderTemplate
	[ItemTemplateType.Equipment]: ItemDataTemplates.EquipmentTemplate
	[ItemTemplateType.FeatureHolder]: ItemDataTemplates.FeatureHolderTemplate
	[ItemTemplateType.Note]: ItemDataTemplates.NoteTemplate
	[ItemTemplateType.PrereqHolder]: ItemDataTemplates.PrereqHolderTemplate
	[ItemTemplateType.ReplacementHolder]: ItemDataTemplates.ReplacementHolderTemplate
	[ItemTemplateType.Spell]: ItemDataTemplates.SpellTemplate
	[ItemTemplateType.StudyHolder]: ItemDataTemplates.StudyHolderTemplate
}

// export type ItemInstance<T extends ItemType> = ItemGURPS & { system: ItemDataModelClasses[T] }
export type ItemInstance<T extends ItemType> = Item.Implementation & { system: ItemDataModelClasses[T] }

// export type ItemTemplateInstance<T extends ItemTemplateType> = ItemGURPS & { system: ItemDataTemplateClasses[T] }
export type ItemTemplateInstance<T extends ItemTemplateType> = Item.Implementation & {
	system: ItemDataTemplateClasses[T]
}
