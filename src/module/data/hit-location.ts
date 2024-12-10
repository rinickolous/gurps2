import { DiceField } from "./fields/index.ts"
import fields = foundry.data.fields
import { CharacterSettings } from "./actor/fields/character-settings.ts"
import { ActorGURPS } from "@documents"
import type { DeepPartial } from "@league-of-foundry-developers/foundry-vtt-types/src/types/utils.d.mts"
import { ActorType, equalFold, GID, i18n, StringBuilder, TooltipGURPS } from "@util"

type ActorBodySchema = {
	name: fields.StringField<{ required: true; nullable: false }>
	roll: DiceField<{ required: true; nullable: false }>
	locations: fields.ArrayField<
		fields.EmbeddedDataField<typeof HitLocation>,
		fields.ArrayField.AssignmentElementType<fields.EmbeddedDataField<typeof HitLocation>>,
		// HitLocation,
		fields.ArrayField.InitializedElementType<fields.EmbeddedDataField<typeof HitLocation>>,
		{ required: true; nullable: false }
	>
	sub_tables: fields.ArrayField<
		fields.EmbeddedDataField<typeof HitLocationSubTable>,
		fields.ArrayField.AssignmentElementType<fields.EmbeddedDataField<typeof HitLocationSubTable>>,
		// HitLocationSubTable,
		fields.ArrayField.InitializedElementType<fields.EmbeddedDataField<typeof HitLocationSubTable>>,
		{ required: true; nullable: false }
	>
}

type HitLocationSchema = {
	id: fields.StringField<{ required: true; nullable: false }>
	choice_name: fields.StringField<{ required: true; nullable: false }>
	table_name: fields.StringField<{ required: true; nullable: false }>
	slots: fields.NumberField<{ required: true; nullable: false }>
	hit_penalty: fields.NumberField<{ required: true; nullable: false }>
	dr_bonus: fields.NumberField<{ required: true; nullable: false }>
	description: fields.StringField<{ required: true; nullable: false }>
	owningTableId: fields.StringField<{ required: true; nullable: true }>
	subTableId: fields.StringField<{ required: true; nullable: true }>
}

type HitLocationSubTableSchema = {
	id: fields.StringField<{ required: true; nullable: false }>
	roll: DiceField<{ required: true; nullable: false }>
}

// This is the root actor body object.
// It contains flat arrays of hit locations and sub-tables as fields,
// And contains accessors for a hierarchical list of hit locations and sub-tables
class ActorBody extends foundry.abstract.DataModel<ActorBodySchema, CharacterSettings> {
	static override defineSchema(): ActorBodySchema {
		const fields = foundry.data.fields
		return {
			name: new fields.StringField({
				required: true,
				nullable: false,
				initial: "Humanoid",
				label: "GURPS.HitLocation.Table.FIELDS.Name.Name",
			}),
			roll: new DiceField({
				required: true,
				nullable: false,
				initial: { count: 3, sides: 6, modifier: 0, multiplier: 1 },
				label: "GURPS.HitLocation.Table.FIELDS.Roll.Name",
			}),
			locations: new fields.ArrayField(new fields.EmbeddedDataField(HitLocation), {
				required: true,
				nullable: false,
				label: "GURPS.HitLocation.Table.FIELDS.Locations.Name",
			}),
			sub_tables: new fields.ArrayField(new fields.EmbeddedDataField(HitLocationSubTable), {
				required: true,
				nullable: true,
				initial: null,
			}),
		}
	}

	get actor(): ActorGURPS {
		return this.parent.actor
	}

	// Hierarchical list of hit locatios with included sub tables
	get hitLocations(): HitLocation[] {
		return this.locations.filter(e => e.owningTableId === null)
	}

	get owningLocation(): null {
		return null
	}

	get depth(): number {
		// All locations as children to the actor body will, as a result, have depth 0.
		// This is intentional.
		return -1
	}

	updateRollRanges(): void {
		let start = this.roll.minimum(false)
		if (this.hitLocations) for (const location of this.hitLocations) start = location.updateRollRange(start)
	}

