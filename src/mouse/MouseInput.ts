import { fromEvent, Subject, Subscription } from "rxjs"

export class MouseInput {
    /**
     * the singleton instance
     */
    static instance: MouseInput = null

    constructor() {
        // check if an instance already exists
        if (MouseInput != null)
            return MouseInput.instance

        // if it doesn't, save this one
        MouseInput.instance = this
    }
}