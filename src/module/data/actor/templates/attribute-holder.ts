import { AttributeDefinition, AttributeGURPS } from "@data/stat/index.ts"
import { ActorDataModel } from "../base.ts"
import { StatsField } from "@data/fields/stats-field.ts"
import { threshold } from "@util"

class AttributeHolderTemplate extends ActorDataModel<AttributeHolderSchema> {

	static defineSchema(): AttributeHolderSchema {
		return attributeHolderSchema
	}

	resolveAttributeDef(id: string): AttributeDefinition | null {
		if (this.attributes.has(id)) return this.attributes.get(id)!.definition
		// console.error(`No Attribute definition found for id "${id}"`)
		return null
	}

	resolveAttribute(id: string): AttributeGURPS | null {
		if (this.attributes.has(id)) return this.attributes.get(id)!
		// console.error(`No Attribute definition found for id "${id}"`)
		return null
	}

	resolveAttributeName(id: string): string {
		const def = this.resolveAttributeDef(id)
		if (def !== null) {
			return def.name
		}
		return ""
	}

	resolveAttributeCurrent(id: string): number {
		if (this.attributes.has(id)) return this.attributes.get(id)!.current
		// console.error(`No Attribute found for id "${id}"`)
		return Number.MIN_SAFE_INTEGER
	}

	temporaryST(initialST: number): number {
		const divisor = 2 * Math.min(this.countThresholdOpMet(threshold.Op.HalveST), 2)
		let ST = initialST
		if (divisor > 0) ST = Math.ceil(initialST / divisor)
		if (ST < 1 && initialST > 0) return 1
		return ST
	}

	countThresholdOpMet(op: threshold.Op): number {
		let total = 0
		for (const attribute of this.attributes.values()) {
			const t = attribute.currentThreshold
			if (t !== null && t.ops.includes(op)) total += 1
		}
		return total
	}
}

const attributeHolderSchema = {
	attributes: new StatsField(AttributeGURPS, { required: true, nullable: false })
}

type AttributeHolderSchema = typeof attributeHolderSchema

export { AttributeHolderTemplate, type AttributeHolderSchema }
