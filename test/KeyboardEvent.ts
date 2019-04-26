import { KeyboardInput } from "../src/keyboard/KeyboardInput"
import { expect } from "chai"
import { JSDOM } from "jsdom"
import * as keycode from "keycode"

const { window } = (new JSDOM(`<body></body>`))
const { document } = window.window

// @ts-ignore
global.document = document;

/**
 * Issues: It seems like JSDOM is creating some wierd KeyboardEvent, which does not
 * work with keycode.
 */

/**
 * This function dispatches a KeyboardEvent.
 * @param key The name of the key eg: "Space" or "l"
 * @param eventType Type of event eg: "keyup"
 */
function triggerKeyboardEvent(eventType: string, key: string): void {
    // The event, which will be dispatched
    const event: KeyboardEvent = document.createEvent("KeyboardEvent")

    // @ts-ignore
    const keyCode: string = keycode.codes[key];

    // Deprecated but OK for testing, I guess..
    event.initKeyboardEvent(
        eventType, true, true, window, keyCode, 0, "", true, "en")

    document.dispatchEvent(event)

    // The return value indicates wether if a handler was attached to the event
    // return !document.dispatchEvent(event)
}

/**
 * @param keys List of keys, which shall be pressed at the same time.
 */
function multiKeyPress(keys: string[]) {
    keys.map((key) => triggerKeyboardEvent("keydown", key));
    // All keys pressed
    keys.map((key) => triggerKeyboardEvent("keyup", key));
}

describe("Test KeyboardInput", () => {
    it("should be able to be created with no arguments", () => {
        new KeyboardInput().dispose()
    })

    // generate a random key not clever to have random parameters
    // => unpredictable testing outcome
    const letters = "qwertyuiopasdfghjklzxcvbnm1234567890"
    const keyToPress = letters[Math.floor(Math.random() * letters.length)]

    it("should be able to be created with some arguments", () => {
        new KeyboardInput(keyToPress).dispose()
    })

    it("should be able to update it's pressed keys", () => {
        const keyInput = new KeyboardInput(keyToPress)

        // document.addEventListener("keydown", console.log)
        triggerKeyboardEvent("keydown", keyToPress)

        keyInput.dispose()
    })
})