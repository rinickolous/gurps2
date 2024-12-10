import { registerSystemSettings } from "@module/settings/index.ts"
import { registerFonts, registerHandlebarsHelpers } from "@scripts"
import { SYSTEM_NAME } from "@util"

const LEGAL =
	"GURPS is a trademark of Steve Jackson Games, and its rules and art are copyrighted by Steve Jackson Games.\nAll rights are reserved by Steve Jackson Games.\nThis game aid is the original creation of Mikolaj Tomczynski and is released for free distribution, and not for resale, under the permissions granted by\nhttp://www.sjgames.com/general/online_policy.html"

/* -------------------------------------------- */

const BANNER = `
      .:~!!~:.        ...::  .:..:.   :..::::::.       .:..:::::..        :~7??!^.
    ?#@@&##&@@#J.     5@@&!  :&@@&.  .B@@@&##&@@@#7    ^&@@&#&&&@@&Y   :G@@@&&&@@@#J.
  ~&@@Y.     J@@7    ^@@P     G@@Y    7@@&     ^&@@5    B@@?    ^#@@# .@@@J     :@@@!
 ^@@@^              :@@B      G@@5    7@@#      J@@B    B@@?     ~@@@.:@@@#7^.   ^!
 B@@B       :^::^   &@@:      G@@5    7@@&~~~~!P@@#.    B@@?    ^&@@5  7&@@@@@@&BY~.
 G@@#       :&@@B  ^@@&       G@@5    7@@@#B&@@@5.      B@@J.~5&@@B^     .^?5B&@@@@@5
 :@@@7       G@@Y  :@@@:      G@@P    7@@&   P@@&:      B@@@&#P?^               .B@@@^
  ^&@@P.     G@@Y   Y@@&~     G@@5    7@@#    J@@@!     B@@J          P@@@.      5@@@:
    7#@@&P?!~&@@G    !&@@@#GPP@@@#    5@@@.    !@@@P.  .&@@Y          .5@@@B5JYG@@@&~
      .^?5GBBBGG5.     .~?JYY5YJJJ^  .JJJJ~     :JJY7  ~JJJJ.           .~YB#&&BP7:
                                                                                       `

/* -------------------------------------------- */

export const Init = {
	listen: (): void => {
		console.log(`${SYSTEM_NAME} | Initializing ${SYSTEM_NAME}`)
		console.log(`%c${BANNER}`, "color:limegreen")
		console.log(`%c${LEGAL}`, "color:yellow")

		const src = `systems/${SYSTEM_NAME}/assets/gurps4e.svg`
		document.getElementById("logo")?.setAttribute("src", src)

		registerFonts()
		registerHandlebarsHelpers()
		registerSystemSettings()
	},
}
