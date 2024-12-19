# Notes

- Need to rethink ReplaceableStringCriteriaSchema's inclusion of a ReplaceableStringField. Ideally, would be able to just add a "replaceable" characteristic to an "extended" StringCriteria, then provide options "toggleable", "enabled", "replaceable" to it through options
- wrt the above, do the same for "ExtendedBooleanField" and "ExtendedNumberField"
- wrt both of the above, then go on to eliminate separate criteria fields for these and just handle things through options
