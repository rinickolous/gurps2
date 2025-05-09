import { DeepPartial } from "fvtt-types/utils"
import fields = foundry.data.fields
import { ItemDataModel } from "./item/base.ts"
import { ErrorGURPS, htmlClosest, htmlQuery, htmlQueryAll, i18n, SYSTEM_NAME } from "@util"

type PseudoDocumentConfig = {
	dataModels?: Record<string, typeof PseudoDocument>
}

type PseudoDocumentMetaData = {
	name: string
	type?: string
	img: string
	title: string
	sheetClass: typeof foundry.applications.api.ApplicationV2
}

abstract class PseudoDocument<
	Schema extends PseudoDocumentSchema = PseudoDocumentSchema,
	Parent extends ItemDataModel<foundry.data.fields.DataSchema> = ItemDataModel<foundry.data.fields.DataSchema>,
> extends foundry.abstract.DataModel<Schema, Parent> {
	static metadata: PseudoDocumentMetaData

	// constructor(data?: DeepPartial<SourceFromSchema<TSchema>>, options?: DataModelConstructionOptions<TParent>) {
	// 	if (options?.parent instanceof ItemGURPS2) options.parent = options.parent.system as any
	// 	super(data, options)
	// }

	/* -------------------------------------------- */

	static override defineSchema(): PseudoDocumentSchema {
		const fields = foundry.data.fields

		return {
			_id: new fields.StringField({
				required: true,
				nullable: false,
				initial: () => foundry.utils.randomID(),
			}),
			type: new fields.StringField({
				required: true,
				nullable: false,
				blank: false,
				readonly: false,
				initial: () => this.metadata.type!,
			}),
			name: new fields.StringField({ required: true, nullable: false, initial: undefined }),
			img: new fields.FilePathField({
				required: true,
				nullable: false,
				initial: () => this.metadata.img,
				categories: ["IMAGE"],
			}),
			sort: new fields.IntegerSortField(),
		}
	}

	/* -------------------------------------------- */

	/**
	 * Existing sheets of a specific type for a specific document.
	 */
	static _sheets: Map<string, foundry.applications.api.ApplicationV2> = new Map()

	/* -------------------------------------------- */
	/*  Model Configuration                         */
	/* -------------------------------------------- */

	get metadata(): PseudoDocumentMetaData {
		return (this.constructor as typeof PseudoDocument).metadata
	}

	/* -------------------------------------------- */

	/**
	 * Configuration object that defines types.
	 */
	static get documentConfig(): PseudoDocumentConfig {
		return {}
		// if (!(this.documentName in CONFIG.GURPS)) return {}
		// return (CONFIG.GURPS as any)[this.documentName]
	}

	get documentConfig(): PseudoDocumentConfig {
		return (this.constructor as typeof PseudoDocument).documentConfig
	}

	/* -------------------------------------------- */

	/**
	 * The canonical name of this PseudoDocument type, for example "Activity".
	 */
	static get documentName(): string {
		return this.metadata.name
	}

	get documentName(): string {
		return (this.constructor as typeof PseudoDocument).documentName
	}

	/* -------------------------------------------- */
	/*  Instance Properties                         */
	/* -------------------------------------------- */

	/**
	 * Unique identifier for this PseudoDocument within its item.
	 */
	get id(): string {
		return this._id as string
	}

	/* -------------------------------------------- */

	/**
	 * Unique ID for this PseudoDocument on an actor.
	 */
	get relativeID(): string {
		return `${this.item.id}.${this.id}`
	}

	/* -------------------------------------------- */

	/**
	 * Globally unique identifier for this PseudoDocument.
	 */
	get uuid(): string {
		return `${this.item.uuid}.${this.documentName}.${this.id}`
	}

	/* -------------------------------------------- */

	/**
	 * Item to which this PseudoDocument belongs.
	 */
	get item(): Item.Implementation {
		return this.parent.parent
	}

	/* -------------------------------------------- */

	/**
	 * Actor to which this PseudoDocument's item belongs, if the item is embedded.
	 */
	get actor(): Actor.Implementation | null {
		return this.item.parent ?? null
	}

	/* -------------------------------------------- */

	/**
	 * Lazily obtain a ApplicationV2 instance used to configure this PseudoDocument, or null if no sheet is available.
	 */
	get sheet(): foundry.applications.api.ApplicationV2 | null {
		const cls = (this.constructor as typeof PseudoDocument).metadata.sheetClass
		if (!cls) return null
		if (!(this.constructor as typeof PseudoDocument)._sheets.has(this.uuid)) {
			;(this.constructor as typeof PseudoDocument)._sheets.set(
				this.uuid,
				new cls({ document: this as PseudoDocument }),
			)
		}
		return (this.constructor as typeof PseudoDocument)._sheets.get(this.uuid) ?? null
	}

	/* -------------------------------------------- */
	/*  Editing Methods                             */
	/* -------------------------------------------- */

	/**
	 * Update this PseudoDocument.
	 */
	async update(updates: DeepPartial<this["_source"]>, options: object = {}): Promise<this> {
		const functionName = `update${this.documentName}`
		if (functionName in this.item.system) {
			const result = await (this.item.system as any)[functionName](this.id, updates, options)
			return result
		}
		throw ErrorGURPS(`Containing Item has no function "${functionName}"`)
	}

	/* -------------------------------------------- */

	/**
	 * Update this PseudoDocument's data on the item without performing a database commit.
	 * @param  updates    Updates to apply to this PseudoDocument.
	 * @returns   This PseudoDocument after updates have been applied.
	 */
	updateSource(
		changes?: fields.SchemaField.UpdateData<Schema>,
		options?: { dryRun?: boolean; fallback?: boolean; recursive?: boolean },
	): fields.SchemaField.UpdateData<Schema> {
		super.updateSource(changes, options)
		//@ts-expect-error idk types???
		return this.toObject()
	}

	/* -------------------------------------------- */

	/**
	 * Delete this PseudoDocument, removing it from the database.
	 * @param {object} [options={}]        Additional context which customizes the deletion workflow.
	 * @returns {Promise<PseudoDocument>}  The deleted PseudoDocument instance.
	 */
	async delete(options: object = {}): Promise<PseudoDocument> {
		const functionName = `delete${this.documentName}`
		if (functionName in this.item.system) {
			return await (this.item.system as any)[functionName](this.id, options)
		}
		throw ErrorGURPS(`Containing Item has no function "${functionName}"`)
	}

	/* -------------------------------------------- */

	/**
	 * Present a Dialog form to confirm deletion of this PseudoDocument.
	 * @param options Positioning and sizing options for the resulting dialog.
	 * @returns A Promise which resolves to the deleted PseudoDocument.
	 */
	async deleteDialog(options: object = {}): Promise<PseudoDocument | null> {
		const type = i18n.localize(this.metadata.title)

		return Dialog.confirm({
			title: `${i18n.format("DOCUMENT.Delete", { type })}: ${this.name}`,
			content: `<h4>${i18n.localize("AreYouSure")}</h4><p>${i18n.format("SIDEBAR.DeleteWarning", {
				type,
			})}</p>`,
			yes: this.delete.bind(this),
			options: options,
		})
	}

	/* -------------------------------------------- */

	/**
	 * Serialize salient information for this PseudoDocument when dragging it.
	 */
	toDragData(): object {
		const dragData: Record<string, unknown> = { type: this.documentName, data: this.toObject() }
		if (this.id) dragData.uuid = this.uuid
		return dragData
	}

	/* -------------------------------------------- */

	static async createDialog<TDocument extends PseudoDocument>(
		data: Record<string, unknown> = {},
		{
			parent,
			types,
		}: {
			parent?: TDocument["parent"]
			types?: string[]
		} & Partial<FormApplication.Options> = {},
	): Promise<TDocument | null> {
		types ??= Object.keys(this.documentConfig)
		if (types.length === 0 || !parent) return null

		const label = i18n.localize(`DOCUMENT.GURPS.${this.documentName}`)
		const title = i18n.format("DOCUMENT.Create", { type: label })
		let type = `${data.type}`

		if (!types.includes(type)) type = types[0]
		const content = await renderTemplate(`systems/${SYSTEM_NAME}/templates/apps/document-create.hbs`, {
			name: "",
			type,
			types: types.reduce((arr: object[], type) => {
				const label = this.documentConfig?.dataModels?.[type]?.metadata.title ?? ""
				arr.push({
					type,
					label: i18n.has(label) ? i18n.localize(label) : type,
					icon: this.documentConfig?.dataModels?.[type]?.metadata?.img,
				})
				return arr
			}, []),
		})

		return await Dialog.prompt({
			title,
			content,
			render: $html => {
				const html = $html[0]
				const app = htmlClosest(html, ".app")
				const folder = app?.querySelector("select")
				if (folder) {
					app?.querySelector(".dialog-buttons")?.insertAdjacentElement("afterbegin", folder)
				}
				htmlQueryAll(app, ".window-header .header-button").forEach(button => {
					const label = button.innerText
					const icon = button.querySelector("i")
					button.innerHTML = icon?.outerHTML ?? ""
					button.dataset.tooltip = label
					button.setAttribute("aria-label", label)
				})
				;(htmlQuery(app, ".document-name") as HTMLInputElement).select()
			},
			// @ts-expect-error idk types???
			buttons: {
				confirm: {
					label: "Confirm",
					callback: (html: HTMLElement | JQuery<HTMLElement>) => {
						if (!(html instanceof HTMLElement)) html = html[0]
						// const $html = html[0]
						const form = html.querySelector("form")
						if (!form?.checkValidity()) {
							throw ErrorGURPS(i18n.format("DOCUMENT.GURPS.Warning.SelectType", { name: label }))
						}
						const fd = new FormDataExtended(form)
						const createData = foundry.utils.mergeObject(data, fd.object, { inplace: false })
						if (!(createData.name as string | undefined)?.trim()) delete createData.name
						return (parent as any).system[`create${this.documentName}`](createData.type, createData)
					},
				},
			},
		})
	}

	testUserPermission(
		user: User,
		permission: keyof typeof foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS,
		{ exact }: { exact?: boolean } = {},
	): boolean {
		return this.item.testUserPermission(user, permission, { exact })
	}

	/* -------------------------------------------- */
	/*  Socket Event Handlers                       */
	/* -------------------------------------------- */

	/**
	 * Perform preliminary operations before an Activity is created.
	 * @param {object} _data     The initial data object provided to the document creation request.
	 * @returns {boolean|void}  A return value of false indicates the creation operation should be cancelled.
	 */
	preCreate(_data: object): boolean | void {} // NOTE: not protected because it actually has to be accessed from its parent item

	/* -------------------------------------------- */

	/** Prepare data related to this DataModel itself, before any derived data is computed. */
	prepareBaseData(): void {}

	/* -------------------------------------------- */

	/**
	 * Apply transformations of derivations to the values of the source data object.
	 * Compute data fields whose values are not stored to the database.
	 */
	prepareDerivedData(): void {}
}

// interface PseudoDocument {
// 	constructor: typeof PseudoDocument
// }

const pseudoDocumentSchema = {
	_id: new fields.StringField({
		required: true,
		nullable: false,
		initial: () => foundry.utils.randomID(),
	}),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		readonly: false,
	}),
	name: new fields.StringField({ required: true, nullable: false, initial: undefined }),
	img: new fields.FilePathField({
		required: true,
		nullable: false,
		categories: ["IMAGE"],
	}),
	sort: new fields.IntegerSortField(),
}

type PseudoDocumentSchema = typeof pseudoDocumentSchema

export { PseudoDocument, type PseudoDocumentMetaData, type PseudoDocumentSchema }
