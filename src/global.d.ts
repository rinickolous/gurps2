/// <reference path="./types/fields/collection-field.d.ts" />

declare global {
	type Maybe<T> = T | null | undefined
	type MaybePromise<T> = T | Promise<T>

	interface Item {
		type: ItemType
		system: ItemDataModel
	}

	interface Actor {
		type: ActorType
		system: ActorDataModel
	}

	interface SettingConfig {
		"gcsga.colors": typeof ColorSettings
		"gcsga.defaultAttributes": typeof AttributeSettings
		"gcsga.defaultSheetSettings": typeof SheetSettings
		"gcsga.defaultHitLocations": HitLocationSettings
		"gcsga.ssrt": SSRT_SETTING
		"gcsga.rollFormula": string
		"gcsga.initiativeFormula": string
		"gcsga.baseBooks": string
	}
}
