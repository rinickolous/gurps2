import { Nameable } from "@util"
import { ItemDataModel } from "../base.ts"
import { ReplacementsField } from "../fields/replacements-field.ts"

class ReplacementHolderTemplate extends ItemDataModel<ReplacementHolderSchema> {
	static override defineSchema(): ReplacementHolderSchema {
		return {
			replacements: new ReplacementsField({ required: true, nullable: false }),
		}
	}

	/* -------------------------------------------- */

	override prepareBaseData(): void {
		super.prepareBaseData()
		this.prepareNameableKeys()
	}

	/* -------------------------------------------- */

	/** This function is public so that it can be called from other items,
	 * i.e. when weapon data updates should trigger
	 * nameable key updates in their containers
	 */
	prepareNameableKeys(): void {
		const replacements = new Map<string, string>()
		this.fillWithNameableKeys(replacements, this.replacements)
		for (const key of this.replacements.keys()) {
			if (!replacements.has(key)) replacements.delete(key)
		}
		this.replacements = new Map(replacements.entries())
	}

	/* -------------------------------------------- */

	fillWithNameableKeys(m: Map<string, string | null>, existing: Map<string, string> = this.replacements): void {
		Nameable.extract(this.parent.name, m, existing)
	}
}

type ReplacementHolderSchema = {
	replacements: ReplacementsField<{ required: true; nullable: false }>
}

export { ReplacementHolderTemplate, type ReplacementHolderSchema }
