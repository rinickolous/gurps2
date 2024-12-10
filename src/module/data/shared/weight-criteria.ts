import { NumericComparison } from "@util/enums/numeric-comparison.ts"
import fields = foundry.data.fields
import { Weight } from "@util/weight.ts"
import { i18n } from "@util/i18n.ts"

class WeightCriteria extends foundry.abstract.DataModel<WeightCriteriaSchema> {
	static override defineSchema(): WeightCriteriaSchema {
		const fields = foundry.data.fields
		return {
			compare: new fields.StringField({
				required: true,
				nullable: false,
				choices: NumericComparison.Options,
				initial: NumericComparison.Option.AnyNumber,
			}),
			qualifier: new fields.StringField({
				required: true,
				nullable: false,
				initial: `0 ${Weight.Unit.Pound}`,
			}),
		}
	}

	matches(n: number): boolean {
		const qualifier = Weight.fromString(this.qualifier)
		const value = Weight.fromString(n.toString())
		switch (this.compare) {
			case NumericComparison.Option.AnyNumber:
				return true
			case NumericComparison.Option.EqualsNumber:
				return value === qualifier
			case NumericComparison.Option.NotEqualsNumber:
				return value !== qualifier
			case NumericComparison.Option.AtLeastNumber:
				return value >= qualifier
			case NumericComparison.Option.AtMostNumber:
				return value <= qualifier
			default:
				return false
		}
	}

	override toString(): string {
		return i18n.localize(`GURPS.WeightCriteria.${this.compare}.Name`)
	}

	altString(): string {
		return i18n.localize(`GURPS.WeightCriteria.${this.compare}.Alt`)
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
		return result + this.qualifier.toString()
	}
}

type WeightCriteriaSchema = {
	compare: fields.StringField<{ required: true; nullable: false }, NumericComparison.Option>
	qualifier: fields.StringField<{ required: true; nullable: false }, string>
}

export { WeightCriteria, type WeightCriteriaSchema }
