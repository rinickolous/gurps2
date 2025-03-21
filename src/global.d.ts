/// <reference path="./types/fields/collection-field.d.ts" />
/// <reference path="./types/fields/extended-fields.d.ts" />
/// <reference path="./types/fields/mapping-field.d.ts" />
import { ActorGURPS, ItemGURPS } from "@documents"
import { AttributeSettings } from "@module/settings/attributes-config.ts"
import { ColorSettings } from "@module/settings/color-config.ts"
import { HitLocationSettings } from "@module/settings/hit-location-config.ts"
import { SheetSettings } from "@module/settings/sheet-settings-config.ts"
import { contents, ItemType } from "@util"
import { AnyObject } from "fvtt-types/utils"

declare global {
	type Maybe<T> = T | null | undefined
	type MaybePromise<T> = T | Promise<T>
	type Constructor<T> = new () => T

	/* -------------------------------------------- */
	/* Criteria                                     */
	/* -------------------------------------------- */

	type CriteriaFieldOptions = {
		choices?: Record<string, string>
	}

	/* -------------------------------------------- */

	type CriteriaConstructorOptions = AnyObject & {
		toggleable?: boolean
		replaceable?: boolean
	}

	/* -------------------------------------------- */
	/* Document Config                              */
	/* -------------------------------------------- */

	interface DocumentClassConfig {
		Item: typeof ItemGURPS
		Actor: typeof ActorGURPS
	}

	/* -------------------------------------------- */

	interface CommonFlags {}

	interface ItemFlags extends CommonFlags {
		containerId: string
		containerRelationship: contents.Type
	}

	interface FlagConfig {
		Item: ItemFlags
	}

	/* -------------------------------------------- */
	/* DataModel Config                             */
	/* -------------------------------------------- */

	interface DataModelConfig {
		Item: {
			[ItemType.EquipmentContainer]: typeof EquipmentContainerData
			[ItemType.EquipmentModifierContainer]: typeof EquipmentModifierContainerData
			[ItemType.EquipmentModifier]: typeof EquipmentModifierData
			[ItemType.Equipment]: typeof EquipmentData
			[ItemType.NoteContainer]: typeof NoteContainerData
			[ItemType.Note]: typeof NoteData
			[ItemType.RitualMagicSpell]: typeof RitualMagicSpellData
			[ItemType.SkillContainer]: typeof SkillContainerData
			[ItemType.Skill]: typeof SkillData
			[ItemType.SpellContainer]: typeof SpellContainerData
			[ItemType.Spell]: typeof SpellData
			[ItemType.Technique]: typeof TechniqueData
			[ItemType.TraitContainer]: typeof TraitContainerData
			[ItemType.TraitModifierContainer]: typeof TraitModifierContainerData
			[ItemType.TraitModifier]: typeof TraitModifierData
			[ItemType.Trait]: typeof TraitData
		}
	}

	// interface Item {
	// 	type: ItemType
	// 	system: ItemDataModel
	// }
	//
	// interface Actor {
	// 	type: ActorType
	// 	system: ActorDataModel
	// }

	export interface SettingConfig {
		"gcsga.colors": typeof ColorSettings
		"gcsga.defaultAttributes": typeof AttributeSettings
		"gcsga.defaultSheetSettings": typeof SheetSettings
		"gcsga.defaultHitLocations": typeof HitLocationSettings
		// "gcsga.ssrt": SSRT_SETTING
		"gcsga.rollFormula": string
		"gcsga.initiativeFormula": string
		"gcsga.baseBooks": string
		"gcsga.bucket3D6Icon": foundry.data.fields.FilePathField
	}
}
