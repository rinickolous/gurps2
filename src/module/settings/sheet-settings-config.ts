import { ActorGURPS } from "@documents/actor.ts"
import fields = foundry.data.fields
import api = foundry.applications.api
import type { AnyObject, DeepPartial } from "@league-of-foundry-developers/foundry-vtt-types/src/types/utils.d.mts"
import { display, i18n, Length, progression, SETTINGS, SYSTEM_NAME, Weight } from "@util"
import { ActorDataModel } from "@data/actor/base.ts"

class SheetSettings extends foundry.abstract.DataModel<SheetSettingsSchema, ActorDataModel | null> {
	static override defineSchema(): SheetSettingsSchema {
		const fields = foundry.data.fields
		return {
			damage_progression: new fields.StringField({
				required: true,
				nullable: false,
				blank: false,
				choices: progression.OptionsChoices,
				initial: progression.Option.BasicSet,
				label: "GURPS.Settings.SheetSettings.FIELDS.damage_progression.Name",
			}),
			default_length_units: new fields.StringField({
				required: true,
				nullable: false,
				blank: false,
				choices: Length.UnitChoices,
				initial: Length.Unit.FeetAndInches,
				label: "GURPS.Settings.SheetSettings.FIELDS.default_length_units.Name",
			}),
			default_weight_units: new fields.StringField({
				required: true,
				nullable: false,
				blank: false,
				choices: Weight.UnitChoices,
				initial: Weight.Unit.Pound,
				label: "GURPS.Settings.SheetSettings.FIELDS.default_weight_units.Name",
			}),
			user_description_display: new fields.StringField({
				required: true,
				nullable: false,
				blank: false,
				choices: display.OptionsChoices,
				initial: display.Option.Tooltip,
				label: "GURPS.Settings.SheetSettings.FIELDS.user_description_display.Name",
			}),
			modifiers_display: new fields.StringField({
				required: true,
				nullable: false,
				blank: false,
				choices: display.OptionsChoices,
				initial: display.Option.Inline,
				label: "GURPS.Settings.SheetSettings.FIELDS.modifiers_display.Name",
			}),
			notes_display: new fields.StringField({
				required: true,
				nullable: false,
				blank: false,
				choices: display.OptionsChoices,
				initial: display.Option.Inline,
				label: "GURPS.Settings.SheetSettings.FIELDS.notes_display.Name",
			}),
			skill_level_adj_display: new fields.StringField({
				required: true,
				nullable: false,
				blank: false,
				choices: display.OptionsChoices,
				initial: display.Option.Tooltip,
				label: "GURPS.Settings.SheetSettings.FIELDS.skill_level_adj_display.Name",
			}),
			use_multiplicative_modifiers: new fields.BooleanField({
				required: true,
				nullable: false,
				initial: false,
				label: "GURPS.Settings.SheetSettings.FIELDS.use_multiplicative_modifiers.Name",
			}),
			use_modifying_dice_plus_adds: new fields.BooleanField({
				required: true,
				nullable: false,
				initial: false,
				label: "GURPS.Settings.SheetSettings.FIELDS.use_modifying_dice_plus_adds.Name",
			}),
			use_half_stat_defaults: new fields.BooleanField({
				required: true,
				nullable: false,
				initial: false,
				label: "GURPS.Settings.SheetSettings.FIELDS.use_half_stat_defaults.Name",
			}),
			show_trait_modifier_adj: new fields.BooleanField({
				required: true,
				nullable: false,
				initial: false,
				label: "GURPS.Settings.SheetSettings.FIELDS.show_trait_modifier_adj.Name",
			}),
			show_equipment_modifier_adj: new fields.BooleanField({
				required: true,
				nullable: false,
				initial: false,
				label: "GURPS.Settings.SheetSettings.FIELDS.show_equipment_modifier_adj.Name",
			}),
			show_spell_adj: new fields.BooleanField({
				required: true,
				nullable: false,
				initial: true,
				label: "GURPS.Settings.SheetSettings.FIELDS.show_spell_adj.Name",
			}),
			exclude_unspent_points_from_total: new fields.BooleanField({
				required: true,
				nullable: false,
				initial: false,
				label: "GURPS.Settings.SheetSettings.FIELDS.exclude_unspent_points_from_total.Name",
			}),
		}
	}

	/* -------------------------------------------- */

	get actor(): ActorGURPS | null {
		if (this.parent && this.parent instanceof ActorGURPS) return this.parent
		return null
	}
}

/* -------------------------------------------- */

type SheetSettingsSchema = {
	damage_progression: fields.StringField<{ required: true; nullable: false; blank: false }, progression.Option>
	default_length_units: fields.StringField<{ required: true; nullable: false; blank: false }, Length.Unit>
	default_weight_units: fields.StringField<{ required: true; nullable: false; blank: false }, Weight.Unit>
	user_description_display: fields.StringField<{ required: true; nullable: false; blank: false }, display.Option>
	modifiers_display: fields.StringField<{ required: true; nullable: false; blank: false }, display.Option>
	notes_display: fields.StringField<{ required: true; nullable: false; blank: false }, display.Option>
	skill_level_adj_display: fields.StringField<{ required: true; nullable: false; blank: false }, display.Option>
	use_multiplicative_modifiers: fields.BooleanField<{ required: true; nullable: false }>
	use_modifying_dice_plus_adds: fields.BooleanField<{ required: true; nullable: false }>
	use_half_stat_defaults: fields.BooleanField<{ required: true; nullable: false }>
	show_trait_modifier_adj: fields.BooleanField<{ required: true; nullable: false }>
	show_equipment_modifier_adj: fields.BooleanField<{ required: true; nullable: false }>
	show_spell_adj: fields.BooleanField<{ required: true; nullable: false }>
	exclude_unspent_points_from_total: fields.BooleanField<{ required: true; nullable: false }>
}

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

	protected override async _prepareContext(options: DeepPartial<api.ApplicationV2.RenderOptions> = {}) {
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

		const data = new SheetSettings(
			formData.object as foundry.abstract.DataModel.ConstructorData<SheetSettingsSchema>,
		)
		game.settings?.set(SYSTEM_NAME, SETTINGS.DEFAULT_SHEET_SETTINGS, data)
		ui.notifications?.info("GURPS.Settings.SheetSettings.MessageSubmit", { localize: true })
	}

	static async #onReset(this: api.ApplicationV2, event: Event): Promise<void> {
		event.preventDefault()

		const defaults = game.settings?.settings.get(`${SYSTEM_NAME}.${SETTINGS.DEFAULT_SHEET_SETTINGS}`)?.default
		// @ts-expect-error waiting on types to catch up
		await game.settings?.set(SYSTEM_NAME, SETTINGS.DEFAULT_SHEET_SETTINGS, defaults)
		ui.notifications?.info("GURPS.Settings.SheetSettings.MessageReset", { localize: true })
		await this.render()
	}
}

export { SheetSettingsConfig, SheetSettings, type SheetSettingsSchema }
