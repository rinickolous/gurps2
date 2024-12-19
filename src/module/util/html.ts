type Maybe<T> = T | null | undefined

/* -------------------------------------------- */

type MaybeHTML = Maybe<Document | Element | EventTarget>

/* -------------------------------------------- */

interface CreateButtonOptions {
	type: "button" | "submit" | "reset"
	classes: string[]
	icon: string[]
	label: string
	data: Record<string, string>
	disabled: boolean
}

/* -------------------------------------------- */

function htmlQuery<K extends keyof HTMLElementTagNameMap>(
	parent: MaybeHTML,
	selectors: K,
): HTMLElementTagNameMap[K] | null
function htmlQuery(parent: MaybeHTML, selectors: string): HTMLElement | null
function htmlQuery<E extends HTMLElement = HTMLElement>(parent: MaybeHTML, selectors: string): E | null
function htmlQuery(parent: MaybeHTML, selectors: string): HTMLElement | null {
	if (!(parent instanceof Element || parent instanceof Document)) return null
	return parent.querySelector<HTMLElement>(selectors)
}

/* -------------------------------------------- */

function htmlQueryAll<K extends keyof HTMLElementTagNameMap>(
	parent: MaybeHTML,
	selectors: K,
): HTMLElementTagNameMap[K][]
function htmlQueryAll(parent: MaybeHTML, selectors: string): HTMLElement[]
function htmlQueryAll<E extends HTMLElement = HTMLElement>(parent: MaybeHTML, selectors: string): E[]
function htmlQueryAll(parent: MaybeHTML, selectors: string): HTMLElement[] {
	if (!(parent instanceof Element || parent instanceof Document)) return []
	return Array.from(parent.querySelectorAll<HTMLElement>(selectors))
}

/* -------------------------------------------- */

function htmlClosest<K extends keyof HTMLElementTagNameMap>(
	parent: MaybeHTML,
	selectors: K,
): HTMLElementTagNameMap[K] | null
function htmlClosest(child: MaybeHTML, selectors: string): HTMLElement | null
function htmlClosest<E extends HTMLElement = HTMLElement>(parent: MaybeHTML, selectors: string): E | null
function htmlClosest(child: MaybeHTML, selectors: string): HTMLElement | null {
	if (!(child instanceof Element)) return null
	return child.closest<HTMLElement>(selectors)
}


/* -------------------------------------------- */

function createButton(options: Partial<CreateButtonOptions>): HTMLButtonElement {
	const button = document.createElement("button")
	if (options.classes) button.classList.add(...options.classes)
	if (options.label) button.innerHTML = options.label
	if (options.type) button.type = options.type
	else button.type = "button"
	if (options.icon) {
		const icon = document.createElement("i")
		icon.classList.add(...options.icon)
		button.append(icon)
	}
	if (options.data) {
		for (const [key, value] of Object.entries(options.data)) {
			button.dataset[key] = value
		}
	}
	if (options.disabled) button.setAttribute("disabled", "")
	return button
}

/* -------------------------------------------- */

function createDummyElement(name: string, value: string | number | boolean): HTMLInputElement {
	const element = foundry.applications.fields.createTextInput({
		name,
		value: String(value),
		readonly: true,
	})
	element.style.setProperty("display", "none")
	return element
}

export { htmlQuery, htmlQueryAll, htmlClosest, createButton, createDummyElement }
