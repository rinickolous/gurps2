import { i18n } from "@util/i18n.ts"

export namespace difficulty {
	export enum Level {
		Easy = "e",
		Average = "a",
		Hard = "h",
		VeryHard = "vh",
		Wildcard = "w",
	}

	export namespace Level {
		export function toString(L: Level): string {
			return i18n.localize(`GURPS.Enum.difficulty.${L}`)
		}

		export function baseRelativeLevel(L: Level): number {
			switch (L) {
				case Level.Easy:
					return 0
				case Level.Average:
					return -1
				case Level.Hard:
					return -2
				case Level.VeryHard:
				case Level.Wildcard:
					return -3
			}
		}
	}

	export const Levels: Level[] = [Level.Easy, Level.Average, Level.Hard, Level.VeryHard, Level.Wildcard]

	export const TechniqueLevels = [Level.Average, Level.Hard] as const

	export function LevelsChoices(localizationKey: string, exclude: Level[] = []): Record<Level, string> {
		return Object.fromEntries(
			Levels.filter(k => !exclude.includes(k)).map(k => [
				k,
				i18n.format(localizationKey, { value: i18n.localize(Level.toString(k)) }),
			]),
		) as Record<Level, string>
	}
}
