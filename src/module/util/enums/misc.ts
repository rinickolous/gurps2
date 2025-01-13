enum SETTINGS {
	// Menus
	COLORS = "colors",
	DEFAULT_SHEET_SETTINGS = "defaultSheetSettings",
	DEFAULT_ATTRIBUTES = "defaultAttributes",
	DEFAULT_HIT_LOCATIONS = "defaultHitLocations",
	// Book Settings
	BASE_BOOKS = "baseBooks",
	BASIC_SET_PDF = "basicSetPdf",
	// Rule Variations
	ROLL_FORMULA = "rollFormula",
	INITIATIVE_FORMULA = "initiativeFormula",
	SSRT = "ssrt",
	DEFAULT_DAMAGE_LOCATION = "defaultDamageLocation",
	// QOL
	AUTOMATIC_UNREADY = "automaticUnnready",

	// Modifeir Bucekt
	BUCKET_3D6_ICON = "bucket3D6Icon",

	// Token View
	MANEUVER_DETAIL = "maneuverDetail",
	// SHOW_TOKEN_MODIFIERS = "showTokenModifier",

	// Not yet implemented
	// DAMAGE_TYPES = "damage_types",
	// ROLL_MODIFIERS = "roll_modifiers",

	// Leagacy. Not in use.
	// PORTRAIT_OVERWRITE = "portrait_overwrite",
	// STATIC_IMPORT_HP_FP = "import_hp_fp",
	// STATIC_IMPORT_BODY_PLAN = "import_bodyplan",
	// STATIC_AUTOMATICALLY_SET_IGNOREQTY = "auto-ignore-qty",
	// SHOW_IMPORT_BUTTON = "show_import_button",
	// IGNORE_IMPORT_NAME = "ignore_import_name",
	// WORLD_SYSTEM_VERSION = "world_system_version",
	// WORLD_SCHEMA_VERSION = "world_schema_version",

	// Compendium Browser. Not in use.
	// COMPENDIUM_BROWSER_PACKS = "compendium_browser_packs",
	// COMPENDIUM_BROWSER_SOURCES = "compendium_browser_sources",
	// COMPENDIUM_SKILL_DEFAULTS = "compendium_skill_defaults",

	// ???
	// MODIFIER_LIST_COLLAPSE = "modifier_list_collapse",
}

/* -------------------------------------------- */

enum RollType {
	Attribute = "attribute",
	Skill = "skill",
	SkillRelative = "skillRelative",
	Spell = "spell",
	SpellRelative = "spellRelative",
	Attack = "attack",
	Parry = "parry",
	Block = "block",
	Damage = "damage",
	Modifier = "modifier",
	ControlRoll = "CR",
	Location = "location",
	Generic = "generic",
}

/* -------------------------------------------- */

enum GID {
	All = "all",
	BasicMove = "basic_move",
	BasicSpeed = "basic_speed",
	Block = "block",
	ConditionalModifier = "conditional_modifier",
	Dexterity = "dx",
	Dodge = "dodge",
	Equipment = "equipment",
	EquipmentModifier = "equipment_modifier",
	FatiguePoints = "fp",
	Flexible = "flexible",
	FrightCheck = "fright_check",
	Health = "ht",
	Hearing = "hearing",
	HitPoints = "hp",
	Intelligence = "iq",
	LiftingStrength = "lifting_st",
	Move = "move",
	Note = "note",
	Parry = "parry",
	Perception = "per",
	ReactionModifier = "reaction_modifier",
	RitualMagicSpell = "ritual_magic_spell",
	SizeModifier = "sm",
	Skill = "skill",
	Spell = "spell",
	Strength = "st",
	StrikingStrength = "striking_st",
	TasteSmell = "taste_smell",
	Technique = "technique",
	Ten = "10",
	ThrowingStrength = "throwing_st",
	Torso = "torso",
	Touch = "touch",
	Trait = "trait",
	TraitModifier = "trait_modifier",
	Vision = "vision",
	Will = "will",
	// Damage
	Thrust = "thrust",
	Swing = "swing",
	// Move Types
	Ground = "ground",
	Water = "water",
	Air = "air",
	Space = "space",
}

/* -------------------------------------------- */
/*  Actor                                       */
/* -------------------------------------------- */

enum ActorType {
	Character = "character",
	LegacyCharacter = "legacyCharacter",
	Loot = "loot",
}

/* -------------------------------------------- */

enum ActorTemplateType {
	Settings = "SettingsHolderTemplate",
	// Features = "FeatureHolderTemplate",
	Attributes = "AttributeHolderTemplate",
}

/* -------------------------------------------- */

enum ActorFlags {
	TargetModifiers = "targetModifiers",
	SelfModifiers = "selfModifiers",
}

/* -------------------------------------------- */
/*  Item                                        */
/* -------------------------------------------- */

enum ItemType {
	Trait = "trait",
	TraitContainer = "traitContainer",
	TraitModifier = "traitModifier",
	TraitModifierContainer = "traitModifierContainer",
	Skill = "skill",
	Technique = "technique",
	SkillContainer = "skillContainer",
	Spell = "spell",
	RitualMagicSpell = "ritualMagicSpell",
	SpellContainer = "spellContainer",
	Equipment = "equipment",
	EquipmentContainer = "equipmentContainer",
	EquipmentModifier = "equipmentModifier",
	EquipmentModifierContainer = "equipmentModifierContainer",
	Note = "note",
	NoteContainer = "noteContainer",
}

const ItemTypes: ItemType[] = [
	ItemType.Trait,
	ItemType.TraitContainer,
	ItemType.TraitModifier,
	ItemType.TraitModifierContainer,
	ItemType.Skill,
	ItemType.Technique,
	ItemType.SkillContainer,
	ItemType.Spell,
	ItemType.RitualMagicSpell,
	ItemType.SpellContainer,
	ItemType.Equipment,
	ItemType.EquipmentContainer,
	ItemType.EquipmentModifier,
	ItemType.EquipmentModifierContainer,
	ItemType.Note,
	ItemType.NoteContainer,
]

/* -------------------------------------------- */

enum ItemTemplateType {
	ActionHolder = "ActionHolderTemplate",
	Skill = "SkillTemplate",
	BasicInformation = "BasicInformationTemplate",
	Container = "ContainerTemplate",
	SkillDefaultHolder = "SkillDefaultHolderTemplate",
	Equipment = "EquipmentTemplate",
	FeatureHolder = "FeatureHolderTemplate",
	Note = "NoteTemplate",
	PrereqHolder = "PrereqHolderTemplate",
	ReplacementHolder = "ReplacementHolderTemplate",
	Spell = "SpellTemplate",
	StudyHolder = "StudyHolderTemplate",
}

/* -------------------------------------------- */
/*  Action                                      */
/* -------------------------------------------- */

enum ActionType {
	AttackMelee = "attackMelee",
	AttackRanged = "attackRanged",
	Heal = "heal",
	Utility = "utility",
}

/* -------------------------------------------- */
/*  Active Effect                               */
/* -------------------------------------------- */


enum EffectType {
	Effect = "effect",
	Condition = "condition",
}

export {
	SETTINGS,
	RollType,
	ActorFlags,
	ActorType,
	ActorTemplateType,
	ItemType,
	ItemTemplateType,
	ActionType,
	GID,
	EffectType,
	ItemTypes,
}
