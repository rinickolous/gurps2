type Maybe<T> = T | null | undefined
type MaybeHTML = Maybe<Document | Element | EventTarget>

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

export { htmlQuery, htmlQueryAll, htmlClosest }
