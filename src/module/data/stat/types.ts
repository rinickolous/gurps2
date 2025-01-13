import { AttributeDefinition, AttributeGURPS } from "./attribute/index.ts"
import { MoveType, MoveTypeDefinition } from "./move-type/index.ts"
import { ResourceTracker, ResourceTrackerDefinition } from "./resource-tracker/index.ts"

export type Stat = AttributeGURPS | ResourceTracker | MoveType
export type StatClass = typeof AttributeGURPS | typeof ResourceTracker | typeof MoveType

export type StatDefinition = AttributeDefinition | ResourceTrackerDefinition | MoveTypeDefinition
export type StatDefinitionClass = typeof AttributeDefinition | typeof ResourceTrackerDefinition | typeof MoveTypeDefinition
