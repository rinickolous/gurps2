import { Nameable, StringComparison, createDummyElement, feature, spellmatch } from "@util"
import { BaseFeature, BaseFeatureSchema } from "./base-feature.ts"
import { ExtendedStringField, StringCriteriaField } from "@data/fields/index.ts"

class SpellPointBonus extends BaseFeature<SpellPointBonusSchema> {
	static override TYPE = feature.Type.SpellPointBonus

	/* -------------------------------------------- */

	static override defineSchema(): SpellPointBonusSchema {
		return {
			...super.defineSchema(),
			...spellPointBonusSchema
		}
	}

	/* -------------------------------------------- */

	matchForType(replacements: Map<string, string>, name: string, powerSource: string, colleges: string[]): boolean {
		return spellmatch.Type.matchForType(this.match, replacements, this.name, name, powerSource, colleges)
	}

	/* -------------------------------------------- */

	override toFormElement(enabled: boolean): HTMLElement {
		const prefix = `system.features.${this.index}`
		const element = super.toFormElement(enabled)
		const replacements = this.replacements

		if (!enabled) {
			element.append(createDummyElement(`${prefix}.match`, this.match))
			element.append(createDummyElement(`${prefix}.name.compare`, this.name.compare))
			element.append(createDummyElement(`${prefix}.name.qualifier`, this.name.qualifier))
			element.append(createDummyElement(`${prefix}.tags.compare`, this.tags.compare))
			element.append(createDummyElement(`${prefix}.tags.qualifier`, this.tags.qualifier))
		}

		const rowElement1 = document.createElement("div")
		rowElement1.classList.add("form-fields", "secondary")
		const rowElement2 = document.createElement("div")
		rowElement2.classList.add("form-fields", "secondary")

		// Selection Type
		rowElement1.append(
			this.schema.fields.match.toInput({
				name: enabled ? `${prefix}.match` : "",
				value: this.match,
				localize: true,
				disabled: !enabled,
			}) as HTMLElement,
		)
		// Name
		rowElement1.append(
			this.schema.fields.name.fields.compare.toInput({
				name: enabled ? `${prefix}.name.compare` : "",
				value: this.name.compare,
				disabled: !enabled || this.match === spellmatch.Type.AllColleges,
				localize: true,
			}) as HTMLElement,
		)
		rowElement1.append(
			this.schema.fields.name.fields.qualifier.toInput({
				name: enabled ? `${prefix}.name.qualifier` : "",
				value: this.name.qualifier,
				disabled:
					!enabled ||
					this.name.compare === StringComparison.Option.AnyString ||
					this.match === spellmatch.Type.AllColleges,
				replacements,
			}) as HTMLElement,
		)
		element.append(rowElement1)

		// Tags
		rowElement2.append(
			this.schema.fields.tags.fields.compare.toInput({
				name: enabled ? `${prefix}.tags.compare` : "",
				value: this.tags.compare,
				localize: true,
				disabled: !enabled,
			}) as HTMLElement,
		)
		rowElement2.append(
			this.schema.fields.tags.fields.qualifier.toInput({
				name: enabled ? `${prefix}.tags.qualifier` : "",
				value: this.tags.qualifier,
				disabled: !enabled || this.tags.compare === StringComparison.Option.AnyString,
				replacements,
			}) as HTMLElement,
		)
		element.append(rowElement2)

		return element
	}

	/* -------------------------------------------- */

	fillWithNameableKeys(m: Map<string, string>, existing: Map<string, string>): void {
		if (this.match !== spellmatch.Type.AllColleges) {
			Nameable.extract(this.name.qualifier, m, existing)
		}
		Nameable.extract(this.tags.qualifier, m, existing)
	}
}


const spellPointBonusSchema = {
	match: new ExtendedStringField({
		required: true,
		nullable: false,
		blank: false,
		togglable: true,
		choices: spellmatch.TypesChoices,
		initial: spellmatch.Type.AllColleges,
	}),
	name: new StringCriteriaField({
		required: true,
		nullable: false,
		toggleable: true,
		replaceable: true,
		initial: { compare: StringComparison.Option.IsString, qualifier: "" },
	}),
	tags: new StringCriteriaField({
		required: true,
		nullable: false,
		toggleable: true,
		replaceable: true,
		choices: StringComparison.CustomOptionsChoicesPlural(
			"GURPS.Item.Features.FIELDS.SkillBonus.TagsSingle",
			"GURPS.Item.Features.FIELDS.SkillBonus.TagsPlural",
		),
	}),
}

type SpellPointBonusSchema = BaseFeatureSchema & typeof spellPointBonusSchema

export { SpellPointBonus, type SpellPointBonusSchema }
