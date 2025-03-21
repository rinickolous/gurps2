import { ActorGURPS } from "@documents/actor.ts"
import fields = foundry.data.fields
import api = foundry.applications.api
import { display, i18n, Length, progression, SETTINGS, SYSTEM_NAME, Weight } from "@util"
import { ActorDataModel } from "@data/actor/base.ts"
import type { AnyObject, DeepPartial } from "fvtt-types/utils"

class SheetSettings extends foundry.abstract.DataModel<SheetSettingsSchema, ActorDataModel | null> {
	static override defineSchema(): SheetSettingsSchema {
		return sheetSettingsSchema
	}

	/* -------------------------------------------- */

	get actor(): Actor.Implementation | null {
		if (this.parent && this.parent instanceof ActorGURPS) return this.parent
		return null
	}
}

/* -------------------------------------------- */

const sheetSettingsSchema = {
	damageProgression: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		choices: progression.OptionsChoices,
		initial: progression.Option.BasicSet,
		label: "GURPS.Settings.SheetSettings.FIELDS.damage_progression.Name",
	}),
	defaultLengthUnits: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		choices: Length.UnitChoices,
		initial: Length.Unit.FeetAndInches,
		label: "GURPS.Settings.SheetSettings.FIELDS.DefaultLengthUnits.Name",
	}),
	defaultWeightUnits: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		choices: Weight.UnitChoices,
		initial: Weight.Unit.Pound,
		label: "GURPS.Settings.SheetSettings.FIELDS.DefaultWeightUnits.Name",
	}),
	userDescriptionDisplay: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		choices: display.OptionsChoices,
		initial: display.Option.Tooltip,
		label: "GURPS.Settings.SheetSettings.FIELDS.UserDescriptionDisplay.Name",
	}),
	modifiersDisplay: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		choices: display.OptionsChoices,
		initial: display.Option.Inline,
		label: "GURPS.Settings.SheetSettings.FIELDS.ModifiersDisplay.Name",
	}),
	notesDisplay: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		choices: display.OptionsChoices,
		initial: display.Option.Inline,
		label: "GURPS.Settings.SheetSettings.FIELDS.NotesDisplay.Name",
	}),
	skillLevelAdjDisplay: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		choices: display.OptionsChoices,
		initial: display.Option.Tooltip,
		label: "GURPS.Settings.SheetSettings.FIELDS.SkillLevelAdjDisplay.Name",
	}),
	useMultiplicativeModifiers: new fields.BooleanField({
		required: true,
		nullable: false,
		initial: false,
		label: "GURPS.Settings.SheetSettings.FIELDS.UseMultiplicativeModifiers.Name",
	}),
	useModifyingDicePlusAdds: new fields.BooleanField({
		required: true,
		nullable: false,
		initial: false,
		label: "GURPS.Settings.SheetSettings.FIELDS.UseModifyingDicePlusAdds.Name",
	}),
	useHalfStatDefaults: new fields.BooleanField({
		required: true,
		nullable: false,
		initial: false,
		label: "GURPS.Settings.SheetSettings.FIELDS.UseHalfStatDefaults.Name",
	}),
	showTraitModifierAdj: new fields.BooleanField({
		required: true,
		nullable: false,
		initial: false,
		label: "GURPS.Settings.SheetSettings.FIELDS.ShowTraitModifierAdj.Name",
	}),
	showEquipmentModifierAdj: new fields.BooleanField({
		required: true,
		nullable: false,
		initial: false,
		label: "GURPS.Settings.SheetSettings.FIELDS.ShowEquipmentModifierAdj.Name",
	}),
	showSpellAdj: new fields.BooleanField({
		required: true,
		nullable: false,
		initial: true,
		label: "GURPS.Settings.SheetSettings.FIELDS.ShowSpellAdj.Name",
	}),
	excludeUnspentPointsFromTotal: new fields.BooleanField({
		required: true,
		nullable: false,
		initial: false,
		label: "GURPS.Settings.SheetSettings.FIELDS.ExcludeUnspentPointsFromTotal.Name",
	}),
}

type SheetSettingsSchema = typeof sheetSettingsSchema

/* -------------------------------------------- */

class SheetSettingsConfig extends api.HandlebarsApplicationMixin(api.ApplicationV2<AnyObject>) {
	constructor(options: DeepPartial<api.ApplicationV2.Configuration> = {}) {
		super(options)
	}

	/* -------------------------------------------- */

