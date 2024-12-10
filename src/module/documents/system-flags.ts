class DocumentSystemFlags<
	TSchema extends DocumentSystemFlagsSchema = DocumentSystemFlagsSchema,
	TDocument extends foundry.abstract.Document.Any = foundry.abstract.Document.Any,
> extends foundry.abstract.DataModel<TSchema, TDocument> {}

type DocumentSystemFlagsSchema = {}

export { DocumentSystemFlags, type DocumentSystemFlagsSchema }
