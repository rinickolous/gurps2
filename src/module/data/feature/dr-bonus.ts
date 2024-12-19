import { BaseFeature, BaseFeatureSchema } from "./base-feature.ts"
import fields = foundry.data.fields
import { createDummyElement, equalFold, feature, GID, i18n, TooltipGURPS } from "@util"
import { CharacterSettings } from "@data/actor/fields/character-settings.ts"
import { StringArrayField } from "@data/fields/index.ts"

class DRBonus extends BaseFeature<DRBonusSchema> {
	static override TYPE = feature.Type.DRBonus

	static override defineSchema(): DRBonusSchema {
		return {
			...super.defineSchema(),
			...drBonusSchema
		}
	}

	override addToTooltip(tooltip: TooltipGURPS | null): void {
		if (tooltip !== null) {
			tooltip.push("\n")
			tooltip.push(this.parentName)
			tooltip.push(
				i18n.format("GURPS.Feature.DRBonus", {
					level: this.format(false),
					type: this.specialization ?? GID.All,
				}),
			)
		}
	}

	static override cleanData(source?: object, options?: Parameters<fields.SchemaField.Any["clean"]>[1]): object {
		if (source) {
			if ("locations" in source && Array.isArray(source.locations)) {
				for (const location of source.locations ?? []) {
					if (equalFold(location, GID.All)) {
						source.locations = [GID.All]
						break
					}
				}
			}
			if ("specialization" in source && typeof source.specialization === "string") {
				let specialization = source?.specialization?.trim() ?? ""
				if (specialization === "" || equalFold(specialization, GID.All)) specialization = GID.All
				source.specialization = specialization
			}
		}

		return super.cleanData(source, options)
	}

	get locationOptions(): { key: string; value: string }[] {
		const settings = CharacterSettings.for(this.parent.actor)
		const locations: { key: string; value: string }[] = []
		for (const location of settings.body_type.locations) {
			if (!locations.some(e => e.key === location.id))
				locations.push({ key: location.id, value: location.choice_name })
		}
		return locations.sort((a, b) => (a.value > b.value ? 1 : a.value < b.value ? -1 : 0))
	}

	override toFormElement(enabled: boolean): HTMLElement {
		const prefix = `system.features.${this.index}`
		const element = super.toFormElement(enabled)

		if (!enabled) {
			for (const location of this.locations) {
				element.append(createDummyElement(`${prefix}.locations`, location))
			}
			element.append(createDummyElement(`${prefix}.specialization`, this.specialization))
		}

		const options = this.locationOptions

		const rowElement1 = document.createElement("div")
		rowElement1.classList.add("form-fields", "secondary")
		const rowElement3 = document.createElement("div")
		rowElement3.classList.add("form-fields", "secondary")

		rowElement1.append(
			foundry.applications.fields.createSelectInput({
				name: enabled ? `${prefix}.locations` : "",
				value: this.locations[0] === GID.All ? GID.All : "",
				localize: true,
				options: [
					{
						value: GID.All,
						label: "GURPS.Item.Features.FIELDS.DRBonus.Locations.All",
					},
					{
						value: "",
						label: "GURPS.Item.Features.FIELDS.DRBonus.Locations.Some",
					},
				],
				disabled: !enabled,
			}),
		)
		element.append(rowElement1)

		if (this.locations[0] !== GID.All) {
			const rowElement2 = document.createElement("div")
			rowElement2.classList.add("form-fields", "secondary", "dr-locations")

			for (const option of options) {
				const label = document.createElement("label")
				const checkbox = foundry.applications.fields.createCheckboxInput({
					name: enabled ? `${prefix}.locations` : "",
					value: this.locations.includes(option.key),
					disabled: !enabled,
				})
				checkbox.setAttribute("value", option.key)
				label.innerHTML += option.value
				label.append(checkbox)
				rowElement2.append(label)
			}

			element.append(rowElement2)
		}

		const labelBefore = document.createElement("label")
		labelBefore.innerHTML = i18n.localize("GURPS.Item.Features.FIELDS.DRBonus.SpecializationBefore")
		rowElement3.append(labelBefore)

		rowElement3.append(
			this.schema.fields.specialization.toInput({
				name: enabled ? `${prefix}.specialization` : "",
				value: this.specialization,
				localize: true,
				disabled: !enabled,
			}) as HTMLElement,
		)

		const labelAfter = document.createElement("label")
		labelAfter.innerHTML = i18n.localize("GURPS.Item.Features.FIELDS.DRBonus.SpecializationAfter")
		rowElement3.append(labelAfter)

		element.append(rowElement3)

		return element
	}

	fillWithNameableKeys(_m: Map<string, string>, _existing: Map<string, string>): void { }
}


const drBonusSchema = {
	locations: new StringArrayField({
		required: true,
		nullable: false,
		initial: [GID.Torso],
	}),
	specialization: new fields.StringField({ required: true, nullable: false, initial: GID.All }),
}

type DRBonusSchema = BaseFeatureSchema & typeof drBonusSchema

export { DRBonus, type DRBonusSchema }
