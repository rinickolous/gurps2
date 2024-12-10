import { ItemDataModel } from "./base.ts"

class NoteData extends ItemDataModel<NoteSchema> {}

type NoteSchema = {}

export { NoteData, type NoteSchema }
