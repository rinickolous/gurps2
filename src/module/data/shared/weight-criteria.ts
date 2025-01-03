import { NumericComparison } from "@util/enums/numeric-comparison.ts"
import { Weight } from "@util/weight.ts"
import { i18n } from "@util/i18n.ts"
import DataModel = foundry.abstract.DataModel
import { ExtendedStringField } from "@data/fields/extended-string-field.ts"

class WeightCriteria<
	const Parent extends DataModel.Any | null = null,
	const  ExtraConstructorOptions extends CriteriaConstructorOptions = {},
> extends DataModel<WeightCriteriaSchema, Parent, ExtraConstructorOptions> {

	constructor(
		data?: DataModel.ConstructorData<WeightCriteriaSchema>,
		options?: DataModel.DataValidationOptions<Parent> & ExtraConstructorOptions,
	) {
		super(data, options)

		if (options) {
			if ("toggleable" in options) {
				this.schema.fields.compare.toggleable = options.toggleable ?? false
				this.schema.fields.qualifier.toggleable = options.toggleable ?? false
			}

			if ("replaceable" in options) {
				this.schema.fields.qualifier.replaceable = options.toggleable ?? false
			}
		}
	}

	/* -------------------------------------------- */

	static override defineSchema(): WeightCriteriaSchema {
		return weightCriteriaSchema
	}

	/* -------------------------------------------- */

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

	/* -------------------------------------------- */

	override toString(): string {
		return i18n.localize(`GURPS.WeightCriteria.${this.compare}.Name`)
	}

	/* -------------------------------------------- */

	altString(): string {
		return i18n.localize(`GURPS.WeightCriteria.${this.compare}.Alt`)
	}

	/* -------------------------------------------- */

	describe(): string {
		const result = this.toString()
		if (this.compare === NumericComparison.Option.AnyNumber) return result
		return `${result} ${this.qualifier}`
	}

	/* -------------------------------------------- */

	altDescribe(): string {
		let result = this.altString()
		if (this.compare === NumericComparison.Option.AnyNumber) return result
		if (result !== "") result += " "
		return result + this.qualifier.toString()
	}
}

const weightCriteriaSchema = {
	compare: new ExtendedStringField({
		required: true,
		nullable: false,
		choices: NumericComparison.Options,
		initial: NumericComparison.Option.AnyNumber,
	}),
	qualifier: new ExtendedStringField({
		required: true,
		nullable: false,
		initial: `0 ${Weight.Unit.Pound}`,
	}),
}

type WeightCriteriaSchema = typeof weightCriteriaSchema

export { WeightCriteria, type WeightCriteriaSchema }
