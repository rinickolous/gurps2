import { NumericComparison } from "@util/enums/numeric-comparison.ts"
import fields = foundry.data.fields
import { i18n } from "@util/i18n.ts"

class NumericCriteria extends foundry.abstract.DataModel<NumericCriteriaSchema> {
	static override defineSchema(): NumericCriteriaSchema {
		const fields = foundry.data.fields
		return {
			compare: new fields.StringField({
				required: true,
				nullable: false,
				blank: false,
				choices: NumericComparison.OptionsChoices,
				initial: NumericComparison.Option.AnyNumber,
			}),
			qualifier: new fields.NumberField(),
		}
	}

	matches(n: number): boolean {
		if (this.qualifier === null) this.qualifier = 0
		switch (this.compare) {
			case NumericComparison.Option.AnyNumber:
				return true
			case NumericComparison.Option.EqualsNumber:
				return n === this.qualifier
			case NumericComparison.Option.NotEqualsNumber:
				return n !== this.qualifier
			case NumericComparison.Option.AtLeastNumber:
				return n >= this.qualifier
			case NumericComparison.Option.AtMostNumber:
				return n <= this.qualifier
			default:
				return false
		}
	}

	override toString(): string {
		return i18n.localize(`GURPS.NumericCriteria.${this.compare}.Name`)
	}

	altString(): string {
		return i18n.localize(`GURPS.NumericCriteria.${this.compare}.Alt`)
	}

	describe(): string {
		const result = this.toString()
		if (this.compare === NumericComparison.Option.AnyNumber) return result
		return `${result} ${this.qualifier}`
	}

	altDescribe(): string {
		let result = this.altString()
		if (this.compare === NumericComparison.Option.AnyNumber) return result
		if (result !== "") result += " "
		return result + (this.qualifier ?? 0).toString()
	}
}

type NumericCriteriaSchema = {
	compare: fields.StringField<{ required: true; nullable: false }, NumericComparison.Option>
	qualifier: fields.NumberField<{ required: true; nullable: false }, number>
}

export { NumericCriteria, type NumericCriteriaSchema }
