/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

const noEntry = Symbol('No Entry')

class MultiKeyMap<K extends unknown[], V> {
    #implementation = new Map()
    #size = 0

    constructor(entries?: readonly (readonly [...K, V])[] | null) {
        entries?.forEach(entry => {
            const keys = entry.slice(0,-1) as K,
                  value = entry.slice(-1)[0] as V
            this.set(keys,value)
        })
    }

    clear(): void {
        this.#implementation.clear()
    }

    delete(keys: K){
        if(this.has(keys))
            this.#size--

        // TODO: find position
        // replace with noEntry
    }

    forEach(callbackfn: (value: V, keys: K, multiKeyMap: MultiKeyMap<K, V>) => void, thisArg?: any): void {
        // TODO
    };

    get(keys: K): V | undefined {
        // TODO
    }

    has(keys: K): boolean {
        // TODO
    }

    set(keys: K, value: V): this {
        if(keys.length == 0)
            return this

        if(!this.has(keys))
            this.#size++

        if (keys.length == 1) {
            this.#implementation.set(keys[0],value)
        } else if(keys.length > 1) {
            const newMap: Map<any, any> = (keys.slice(0, -1) as K)
                .reduce((newMap: Map<any,any>, key) => {
                    if(newMap.has(key) === true) {
                        return newMap.get(key);
                    } else {
                        const newMap = new Map();
                        newMap.set(key, newMap);

                        return newMap;
                    }
                }, this.#implementation)
            newMap.set(keys[keys.length - 1], value);
        }

        return this
    }

    get size(): number {
        return this.#size
    }
}
