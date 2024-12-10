import { ActorDataModel } from "./base.ts"

class LegacyCharacterData extends ActorDataModel<LegacyCharacterSchema> {}

type LegacyCharacterSchema = {}

export { LegacyCharacterData, type LegacyCharacterSchema }
