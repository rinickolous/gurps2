import { Feature, FeatureClass, FeatureSet, FeatureTypes } from "@data/feature/types.ts"
import { ErrorGURPS, feature, ItemType } from "@util"
import { ItemDataModel } from "../base.ts"
import { DRBonus } from "@data/feature/dr-bonus.ts"
import { MappingField } from "@data/fields/mapping-field.ts"
import { ItemGURPS } from "@documents/item.ts"
import fields = foundry.data.fields
import { AnyObject } from "fvtt-types/utils"

class FeatureHolderTemplate extends ItemDataModel<FeatureHolderSchema> {
	defineSchema(): FeatureHolderSchema {
		return featureHolderSchema
	}

	addFeaturesToSet(featureSet: FeatureSet): void {
		for (const f of this.features) {
			this._addFeatureToSet(f, featureSet)
		}
	}

	protected _addFeatureToSet(f: Feature, featureSet: FeatureSet, levels = 0): void {
		f.featureLevel = levels

		switch (true) {
			case f.isOfType(feature.Type.AttributeBonus):
				featureSet.attributeBonuses.push(f)
				break
			case f.isOfType(feature.Type.CostReduction):
				featureSet.costReductions.push(f)
				break
			case f.isOfType(feature.Type.SkillBonus):
				featureSet.skillBonuses.push(f)
				break
			case f.isOfType(feature.Type.SkillPointBonus):
				featureSet.skillPointBonuses.push(f)
				break
			case f.isOfType(feature.Type.SpellBonus):
				featureSet.spellBonuses.push(f)
				break
			case f.isOfType(feature.Type.SpellPointBonus):
				featureSet.spellPointBonuses.push(f)
				break
			case f.isOfType(...feature.WeaponBonusTypes):
				featureSet.weaponBonuses.push(f)
				break
			case f.isOfType(
				feature.Type.ConditionalModifierBonus,
				feature.Type.ContainedWeightReduction,
				feature.Type.ReactionBonus,
			):
				break
			case f.isOfType(feature.Type.DRBonus): {
				// Option "This Armor"
				if (f.locations.length === 0) {
					if (
						this.parent instanceof ItemGURPS &&
						this.parent.isOfType(ItemType.Equipment, ItemType.EquipmentContainer)
					) {
						const allLocations = new Set<string>()
						const locationsMatched = new Set<string>()
						for (const f2 of this.features) {
							if (f2.isOfType(feature.Type.DRBonus) && f2.locations.length !== 0) {
								for (const loc of f2.locations) {
									allLocations.add(loc)
								}
								if (f2.specialization === f.specialization) {
									for (const loc of f2.locations) {
										locationsMatched.add(loc)
									}
									const additionalDRBonus = new DRBonus({
										type: feature.Type.DRBonus,
										locations: f2.locations,
										specialization: f.specialization,
										amount: f.amount,
										per_level: f.per_level,
									})
									// additionalDRBonus.owner = owner
									// additionalDRBonus.subOwner = subOwner
									additionalDRBonus.featureLevel = levels
									featureSet.drBonuses.push(additionalDRBonus)
								}
							}
						}
					}
				}
				break
			}
			default:
				throw ErrorGURPS(`Unhandled feature type: "${f.type}"`)
		}
	}

	protected _fillWithNameableKeysFromFeatures(m: Map<string, string>, existing: Map<string, string>): void {
		for (const feature of this.features) {
			feature.fillWithNameableKeys(m, existing)
		}
	}
}

class FeaturesField<Options extends MappingField.Options<FeatureField>> extends MappingField<
	FeatureField,
	Options,
	FeatureField,
	FeatureField,
	Feature[],
	Feature[]
> {
	constructor(options: Options) {
		super(new FeatureField(), options)
	}

	/* -------------------------------------------- */

	override initialize(value: any, model: foundry.abstract.DataModel.Any, options?: AnyObject): Array<Feature> {
		super.initialize(value, model)
		const features = Object.values(super.initialize(value, model, options) as unknown as Record<string, Feature>)
		// actions.sort((a, b) => a.sort - b.sort)
		return features
		// return new ActionCollection(model, actions)
	}
}

class FeatureField<
	const Options extends fields.DataField.Options<Feature> = fields.DataField.DefaultOptions,
> extends fields.DataField<Options, Feature, Feature, AnyObject> {
	/* -------------------------------------------- */

	static override recursive = true

	/* -------------------------------------------- */

	protected override _cast(value: Feature): Feature {
		console.log(value)
		return value
	}

	/* -------------------------------------------- */

	protected override _cleanType(value: Feature, options?: fields.DataField.CleanOptions): Feature {
		const cls = this.getModel(value)
		// TODO: verify this works, otherwise pass through value itself
		if (cls) return cls.cleanData({ ...value }, { ...options }) as Feature
		return value
	}

	/* -------------------------------------------- */

	getModel(value: Feature | AnyObject): FeatureClass | null {
		if (Object.hasOwn(value, "type") && Object.keys(FeatureTypes).includes((value as any).type)) {
			return FeatureTypes[(value as any).type as feature.Type] as FeatureClass
		}
		return null
	}

	/* -------------------------------------------- */

	override initialize(value: AnyObject, model: ItemDataModel, options?: AnyObject): Feature {
		const cls = this.getModel(value)
		if (cls) return new cls(value as object, { parent: model, ...options })
		return foundry.utils.deepClone(value) as unknown as Feature
	}

	/* -------------------------------------------- */

	migrateSource(_sourceData: object, fieldData: any) {
		const cls = this.getModel(fieldData)
		if (cls) cls.migrateDataSafe(fieldData)
	}
}

const featureHolderSchema = {
	features: new FeaturesField({ required: true, nullable: false }),
}

type FeatureHolderSchema = typeof featureHolderSchema

export { FeatureHolderTemplate, type FeatureHolderSchema }
