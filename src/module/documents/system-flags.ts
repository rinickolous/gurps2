class DocumentSystemFlags<
	Schema extends DocumentSystemFlagsSchema = DocumentSystemFlagsSchema,
	Parent extends foundry.abstract.Document.Any = foundry.abstract.Document.Any,
> extends foundry.abstract.DataModel<Schema, Parent> {}

type DocumentSystemFlagsSchema = {}

export { DocumentSystemFlags, type DocumentSystemFlagsSchema }
