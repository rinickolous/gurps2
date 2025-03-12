# TO DO

- Refactor ContainerTemplate, rethink the way allModifiers is gathered. We likely don't actually need this present in ContainerTemplate itself.
  More likely, we just need allModifiers present for Traits and Equipment and leave it at that. Otherwise, we're dealing with allModifiers returning
  something conceptually different in ContainerTemplate than in Trait and Equipment.
- Make sure actions (attacks, mostly) actually work.
- Restart work on applications so we have something that actually works.
- implement traverse function, or some other way to get all modifiers/children from a container.
