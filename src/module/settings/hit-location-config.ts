import type { DeepPartial } from "@league-of-foundry-developers/foundry-vtt-types/src/types/utils.d.mts"
import fields = foundry.data.fields
import api = foundry.applications.api
import DEFAULT_BODY_TYPE from "@static/settings/body-type.json"
import { SETTINGS, SYSTEM_NAME } from "@util"
import { ActorBody, ActorBodySchema, HitLocation, HitLocationSubTable } from "@data"

class HitLocationSettings extends foundry.abstract.DataModel<HitLocationSettingsSchema> {
	static override defineSchema(): HitLocationSettingsSchema {
		const fields = foundry.data.fields
		return {
			body_type: new fields.EmbeddedDataField(ActorBody, {
				initial: DEFAULT_BODY_TYPE,
			}),
		}
	}
}

type HitLocationSettingsSchema = {
	body_type: fields.EmbeddedDataField<
		typeof ActorBody,
		{ required: true; nullable: false },
		fields.SchemaField.AssignmentType<ActorBodySchema>,
		ActorBody
	>
}

class HitLocationsConfig extends api.HandlebarsApplicationMixin(api.ApplicationV2) {
	// Cached settings used for retaining progress without submitting changes
	declare private _cachedSettings: HitLocationSettings

	static override DEFAULT_OPTIONS = {
		id: "hit-locations-config",
		tag: "form",
		window: {
			contentClasses: ["standard-form"],
			icon: "gcs-body-type",
			title: "GURPS.Settings.HitLocationsConfig.Title",
		},
		position: {
			width: 660,
			// height: "auto",
		},
		form: {
			submitOnChange: false,
			closeOnSubmit: false,
			handler: HitLocationsConfig.#onSubmit,
		},
		actions: {
			reset: HitLocationsConfig.#onReset,
			moveItemUp: HitLocationsConfig.#onMoveItemUp,
			moveItemDown: HitLocationsConfig.#onMoveItemDown,
			addLocation: HitLocationsConfig.#onAddLocation,
			deleteLocation: HitLocationsConfig.#onDeleteLocation,
			addSubTable: HitLocationsConfig.#onAddSubTable,
			deleteSubTable: HitLocationsConfig.#onDeleteSubTable,
		},
		dragDrop: [{ dragSelector: "[data-drag]", dropSelector: "" }],
	}

	static override PARTS = {
		hitLocations: {
			id: "hit-locations",
			template: `systems/${SYSTEM_NAME}/templates/apps/hit-locations-config.hbs`,
			scrollable: ["fieldset"],
		},
		footer: {
			template: "templates/generic/form-footer.hbs",
		},
	}

	static registerSettings(): void {
		//@ts-expect-error weird types
		game.settings?.register(SYSTEM_NAME, SETTINGS.DEFAULT_HIT_LOCATIONS, {
			name: "",
			scope: "world",
			type: HitLocationSettings,
			default: new HitLocationSettings(),
		})
	}

	// Cached settings used for retaining progress without submitting changes
	get cachedSettings(): HitLocationSettings {
		return (this._cachedSettings ??= this._getInitialSettings())
	}

	set cachedSettings(value: fields.SchemaField.AssignmentType<HitLocationSettingsSchema>) {
		this._cachedSettings = new HitLocationSettings(value)
	}

	// Get the initial settings values for this menu.
	// This function can be overriden for e.g. Actors
	protected _getInitialSettings(): HitLocationSettings {
		//@ts-expect-error weird types
		return game.settings?.get(SYSTEM_NAME, SETTINGS.DEFAULT_HIT_LOCATIONS)
	}

	// Get the default settings values for this menu.
	// This can be overriden to instead get the current game settings value if on an Actor
	protected _getDefaultSettings(): HitLocationSettings {
		//@ts-expect-error weird types
		return game.settings.settings.get(`${SYSTEM_NAME}.${SETTINGS.DEFAULT_HIT_LOCATIONS}`).default
	}

	// Write changes made in this menu to a permanent dataset.
	// This function can be overriden for e.g. Actors
	protected async _setDatabaseSettings(data: object): Promise<void> {
		//@ts-expect-error weird types
		await game.settings?.set(SYSTEM_NAME, SETTINGS.DEFAULT_HIT_LOCATIONS, data)
	}

