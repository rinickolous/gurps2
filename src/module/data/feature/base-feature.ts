import type { Feature, FeatureInstances } from "./types.ts"
import fields = foundry.data.fields
import { EffectDataModel, ItemDataModel } from "@data"
import { createButton, createDummyElement, feature, i18n, ItemTemplateType, ItemType, TooltipGURPS } from "@util"
import { ActiveEffectGURPS, ItemGURPS } from "@documents"

abstract class BaseFeature<
	Schema extends BaseFeatureSchema = BaseFeatureSchema,
	Parent extends ItemDataModel | EffectDataModel = ItemDataModel | EffectDataModel
> extends foundry.abstract.DataModel<
	Schema,
	Parent
> {
	declare private _owner: ItemGURPS | ActiveEffectGURPS | null
	declare private _subOwner: ItemGURPS | ActiveEffectGURPS | null

	declare featureLevel: number

	declare static TYPE: feature.Type
	/**
	 * Type safe way of verifying if an Feature is of a particular type.
	 */
	isOfType<T extends feature.Type>(...types: T[]): this is FeatureInstances[T] {
		return types.some(t => this.type === t)
	}

	static override defineSchema(): BaseFeatureSchema {
		return baseFeatureSchema
	}

	constructor(
		data?: foundry.abstract.DataModel.ConstructorData<Schema>,
		options?: foundry.abstract.DataModel.DataValidationOptions<Parent>
	) {
		super(data, options)
		this._owner = null
		this._subOwner = null

		this.featureLevel = 0
	}

	get owner(): ItemGURPS | ActiveEffectGURPS | null {
		return this._owner
	}

	set owner(owner: ItemGURPS | ActiveEffectGURPS | null) {
		this._owner = owner
		if (owner !== null) {
			if (owner instanceof ActiveEffectGURPS) (this as BaseFeature).temporary = true
			else (this as BaseFeature).temporary = false
		}
	}

	get subOwner(): ItemGURPS | ActiveEffectGURPS | null {
		return this._subOwner
	}

	set subOwner(subOwner: ItemGURPS | ActiveEffectGURPS | null) {
		this._subOwner = subOwner
	}

	get index(): number {
		if (this.parent instanceof ItemDataModel && !this.parent.hasTemplate(ItemTemplateType.FeatureHolder)) return -1

		return (this.parent as any).features.indexOf(this as unknown as Feature)
	}

	get parentName(): string {
		if (!this.owner) return "Unknown"
		if (this.owner instanceof ActiveEffectGURPS) return this.owner.name

		if (!this.owner.hasTemplate(ItemTemplateType.BasicInformation)) return "Unknown"
		const owner = this.owner.system.nameWithReplacements
		if (!this.subOwner) return owner
		if (this.subOwner instanceof ActiveEffectGURPS) return this.subOwner.name

		if (!this.subOwner.hasTemplate(ItemTemplateType.BasicInformation)) return "Unknown"
		return `${owner} (${this.subOwner.system.nameWithReplacements})`
	}

	get adjustedAmount(): number {
		let amt = (this as BaseFeature).amount
		if (this.per_level) {
			if (this.featureLevel < 0) return 0
			amt *= (this as BaseFeature).featureLevel
		}
		return amt
	}

	get element(): Handlebars.SafeString {
		const enabled: boolean = (this.parent.parent.sheet as any).editable
		return new Handlebars.SafeString(this.toFormElement(enabled).outerHTML)
	}

	get replacements(): Map<string, string> {
		return this.parent instanceof ItemDataModel && this.parent.hasTemplate(ItemTemplateType.ReplacementHolder)
			? this.parent.replacements
			: new Map()
	}

	getTypeChoices(): { value: string; label: string }[] {
		const choices =
			!(this.parent instanceof ItemDataModel) || this.parent.isOfType(ItemType.EquipmentContainer)
				? feature.TypesChoices
				: feature.TypesWithoutContainedWeightReductionChoices

		return Object.entries(choices).map(([value, label]) => {
			return { value, label }
		})
	}

	addToTooltip(tooltip: TooltipGURPS | null): void {
		return this.basicAddToTooltip(tooltip)
	}

	basicAddToTooltip(tooltip: TooltipGURPS | null): void {
		if (tooltip !== null) {
			// tooltip.push("\n")
			tooltip.push(this.parentName)
			tooltip.push(" [")
			tooltip.push(this.format(false))
			tooltip.push("]")
		}
	}

	format(this: BaseFeature, asPercentage: boolean): string {
		let amt = this.amount.signedString()
		let adjustedAmt = this.adjustedAmount.signedString()
		if (asPercentage) {
			amt += "%"
			adjustedAmt += "%"
		}
		if (this.per_level)
			return i18n.format("GURPS.Feature.WeaponBonus.PerLevel", {
				total: adjustedAmt,
				base: amt,
			})
		return amt
	}

	toFormElement(this: BaseFeature, enabled: boolean): HTMLElement {
		const prefix = `system.features.${this.index}`
		const element = document.createElement("li")

		element.append(createDummyElement(`${prefix}.temporary`, this.temporary))
		if (!enabled) {
			element.append(createDummyElement(`${prefix}.type`, this.type))
			element.append(createDummyElement(`${prefix}.amount`, this.amount))
			element.append(createDummyElement(`${prefix}.per_level`, this.per_level))
		}

		const rowElement = document.createElement("div")
		rowElement.classList.add("form-fields")

		rowElement.append(
			createButton({
				icon: ["fa-regular", "fa-trash"],
				label: "",
				data: {
					deleteFeature: "",
					index: this.index.toString(),
				},
				disabled: !enabled,
			}),
		)

		rowElement.append(
			foundry.applications.fields.createSelectInput({
				name: enabled ? `${prefix}.type` : "",
				value: this.type,
				dataset: {
					selector: "feature-type",
					index: this.index.toString(),
				},
				localize: true,
				options: this.getTypeChoices(),
				disabled: !enabled,
			}),
		)

		rowElement.append(
			this.schema.fields.amount.toInput({
				name: enabled ? `${prefix}.amount` : "",
				value: this.amount,
				localize: true,
				disabled: !enabled,
			}) as HTMLElement,
		)

		const perLevelLabelElement = document.createElement("label")
		perLevelLabelElement.append(
			this.schema.fields.per_level.toInput({
				name: enabled ? `${prefix}.per_level` : "",
				value: this.per_level,
				localize: true,
				disabled: !enabled,
			}) as HTMLElement,
		)
		perLevelLabelElement.innerHTML += i18n.localize(this.schema.fields.per_level.options.label ?? "")
		rowElement.append(perLevelLabelElement)

		element.append(rowElement)

		return element
	}

	abstract fillWithNameableKeys(m: Map<string, string>, existing: Map<string, string>): void
}

const baseFeatureSchema = {
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		choices: feature.TypesChoices,
		// initial: this.TYPE,
	}),
	amount: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 1 }),
	per_level: new fields.BooleanField({
		required: true,
		nullable: false,
		initial: false,
		label: "GURPS.Item.Features.FIELDS.PerLevel",
	}),
	temporary: new fields.BooleanField({ required: true, nullable: false, initial: false }),
}

type BaseFeatureSchema = typeof baseFeatureSchema

export { BaseFeature, type BaseFeatureSchema }