	static override DEFAULT_OPTIONS = {
		id: "sheet-settings-config",
		tag: "form",
		window: {
			contentClasses: ["standard-form"],
			icon: "fa-solid fa-palette",
			title: "GURPS.Settings.SheetSettings.Title",
		},
		position: {
			width: 660,
			// height: "auto",
		},
		form: {
			submitOnChange: false,
			closeOnSubmit: true,
			handler: SheetSettingsConfig.#onSubmit,
		},
		actions: {
			reset: SheetSettingsConfig.#onReset,
		},
	}

	/* -------------------------------------------- */

	static override PARTS = {
		sheetSettings: {
			id: "sheet-settings",
			template: `systems/${SYSTEM_NAME}/templates/apps/sheet-settings-config.hbs`,
		},
		footer: {
			template: "templates/generic/form-footer.hbs",
		},
	}

	/* -------------------------------------------- */

	static registerSettings(): void {
		game.settings?.register(SYSTEM_NAME, SETTINGS.DEFAULT_SHEET_SETTINGS, {
			name: "",
			scope: "world",
			type: SheetSettings,
			default: new SheetSettings(),
		})
	}

	/* -------------------------------------------- */

	protected override async _prepareContext(
		options: DeepPartial<foundry.applications.api.ApplicationV2.RenderOptions> & { isFirstRender: boolean },
	): Promise<AnyObject> {
		super._prepareContext(options)
		const current = game.settings?.get(SYSTEM_NAME, SETTINGS.DEFAULT_SHEET_SETTINGS)

		return {
			fields: SheetSettings.schema.fields,
			source: current,
			buttons: [
				{
					type: "reset",
					action: "reset",
					icon: "fa-solid fa-sync",
					label: "GURPS.Settings.SheetSettings.Reset",
				},
				{ type: "submit", icon: "fa-solid fa-save", label: "GURPS.Settings.SheetSettings.Submit" },
			],
		}
	}

	/* -------------------------------------------- */

	protected override async _onRender(
		context: object,
		options: DeepPartial<api.ApplicationV2.RenderOptions>,
	): Promise<void> {
		// Set the initial value for the progression hint text
		const progressionField = this.element.querySelector(`select[name="damage_progression"]`) as HTMLSelectElement
		const hintElement = this.element.querySelector("div.form-group.damage-progression p.hint") as HTMLElement
		console.log(progressionField)
		console.log(hintElement)
		const progressionValue = progressionField?.value as progression.Option
		const hintText = i18n.localize(progression.Option.toAltString(progressionValue))
		if (hintElement) hintElement.innerHTML = hintText

		// Dynamically update the hint text wen the progression value is changed
		progressionField?.addEventListener("change", e => {
			e.preventDefault()
			e.stopImmediatePropagation()
			const newValue = (e.currentTarget as HTMLSelectElement).value
			const hintText = i18n.localize(progression.Option.toAltString(newValue as progression.Option))
			if (hintElement) hintElement.innerHTML = hintText
		})
		return super._onRender(context, options)
	}

	/* -------------------------------------------- */

	static async #onSubmit(
		event: Event | SubmitEvent,
		_form: HTMLFormElement,
		formData: FormDataExtended,
	): Promise<void> {
		event.preventDefault()

		const data = new SheetSettings(formData.object as foundry.abstract.DataModel.CreateData<SheetSettingsSchema>)
		game.settings?.set(SYSTEM_NAME, SETTINGS.DEFAULT_SHEET_SETTINGS, data)
		ui.notifications?.info("GURPS.Settings.SheetSettings.MessageSubmit", { localize: true })
	}

	static async #onReset(this: api.ApplicationV2, event: Event): Promise<void> {
		event.preventDefault()

		if (game.settings && game.settings.settings.has(`${SYSTEM_NAME}.${SETTINGS.DEFAULT_SHEET_SETTINGS}`)) {
			const defaults = game.settings.settings.get(`${SYSTEM_NAME}.${SETTINGS.DEFAULT_SHEET_SETTINGS}`)!
				.default as SheetSettings
			await game.settings.set(SYSTEM_NAME, SETTINGS.DEFAULT_SHEET_SETTINGS, defaults)
			ui.notifications?.info("GURPS.Settings.SheetSettings.MessageReset", { localize: true })
		}
		await this.render()
	}
}

export { SheetSettingsConfig, SheetSettings, type SheetSettingsSchema }