	// Remove any orphaned sub_tables or locations
	static cleanData(source?: object, options?: Parameters<fields.SchemaField.Any["clean"]>[1]): object {
		function addRecursiveLocations(
			location: DeepPartial<foundry.abstract.DataModel.ConstructorDataFor<HitLocation>>,
		): void {
			locationsToKeep.push(location)

			if (location.subTableId === null) return
			for (const newLocation of locations.filter(e => e!.owningTableId === location.subTableId)) {
				addRecursiveLocations(newLocation!)
			}
		}
		// const bodySource = source as foundry.abstract.DataModel.ConstructorDataFor<ActorBody>
		const bodySource = source as foundry.abstract.DataModel.ConstructorDataFor<ActorBody>

		// const subTables = bodySource.sub_tables ?? []
		const subTables = (bodySource.sub_tables ??
			[]) as foundry.abstract.DataModel.ConstructorDataFor<HitLocationSubTable>[]
		const locations = (bodySource.locations ?? []) as foundry.abstract.DataModel.ConstructorDataFor<HitLocation>[]
		for (const location of locations) {
			if (location!.owningTableId === "") location!.owningTableId = null
			location!.owningTableId ??= null
			location!.subTableId ??= null
		}

		const locationsToKeep: foundry.abstract.DataModel.ConstructorDataFor<HitLocation>[] = []
		for (const location of locations.filter(e => e!.owningTableId === null)) {
			addRecursiveLocations(location!)
		}

		const tablesIdsToKeep = new Set<string>()
		for (const location of locationsToKeep) {
			if (location.owningTableId) tablesIdsToKeep.add(location.owningTableId)
			if (location.subTableId) tablesIdsToKeep.add(location.subTableId)
		}

		bodySource.locations = locationsToKeep
		bodySource.sub_tables = subTables.filter(e => tablesIdsToKeep.has(e!.id!))

		return super.cleanData(bodySource, options)
	}
}

class HitLocation extends foundry.abstract.DataModel<HitLocationSchema, ActorBody> {
	rollRange: string = "-"

	static override defineSchema(): HitLocationSchema {
		const fields = foundry.data.fields

		return {
			id: new fields.StringField({
				required: true,
				nullable: false,
				initial: "id",
				label: "GURPS.HitLocation.Location.FIELDS.Id.Name",
			}),
			choice_name: new fields.StringField({
				required: true,
				nullable: false,
				initial: "choice name",
				label: "GURPS.HitLocation.Location.FIELDS.ChoiceName.Name",
			}),
			table_name: new fields.StringField({
				required: true,
				nullable: false,
				initial: "table name",
				label: "GURPS.HitLocation.Location.FIELDS.TableName.Name",
			}),
			slots: new fields.NumberField({
				required: true,
				nullable: false,
				initial: 0,
				label: "GURPS.HitLocation.Location.FIELDS.Slots.Name",
			}),
			hit_penalty: new fields.NumberField({
				required: true,
				nullable: false,
				initial: 0,
				label: "GURPS.HitLocation.Location.FIELDS.HitPenalty.Name",
			}),
			dr_bonus: new fields.NumberField({
				required: true,
				nullable: false,
				initial: 0,
				label: "GURPS.HitLocation.Location.FIELDS.DrBonus.Name",
			}),
			description: new fields.StringField({
				required: true,
				nullable: false,
				initial: "",
				label: "GURPS.HitLocation.Location.FIELDS.Description.Name",
			}),
			owningTableId: new fields.StringField({ required: true, nullable: true, initial: null }),
			subTableId: new fields.StringField({ required: true, nullable: true, initial: null }),
			// sub_table: new fields.EmbeddedDataField(BodyGURPS, { required: false, nullable: true, initial: null }),
		}
	}

	get actor(): ActorGURPS {
		return this.parent.actor
	}

	get owningTable(): ActorBody | HitLocationSubTable {
		if (this.owningTableId === null) return this.parent
		return this.parent.sub_tables.find(e => e.id === this.owningTableId)!
	}

	get subTable(): HitLocationSubTable | null {
		if (!this.subTableId) return null
		return this.parent.sub_tables.find(e => e.id === this.subTableId)!
	}

	get descriptionTooltip(): string {
		return (this.description ?? "").replace(/\n/g, "<br>")
	}

	get trueIndex(): number {
		return this.parent.locations.indexOf(this)
	}

