import { i18n } from "@util/i18n.ts"

export namespace stdmg {
	export enum Option {
		None = "none",
		Thrust = "thr",
		LiftingThrust = "lift_thr",
		TelekineticThrust = "tk_thr",
		Swing = "sw",
		LiftingSwing = "lift_sw",
		TelekineticSwing = "tk_sw",
	}

	export namespace Option {
		export function toString(O: Option): string {
			return i18n.localize(`GURPS.Enum.stdmg.${O}`)
		}

		export function toStringLeveled(O: Option): string {
			return i18n.format("GURPS.Enum.stdmg.Leveled", { value: Option.toString(O) })
		}
	}

	export const Options: Option[] = [
		Option.None,
		Option.Thrust,
		Option.LiftingThrust,
		Option.TelekineticThrust,
		Option.Swing,
		Option.LiftingSwing,
		Option.TelekineticSwing,
	]

	export const OptionsChoices: Readonly<Record<Option, string>> = Object.freeze(
		Object.fromEntries(Options.map(O => [O, Option.toString(O)])) as Record<Option, string>,
	)
}
