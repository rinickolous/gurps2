import { ItemDataModel } from "@data/item/base.ts";
import fields = foundry.data.fields
import { ActorType, createButton, createDummyElement, i18n, ItemTemplateType, prereq, TooltipGURPS } from "@util";
import { ExtendedBooleanField } from "@data/fields/extended-boolean-field.ts";
import { ActorGURPS, ItemGURPS } from "@documents";
import { ActorInstance } from "@data/actor/types.ts";

abstract class BasePrereq<
	Schema extends BasePrereqSchema = BasePrereqSchema,
	Parent extends ItemDataModel = ItemDataModel
> extends foundry.abstract.DataModel<
	Schema,
	Parent
> {
	declare static TYPE: prereq.Type

	static defineSchema(): BasePrereqSchema {
		const fields = foundry.data.fields

		return {
			id: new fields.StringField({ required: true, nullable: false, blank: false, initial: () => foundry.utils.randomID() }),
			type: new fields.StringField({
				required: true,
				nullable: false,
				blank: false,
				choices: prereq.TypesChoices,
				initial: this.TYPE,
			}),
			has: new ExtendedBooleanField({
				required: true,
				nullable: true,
				choices: {
					true: "GURPS.Item.Prereqs.FIELDS.Has.Choices.true",
					false: "GURPS.Item.Prereqs.FIELDS.Has.Choices.false",
				},
				initial: true,
			}),
		}
	}

	get actor(): ActorGURPS | null {
		return this.parent.parent.actor
	}

	get item(): ItemGURPS {
		return this.parent.parent
	}

	get index(): number {
		if (!this.parent.hasTemplate(ItemTemplateType.PrereqHolder)) return -1
		return this.parent.prereqs.findIndex(e => e.id === this.id)
	}

	get hasText(): string {
		const has = (this as unknown as { has: boolean }).has ?? true
		if (has) return i18n.localize("GURPS.Prereq.Has")
		return i18n.localize("GURPS.Prereq.DoesNotHave")
	}

	get replacements(): Map<string, string> {
		return this.item.hasTemplate(ItemTemplateType.ReplacementHolder) ? this.item.system.replacements : new Map()
	}

	get element(): Handlebars.SafeString {
		const enabled: boolean = (this.item.sheet as any).editable
		return new Handlebars.SafeString(this.toFormElement(enabled).outerHTML)
	}

	toFormElement(this: BasePrereq, enabled: boolean): HTMLElement {
		const prefix = `system.prereqs.${this.index}`

		const element = document.createElement("li")
		element.classList.add("prereq")

		element.append(createDummyElement(`${prefix}.id`, this.id))
		if (!enabled) {
			element.append(createDummyElement(`${prefix}.type`, this.type))

			if (this.has !== null) element.append(createDummyElement(`${prefix}.has`, this.has))
		}

		const rowElement = document.createElement("div")
		rowElement.classList.add("form-fields")

		rowElement.append(
			createButton({
				icon: ["fa-regular", "fa-trash"],
				label: "",
				data: {
					action: "deletePrereq",
					id: this.id,
				},
				disabled: !enabled,
			}),
		)

		rowElement.append(
			foundry.applications.fields.createSelectInput({
				name: enabled ? `${prefix}.has` : "",
				value: String(this.has),
				options: [
					{ value: "true", label: "GURPS.Item.Prereqs.FIELDS.Has.Choices.true" },
					{ value: "false", label: "GURPS.Item.Prereqs.FIELDS.Has.Choices.false" },
				],
				localize: true,
				disabled: !enabled,
			}),
		)

		const typeField = this.schema.fields.type
			; (typeField as any).choices = prereq.TypesWithoutListChoices
		rowElement.append(
			typeField.toInput({
				name: enabled ? `${prefix}.type` : "",
				value: this.type,
				dataset: {
					selector: "prereq-type",
					index: this.index.toString(),
				},
				localize: true,
				disabled: !enabled,
			}) as HTMLElement,
		)

		element.append(rowElement)

		return element
	}

	abstract satisfied(
		actor: ActorInstance<ActorType.Character>,
		exclude: unknown,
		tooltip: TooltipGURPS | null,
		...args: unknown[]
	): boolean

	abstract fillWithNameableKeys(m: Map<string, string>, existing: Map<string, string>): void

}

type BasePrereqSchema = {
	id: fields.StringField<{ required: true, nullable: false, blank: false }>
	type: fields.StringField<{
		required: true,
		nullable: false,
		blank: false,
		choices: typeof prereq.TypesChoices,
	}>
	has: ExtendedBooleanField<{
		required: true,
		nullable: true,
		choices: {
			true: "GURPS.Item.Prereqs.FIELDS.Has.Choices.true",
			false: "GURPS.Item.Prereqs.FIELDS.Has.Choices.false",
		},
		initial: true,
	}>
}


export { BasePrereq, type BasePrereqSchema }