	protected _prepareContext(_options: DeepPartial<api.ApplicationV2.RenderOptions>): Promise<AnyObject> {
		const source = this.cachedSettings
		return {
			body: source.body_type,
			buttons: [
				{
					type: "reset",
					action: "reset",
					icon: "fa-solid fa-sync",
					label: "GURPS.Settings.HitLocationsConfig.Reset",
				},
				{ type: "submit", icon: "fa-solid fa-save", label: "GURPS.Settings.HitLocationsConfig.Submit" },
			],
		}
	}

	static async #onSubmit(
		this: HitLocationsConfig,
		event: Event | SubmitEvent,
		_form: HTMLFormElement,
		formData: FormDataExtended,
	): Promise<void> {
		event.preventDefault()

		const data = foundry.utils.expandObject(formData.object)

		this.cachedSettings = data
		await this._setDatabaseSettings(data)
		ui.notifications?.info("GURPS.Settings.HitLocationsConfig.MessageSubmit", { localize: true })
		await this.render()
	}

	static async #onReset(this: HitLocationsConfig, event: Event): Promise<void> {
		event.preventDefault()

		const defaults = this._getDefaultSettings().toObject()
		this.cachedSettings = defaults
		await this._setDatabaseSettings(defaults)
		ui.notifications?.info("GURPS.Settings.HitLocationsConfig.MessageReset", { localize: true })
		await this.render()
	}

	static async #onMoveItemUp(this: HitLocationsConfig, event: Event): Promise<void> {
		event.preventDefault()
		event.stopImmediatePropagation()

		const source = this.cachedSettings.toObject()
		const el = event.target as HTMLElement
		const index = parseInt(el.dataset.itemIndex ?? "")
		if (isNaN(index)) return

		const [location] = source.body_type.locations.splice(index, 1)
		if (!location) return
		source.body_type.locations.splice(index - 1, 0, location)

		this.cachedSettings = source
		await this.render()
	}

	static async #onMoveItemDown(this: HitLocationsConfig, event: Event): Promise<void> {
		event.preventDefault()
		event.stopImmediatePropagation()

		const source = this.cachedSettings.toObject()
		const el = event.target as HTMLElement
		const index = parseInt(el.dataset.itemIndex ?? "")
		if (isNaN(index)) return

		const [location] = source.body_type.locations.splice(index, 1)
		if (!location) return
		source.body_type.locations.splice(index + 1, 0, location)

		this.cachedSettings = source
		await this.render()
	}

	static async #onAddLocation(this: HitLocationsConfig, event: Event): Promise<void> {
		event.preventDefault()
		const source = this.cachedSettings.toObject()
		const el = event.target as HTMLElement
		const tableId = el.dataset.subTable ?? null

		const newLocation = new HitLocation({ owningTableId: tableId }).toObject()
		source.body_type.locations.push(newLocation)

		this.cachedSettings = source
		await this.render()
	}

	static async #onDeleteLocation(this: HitLocationsConfig, event: Event): Promise<void> {
		event.preventDefault()
		const source = this.cachedSettings.toObject()
		const el = event.target as HTMLElement
		const index = parseInt(el.dataset.itemIndex ?? "")
		if (isNaN(index)) return

		source.body_type.locations.splice(index, 1)

		this.cachedSettings = source
		await this.render()
	}

	static async #onAddSubTable(this: HitLocationsConfig, event: Event): Promise<void> {
		event.preventDefault()
		const source = this.cachedSettings.toObject()
		const el = event.target as HTMLElement
		const index = parseInt(el.dataset.itemIndex ?? "")
		if (isNaN(index)) return

		const id = foundry.utils.randomID(12)
		source.body_type.locations[index].subTableId = id
		const subTable = new HitLocationSubTable({ id }).toObject()
		const newLocation = new HitLocation({ owningTableId: id }).toObject()

		source.body_type.sub_tables ??= []
		source.body_type.sub_tables.push(subTable)
		source.body_type.locations.push(newLocation)

		this.cachedSettings = source
		await this.render()
	}

	static async #onDeleteSubTable(this: HitLocationsConfig, event: Event): Promise<void> {
		event.preventDefault()
		const source = this.cachedSettings.toObject()
		const el = event.target as HTMLElement
		const index = parseInt(el.dataset.itemIndex ?? "")
		if (isNaN(index)) return

		const id = (source.body_type.locations[index].subTableId = null)
		const parentIndex = source.body_type.sub_tables.findIndex(e => e.id === id)!
		source.body_type.locations[index].subTableId = null
		source.body_type.sub_tables ??= []
		source.body_type.sub_tables.splice(parentIndex, 1)
		this.cachedSettings = source
		await this.render()
	}
}

export { HitLocationsConfig, HitLocationSettings }
export type { HitLocationSettingsSchema }