	get first(): boolean {
		if (this.owningTableId === null) return this.trueIndex === 0
		return this.owningTable.hitLocations.indexOf(this) === 0
	}

	get last(): boolean {
		return this.owningTable.hitLocations.indexOf(this) === this.owningTable.hitLocations.length - 1
	}

	get depth(): number {
		return this.owningTable.depth + 1
	}

	updateRollRange(start: number): number {
		switch (this.slots) {
			case 0:
				this.rollRange = "-"
				break
			case 1:
				this.rollRange = `${start}`
				break
			default:
				this.rollRange = `${start}-${start + this.slots - 1}`
		}
		if (this.subTable) this.subTable.updateRollRanges()
		return start + this.slots
	}

	get DR(): Map<string, number> {
		return this._DR()
	}

	_DR(tooltip: TooltipGURPS | null = null, drMap: Map<string, number> = new Map()): Map<string, number> {
		if (this.dr_bonus !== 0) {
			drMap.set(GID.All, this.dr_bonus)
			tooltip?.push(
				i18n.format(i18n.localize("gurps.tooltip.dr_bonus"), {
					item: this.choice_name,
					bonus: this.dr_bonus.signedString(),
					type: GID.All,
				}),
				"<br>",
			)
		}
		drMap = this.actor.isOfType(ActorType.Character)
			? this.actor.system.addDRBonusesFor(this.id, tooltip, drMap)
			: new Map()
		if (this.owningTable && this.owningTable.owningLocation)
			drMap = this.owningTable.owningLocation._DR(tooltip, drMap)

		if (drMap.size !== 0) {
			const base = drMap.get(GID.All) ?? 0
			const buffer = new StringBuilder()
			for (const k of Array.from(drMap.keys()).sort()) {
				let value = drMap.get(k) ?? 0
				if (!equalFold(GID.All, k)) value += base
				buffer.push(
					i18n.format(i18n.localize("gurps.tooltip.dr_total"), {
						amount: value,
						type: k,
					}),
					"<br>",
				)
			}
			tooltip?.unshift(buffer.toString())
		}
		return drMap
	}

	get displayDR(): string {
		const drMap = this._DR()
		if (!drMap.has(GID.All)) drMap.set(GID.All, 0)
		const all = drMap.get(GID.All) ?? 0

		const keys: string[] = []
		keys.push(GID.All)
		keys.push(
			...Array.from(drMap.keys())
				.filter(e => e !== GID.All)
				.sort(),
		)
		const buffer = new StringBuilder()
		for (const k of keys) {
			let dr = drMap.get(k) ?? 0
			if (k !== GID.All) dr += all
			if (buffer.length !== 0) buffer.push("/")
			buffer.push(`${dr}`)
		}
		return buffer.toString()
	}

	// Return true if the provided ID is a valid hit location ID
	static validateId(id: string): boolean {
		return id !== GID.All
	}
}

class HitLocationSubTable extends foundry.abstract.DataModel<HitLocationSubTableSchema, ActorBody> {
	static override defineSchema(): HitLocationSubTableSchema {
		const fields = foundry.data.fields

		return {
			id: new fields.StringField({ required: true, nullable: false, initial: generateId }),
			roll: new DiceField({
				required: true,
				nullable: false,
				initial: { count: 1, sides: 6, modifier: 0, multiplier: 1 },
				label: "GURPS.HitLocation.Table.FIELDS.Roll.Name",
			}),
		}
	}

	get actor(): ActorGURPS {
		return this.parent.actor
	}

	get owningLocation(): HitLocation {
		return this.parent.locations.find(e => e.subTableId === this.id)!
	}

	get hitLocations(): HitLocation[] {
		return this.parent.locations.filter(e => e.owningTableId === this.id)
	}

	get trueIndex(): number {
		return this.parent.sub_tables.indexOf(this)
	}

	get depth(): number {
		return this.owningLocation.depth
	}

	updateRollRanges(): void {
		let start = this.roll.minimum(false)
		if (this.hitLocations) for (const location of this.hitLocations) start = location.updateRollRange(start)
	}
}

export { ActorBody, HitLocation, HitLocationSubTable }
export type { ActorBodySchema, HitLocationSchema, HitLocationSubTableSchema }
