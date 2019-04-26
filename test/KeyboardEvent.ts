import { KeyboardInput } from "../src/keyboard/KeyboardInput"
import { expect } from "chai"
import { JSDOM } from "jsdom"

const { window } = (new JSDOM(`<body></body>`));
const { document } = window.window;

document.addEventListener("keydown", console.log);

// function createKeyboardEvent(key: string): any[] {
//     return ["keydown", true, true, window, key, key.charCodeAt(0), "", true, ""]
// }

function triggerKeyDown(key: string) {
    const event = document.createEvent("KeyboardEvent")

    // Deprecated but OK for testing, I guess..
    event.initKeyboardEvent("keydown", true, true, window, key, key.charCodeAt(0), "", true, "")

    const canceled = !document.dispatchEvent(event)

    if (canceled) {
        // Event handled
        console.log("event was handled")
    } else {
        console.log("event was ignored")
        // Ignored
    }
}

triggerKeyDown("s");

// set the global document object
function setDocument(newDocument: object) {
    //@ts-ignore
    global.document = newDocument
}

describe("Test KeyboardInput", () => {
    // set empty document with an event handler
    const subscriptions: { [ev: string]: ((val: any) => void)[] } = {}

    setDocument({
        addListener: (ev: string, cb: (val: any) => void) => {
            if (subscriptions[ev] == undefined)
                subscriptions[ev] = []
            subscriptions[ev].push(cb)
        },
        removeListener: (ev: string, cb: (val: any) => void) => {
            subscriptions[ev].splice(subscriptions[ev].indexOf(cb), 1)
        }
    })

    function emit(ev: string, val: any) {
        if (subscriptions[ev] != undefined)
            subscriptions[ev].forEach(sub => sub(val))
    }

    it("should be able to be created with no arguments", () => {
        new KeyboardInput().dispose()
    })

    // generate a random key
    const letters = "qwertyuiopasdfghjklzxcvbnm1234567890"
    const keyToPress = letters[Math.floor(Math.random() * letters.length)]
    it("should be able to be created with some arguments", () => {
        new KeyboardInput(keyToPress).dispose()
    })
})