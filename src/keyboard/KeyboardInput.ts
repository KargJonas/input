import { fromEvent, Subject, Subscription } from "rxjs"
import * as keycode from "keycode"

export class KeyboardInput {
    /**
     * boolean showing the state of the event
     */
    value = false

    /**
     * array with all the pressed keys
     */
    private pressed: Array<string> = []

    /**
     * the keys to listen for events to
     */
    keys: Array<string>

    /**
     * an observable of the state o the event
     */
    valueChanges = new Subject<boolean>()

    /**
     * keeps track of the subscriptions for disposing
    */
    private subscription: Array<Subscription> = []

    /**
     * use for keyboard events
     * @param params the keys to listen to
     */
    constructor(...params: string[]) {
        //save the keys
        this.keys = params

        //push a new subscription to the subscriptions array
        this.subscription.push(
            fromEvent(document, "keydown")
                .subscribe((e) => {
                    //remember the length of the pressed array
                    //used to see if anything changed
                    const last = this.pressed.length

                    //iterate over the keys it listens to
                    for (let i of this.keys)
                        //if the key is pressed and it isn't already pressed,
                        //then add it to the pressed array
                        if (i.charCodeAt(0) == keycode(e).charCodeAt(0) && this.pressed.indexOf(i) == -1)
                            this.pressed.push(i)

                    //if there was no key pressed before, and now there is
                    //then change the state of the event and emit it
                    if (last == 0 && this.pressed.length != 0) {
                        this.value = true
                        this.valueChanges.next(this.value)
                    }
                })
        )
    }

    /**
     * ends the listening
     */
    dispose() {
        this.subscription.forEach(e => e.unsubscribe())
        this.value = false
        this.valueChanges.next(false)
        this.valueChanges.complete()
    }
}