# Notes

- Need to rethink ReplaceableStringCriteriaSchema's inclusion of a ReplaceableStringField. Ideally, would be able to just add a "replaceable" characteristic to an "extended" StringCriteria, then provide options "toggleable", "enabled", "replaceable" to it through options
- wrt the above, do the same for "ExtendedBooleanField" and "ExtendedNumberField"
- wrt both of the above, then go on to eliminate separate criteria fields for these and just handle things through options
- wrt the above field discourse, look into the readonly option

Up next:

- Finish boolean select field (maybe just get rid of it and use ExtendedBooleanField? Would need "is select field" option which may be messy but also the "disabled" would otherwise have to be here too. so yeah, just add it to ExtendedBooleanField and make it a select field if select options are specified or if choices is defined)
- Finish moving across prereqs
