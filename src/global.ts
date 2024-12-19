/// <reference path="./types/fields/collection-field.d.ts" />

import { ItemDataModel } from "@data"
import { ActorDataModel } from "@data/actor/base.ts"
import { AttributeSettings } from "@module/settings/attributes-config.ts"
import { ColorSettings } from "@module/settings/color-config.ts"
import { HitLocationSettings } from "@module/settings/hit-location-config.ts"
import { SheetSettings } from "@module/settings/sheet-settings-config.ts"
import { ActorType, ItemType } from "@util"

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
		"gcsga.defaultHitLocations": typeof HitLocationSettings
		"gcsga.ssrt": SSRT_SETTING
		"gcsga.rollFormula": string
		"gcsga.initiativeFormula": string
		"gcsga.baseBooks": string
	}
}
