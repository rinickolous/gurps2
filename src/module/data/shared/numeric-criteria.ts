import { NumericComparison } from "@util/enums/numeric-comparison.ts"
import { i18n } from "@util/i18n.ts"
import DataModel = foundry.abstract.DataModel
import { ExtendedStringField } from "@data/fields/extended-string-field.ts"
import { ExtendedNumberField } from "@data/fields/extended-number-field.ts"

class NumericCriteria<
	const Parent extends DataModel.Any | null = null,
	const  ExtraConstructorOptions extends CriteriaConstructorOptions = {},
> extends DataModel<NumericCriteriaSchema, Parent, ExtraConstructorOptions> {

	constructor(
		data?: DataModel.ConstructorData<NumericCriteriaSchema>,
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

	static override defineSchema(): NumericCriteriaSchema {
		return numericCriteriaSchema
	}

	/* -------------------------------------------- */

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

	/* -------------------------------------------- */

	override toString(): string {
		return i18n.localize(`GURPS.NumericCriteria.${this.compare}.Name`)
	}

	/* -------------------------------------------- */

	altString(): string {
		return i18n.localize(`GURPS.NumericCriteria.${this.compare}.Alt`)
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
		return result + (this.qualifier ?? 0).toString()
	}
}

const numericCriteriaSchema = {
	compare: new ExtendedStringField({
		required: true,
		nullable: false,
		blank: false,
		choices: NumericComparison.OptionsChoices,
		initial: NumericComparison.Option.AnyNumber,
	}),
	qualifier: new ExtendedNumberField({ required: true, nullable: false }),
}

type NumericCriteriaSchema = typeof numericCriteriaSchema

export { NumericCriteria, type NumericCriteriaSchema }
