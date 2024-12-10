export function ErrorGURPS(message: string): Error {
	return Error(`GURPS Game Aid | ${message}`)
}
