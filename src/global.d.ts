/// <reference path="./types/fields/collection-field.d.ts" />
/// <reference path="./types/fields/extended-fields.d.ts" />
/// <reference path="./types/fields/mapping-field.d.ts" />

import { ItemDataModel } from "@data"
import { ActorDataModel } from "@data/actor/base.ts"
import { AttributeSettings } from "@module/settings/attributes-config.ts"
import { ColorSettings } from "@module/settings/color-config.ts"
import { HitLocationSettings } from "@module/settings/hit-location-config.ts"
import { SheetSettings } from "@module/settings/sheet-settings-config.ts"
import { ActorType, ItemType } from "@util"
import { AnyObject } from "fvtt-types/utils"
// export type * from "./types/index.js"

declare global {
	type Maybe<T> = T | null | undefined
	type MaybePromise<T> = T | Promise<T>
	type Constructor<T> = new () => T

	type CriteriaFieldOptions = {
		choices?: Record<string, string>
	}

	type CriteriaConstructorOptions = AnyObject & {
		toggleable?: boolean
		replaceable?: boolean
	}

	// @ts-expect-error overwriting type
	interface Item {
		type: ItemType
		system: ItemDataModel
	}

	// @ts-expect-error overwriting type
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
		"gcsga.bucket3D6Icon": foundry.data.fields.FilePathField
	}
}
