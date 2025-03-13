# TO DO

- Re-do container function, try to see how flags actually work in this system so we can use those on the Item document instead of resorting to system data (I think this is desirable). One caveat is that compendium items may not have flags, so we'll need to account for it (by just not using flags).
- Refactor ContainerTemplate, rethink the way allModifiers is gathered. We likely don't actually need this present in ContainerTemplate itself.
  More likely, we just need allModifiers present for Traits and Equipment and leave it at that. Otherwise, we're dealing with allModifiers returning
  something conceptually different in ContainerTemplate than in Trait and Equipment.
- Make sure actions (attacks, mostly) actually work.
- Restart work on applications so we have something that actually works.
