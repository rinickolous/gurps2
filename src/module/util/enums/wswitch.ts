import { i18n } from "@util/i18n.ts"

export namespace wswitch {
	export enum Type {
		CanBlock = "can_block",
		CanParry = "can_parry",
		CloseCombat = "close_combat",
		Fencing = "fencing",
		FullAuto1 = "full_auto_1",
		FullAuto2 = "full_auto_2",
		Bipod = "bipod",
		ControlledBursts1 = "controlled_bursts_1",
		ControlledBursts2 = "controlled_bursts_2",
		Jet = "jet",
		Mounted = "mounted",
		MusclePowered = "muscle_powered",
		RangeInMiles = "range_in_miles",
		ReachChangeRequiresReady = "change_requires_ready",
		ReloadTimeIsPerShot = "reload_time_is_per_shot",
		RetractingStock = "retracting_stock",
		TwoHanded = "two_handed",
		Thrown = "thrown",
		Unbalanced = "unbalanced",
		TwoHandedUnready = "two_handed_unready",
		MusketRest = "musket_rest",
	}

	export namespace Type {
		export function toString(T: Type): string {
			return i18n.localize(`GURPS.Enum.wswitch.${T}.Name`)
		}
	}

	export const Types: Type[] = [
		Type.CanBlock,
		Type.CanParry,
		Type.CloseCombat,
		Type.Fencing,
		Type.FullAuto1,
		Type.FullAuto2,
		Type.Bipod,
		Type.ControlledBursts1,
		Type.ControlledBursts2,
		Type.Jet,
		Type.Mounted,
		Type.MusclePowered,
		Type.RangeInMiles,
		Type.ReachChangeRequiresReady,
		Type.ReloadTimeIsPerShot,
		Type.RetractingStock,
		Type.TwoHanded,
		Type.Thrown,
		Type.Unbalanced,
		Type.TwoHandedUnready,
		Type.MusketRest,
	]

	export const TypesChoices: Readonly<Record<Type, string>> = Object.freeze(
		Types.reduce((acc: Record<string, string>, c: Type) => {
			acc[c] = Type.toString(c)
			return acc
		}, {}) as Record<Type, string>,
	)
}
