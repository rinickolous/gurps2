import { GID } from "./enums/index.ts"
import { i18n } from "./i18n.ts"
import { CharacterSettings } from "@data/actor/fields/character-settings.ts"

function getAttributeChoices(
	actor: Actor.Implementation | null,
	current: string,
	localizationKey = "",
	options = { blank: false, ten: false, size: false, dodge: false, parry: false, block: false, skill: false },
): { choices: Record<string, string>; current: string } {
	const list = CharacterSettings.for(actor).attributes.filter(e => !e.isSeparator)
	const choices = <Record<string, string>>{}
	if (options.blank) choices[""] = ""
	if (options.ten) choices["10"] = i18n.format(localizationKey, { value: "10" })
	let addedDodge = false
	for (const def of list) {
		if (def.id === GID.Dodge) {
			if (!options.dodge) continue
			addedDodge = true
		}
		choices[def.id] = i18n.format(localizationKey, { value: def.name })
	}

	if (options.size)
		choices[GID.SizeModifier] = i18n.format(localizationKey, {
			value: i18n.localize("GURPS.Attribute.SizeModifier"),
		})
	if (options.dodge && !addedDodge)
		choices[GID.Dodge] = i18n.format(localizationKey, { value: i18n.localize("GURPS.Attribute.Dodge") })
	if (options.parry)
		choices[GID.Parry] = i18n.format(localizationKey, { value: i18n.localize("GURPS.Attribute.Parry") })
	if (options.block)
		choices[GID.Block] = i18n.format(localizationKey, { value: i18n.localize("GURPS.Attribute.Block") })
	if (options.skill)
		choices[GID.Skill] = i18n.format(localizationKey, { value: i18n.localize("GURPS.Attribute.Skill") })

	if (Object.keys(choices).includes(current)) return { choices, current }
	choices[current] = i18n.format("GURPS.Attribute.Unknown", { value: current })
	return { choices, current }
}

export { getAttributeChoices }
