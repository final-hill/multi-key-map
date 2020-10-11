/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

const noEntry = Symbol('noEntry')

class MultiKeyMap<KS extends unknown[], V> {
    #value: V | typeof noEntry = noEntry
    #children = new Map<KS[0], MultiKeyMap<KS,V>>()

    constructor(entries?: readonly (readonly [...KS, V])[] | null) {
        entries?.forEach(entry => {
            const keys = entry.slice(0,-1) as KS,
                  value = entry.slice(-1)[0] as V;
            this.set(keys,value);
        });
    }

    clear(): void {
        this.#value = noEntry
        this.#children.clear()
    }

    delete(keys: KS): boolean {
        if(keys.length == 0) {
            if(this.#value === noEntry) {
                return false
            } else {
                this.#value = noEntry

                return true
            }
        } else if(keys.length == 1) {
            const k = keys[0]

            return this.#children.delete(k)
        } else {
            const [k,ks] = [keys[0], keys.slice(1) as KS]

            if(this.#children.has(k)) {
                const child = this.#children.get(k)!

                return child.delete(ks)
            } else {
                return false
            }
        }
    }

    forEach(callbackfn: (value: V, keys: KS, multiKeyMap: MultiKeyMap<KS, V>) => void, thisArg?: any): void {

        // TODO
    }

    get(keys: KS): V | undefined {
        if(keys.length == 0) {
            return this.#value === noEntry ? undefined : this.#value
        } else {
            const [k,ks] = [keys[0], keys.slice(1) as KS]
            if(this.#children.has(k)) {
                const child = this.#children.get(k)!
                return child.get(ks)
            } else {
                return undefined
            }
        }
    }

    has(keys: KS): boolean {
        if(keys.length == 0) {
            return this.#value !== noEntry;
        } else {
            const [k,ks] = [keys[0], keys.slice(1) as KS]

            return this.#children.has(k) ?
                this.#children.get(k)!.has(ks) : false
        }
    }

    set(keys: KS, value: V): this {
        if(keys.length == 0) {
            this.#value = value
        } else {
            const [k,ks] = [keys[0], keys.slice(1) as KS]
            if(this.#children.has(k)) {
                const child = this.#children.get(k)!
                child.set(ks,value)
            } else {
                const child = new MultiKeyMap<KS,V>()
                child.set(ks,value)
                this.#children.set(k,child)
            }
        }
        return this
    }

    get size(): number {
        let s = 0
        this.forEach(() => s++)

        return s
    }
}
