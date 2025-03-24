import { ExtendedNumberField, ExtendedStringField, ExtendedBooleanField, WeightField } from "@data/fields/index.ts"
import { ItemDataModel } from "../base.ts"

class EquipmentTemplate extends ItemDataModel<EquipmentTemplateSchema> {
	constructor(...args: any[]) {
		super(...args)
	}

	/* -------------------------------------------- */

	static override defineSchema(): EquipmentTemplateSchema {
		return equipmentTemplateSchema
	}
}

const equipmentTemplateSchema = {
	ratedStrength: new ExtendedNumberField({ required: true, nullable: true, default: null, toggleable: true }),
	techLevel: new ExtendedStringField({ required: true, nullable: false, toggleable: true }),
	legalityClass: new ExtendedStringField({ required: true, nullable: false, toggleable: true }),
	quantity: new ExtendedNumberField({ required: true, nullable: true, default: null, toggleable: true }),
	value: new ExtendedNumberField({ required: true, nullable: true, default: null, toggleable: true }),
	weight: new WeightField({ required: true, nullable: true, default: null, toggleable: true, allowPercent: false }),
	uses: new ExtendedNumberField({ required: true, nullable: true, default: null, toggleable: true }),
	maxUses: new ExtendedNumberField({ required: true, nullable: true, default: null, toggleable: true }),
	equipped: new ExtendedBooleanField({ required: true, nullable: false, default: true, toggleable: true }),
	ignoreWeightForSkills: new ExtendedBooleanField({
		required: true,
		nullable: false,
		default: true,
		toggleable: true,
	}),
}

type EquipmentTemplateSchema = typeof equipmentTemplateSchema

export { EquipmentTemplate, type EquipmentTemplateSchema }
