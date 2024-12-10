import { StringComparison } from "@util/enums/string-comparison.ts"
import fields = foundry.data.fields
import { i18n } from "@util/i18n.ts"
import { Nameable } from "@util/nameable.ts"

class StringCriteria extends foundry.abstract.DataModel<StringCriteriaSchema> {
	static override defineSchema(): StringCriteriaSchema {
		const fields = foundry.data.fields
		return {
			compare: new fields.StringField({
				required: true,
				nullable: false,
				blank: false,
				choices: StringComparison.OptionsChoices,
				initial: StringComparison.Option.AnyString,
			}),
			qualifier: new fields.StringField({ required: true, nullable: false }),
		}
	}

	matches(replacements: Map<string, string>, value: string): boolean {
		value = Nameable.apply(value, replacements)
		switch (this.compare) {
			case StringComparison.Option.AnyString:
				return true
			case StringComparison.Option.IsString:
				return equalFold(value, this.qualifier)
			case StringComparison.Option.IsNotString:
				return !equalFold(value, this.qualifier)
			case StringComparison.Option.ContainsString:
				return this.qualifier.toLowerCase().includes(value.toLowerCase())
			case StringComparison.Option.DoesNotContainString:
				return !this.qualifier.toLowerCase().includes(value.toLowerCase())
			case StringComparison.Option.StartsWithString:
				return this.qualifier.toLowerCase().startsWith(value.toLowerCase())
			case StringComparison.Option.DoesNotStartWithString:
				return !this.qualifier.toLowerCase().startsWith(value.toLowerCase())
			case StringComparison.Option.EndsWithString:
				return this.qualifier.toLowerCase().endsWith(value.toLowerCase())
			case StringComparison.Option.DoesNotEndWithString:
				return !this.qualifier.toLowerCase().endsWith(value.toLowerCase())
			default:
				return false
		}
	}

	matchesList(replacements: Map<string, string>, ...value: string[]): boolean {
		value = Nameable.applyToList(value, replacements)
		if (value.length === 0) return this.matches(replacements, "")
		let matches = 0
		for (const one of value) {
			if (this.matches(replacements, one)) matches += 1
		}
		switch (this.compare) {
			case StringComparison.Option.AnyString:
			case StringComparison.Option.IsString:
			case StringComparison.Option.ContainsString:
			case StringComparison.Option.StartsWithString:
			case StringComparison.Option.EndsWithString:
				return matches > 0
			case StringComparison.Option.IsNotString:
			case StringComparison.Option.DoesNotContainString:
			case StringComparison.Option.DoesNotStartWithString:
			case StringComparison.Option.DoesNotEndWithString:
				return matches === value.length
			default:
				return false
		}
	}

	override toString(replacements: Map<string, string> = new Map()): string {
		return this.describe(Nameable.apply(this.qualifier, replacements))
	}

	toStringWithPrefix(replacements: Map<string, string>, prefix: string, notPrefix: string): string {
		return this.describeWithPrefix(prefix, notPrefix, Nameable.apply(this.qualifier, replacements))
	}

	altString(): string {
		switch (this.compare) {
			case StringComparison.Option.IsNotString:
			case StringComparison.Option.DoesNotContainString:
			case StringComparison.Option.DoesNotStartWithString:
			case StringComparison.Option.DoesNotEndWithString:
				return i18n.localize(`GURPS.StringCriteria.${this.compare}.Alt`)
			default:
				return this.toString()
		}
	}

	describe(qualifier: string): string {
		if (this.compare === StringComparison.Option.AnyString)
			return i18n.localize(`GURPS.Enum.StringComparison[this.compare].Tooltip`)
		return i18n.format(`GURPS.Enum.StringComparison[this.compare].Tooltip`, {
			qualifier,
		})
	}

	describeWithPrefix(prefix: string, notPrefix: string, qualifier: string): string {
		let info = ""
		if (prefix === notPrefix)
			info = i18n.format(prefix, {
				value: i18n.localize(`GURPS.Enum.StringComparison.${this.compare}.Tooltip`),
			})
		else {
			info = i18n.format(notPrefix, {
				value: i18n.localize(`GURPS.Enum.StringComparison.${this.compare}.Tooltip`),
			})
		}
		if (this.compare === StringComparison.Option.AnyString) return info
		return i18n.format(info, { qualifier })
	}
}

type StringCriteriaSchema = {
	compare: fields.StringField<{ required: true; nullable: false }, StringComparison.Option>
	qualifier: fields.StringField<{ required: true; nullable: false }, string>
}

function equalFold(s: string, t: string): boolean {
	if (!s || !t) return false
	return s.toLowerCase() === t.toLowerCase()
}

function includesFold(s: string, t: string): boolean {
	if (!s && !t) return false
	return s.toLowerCase().includes(t.toLowerCase())
}

export { StringCriteria, equalFold, includesFold, type StringCriteriaSchema }