/*!
 * @license
 * Copyright (C) 2020 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

const noEntry = Symbol('noEntry');

export type Entry<KS extends unknown[],V> = [...KS, V];
export type Entries<KS extends unknown[],V> = readonly (readonly [...KS, V])[] | null;

/**
 * MultiKeyMap is a map that associated multiple keys with a single value.
 * Also called a Trie
 */
class MultiKeyMap<KS extends unknown[], V> {
    #value: V | typeof noEntry = noEntry;
    #children = new Map<KS[0], MultiKeyMap<KS,V>>();

    /**
     * Constructs a new MultiKeyMap.
     * @param {Entries<KS,V>} [entries] - The array of entries
     * @example
     * new MultiKeyMap([
     *   [key0,key1,key2,value1],
     *   [key3,key4,key5,value2],
     *    ...
     * ])
     */
    constructor(entries?: Entries<KS,V>) {
        entries?.forEach(entry => this.set(...entry));
    }

    /**
     * Returns an iterator that yields the entries of the MultiKeyMap
     * in [key0,key1,...keyn,value] format
     */
    *[Symbol.iterator](): IterableIterator<[KS, V]> {
        const es: [KS, V][] = [];

        this.forEach((value, keys) => es.push([keys,value]));

        for(const e of es) {
            yield e;
        }
    }

    /**
     * Removes all entries from the MultiKeyMap
     */
    clear(): void {
        this.#value = noEntry;
        this.#children.clear();
    }

    /**
     * Removes the entry specified by the provided keys
     *
     * @param {KS} keys - The keys identifying the entry
     * @returns {boolean} - false if the entry does not exist, true otherwise
     */
    delete(...keys: KS): boolean {
        if(keys.length == 0) {
            if(this.#value === noEntry) {
                return false;
            } else {
                this.#value = noEntry;

                return true;
            }
        } else {
            const [k,ks] = [keys[0], keys.slice(1) as KS];

            if(this.#children.has(k)) {
                const child = this.#children.get(k)!;

                return child.delete(...ks);
            } else {
                return false;
            }
        }
    }

    /**
     * Returns an iterator that yields the entries of the MultiKeyMap
     * in [key0,key1,...keyn,value] format
     */
    *entries(): IterableIterator<[KS, V]> {
        const es: [KS, V][] = [];

        this.forEach((value, keys) => es.push([keys,value]));

        for(const e of es) {
            yield e;
        }
    }

    /**
     * Calls the provided function for each entry in the MultiKeyMap
     *
     * @param {function(value: V, keys: KS, multiKeyMap: MultiKeyMap<KS, V>): void} callbackfn - The function to execute on each value
     * @param {any} [thisArg] - value for 'this' inside of the callbackfn
     */
    forEach(callbackfn: (value: V, keys: KS, multiKeyMap: MultiKeyMap<KS, V>) => void, thisArg?: any): void {
        this._forEach([] as unknown as KS, callbackfn, thisArg);
    }

    /**
     * Returns the value specified by the provided keys
     *
     * @param {KS} keys - The keys specifying the value
     * @returns {V | undefined} - The value if it exists, undefined otherwise
     */
    get(...keys: KS): V | undefined {
        if(keys.length == 0) {
            return this.#value === noEntry ? undefined : this.#value;
        } else {
            const [k,ks] = [keys[0], keys.slice(1) as KS];
            if(this.#children.has(k)) {
                const child = this.#children.get(k)!;

                return child.get(...ks);
            } else {
                return undefined;
            }
        }
    }

    /**
     * Determines if the specified keys have an entry defined in the MultiKeyMap
     *
     * @param {KS} keys - The keys to test
     * @returns {boolean} - true if the associated value exists, false otherwise
     */
    has(...keys: KS): boolean {
        if(keys.length == 0) {
            return this.#value !== noEntry;
        } else {
            const [k,ks] = [keys[0], keys.slice(1) as KS];

            return this.#children.has(k) ?
                this.#children.get(k)!.has(...ks) : false;
        }
    }

    /**
     * Returns an iterator that yields the keys of the MultiKeyMap
     * in [key0,key1,...keyn] format
     */
    *keys(): IterableIterator<KS> {
        const ks: KS[] = [];

        this.forEach((_,keys) => ks.push(keys));

        for(const k of ks) {
            yield k;
        }
    }

    /**
     * Adds a new entry to the MultiKeyMap with the specified keys and value
     *
     * @param {Entry<KS,V>} keysValue - Entry format: [key0,key1,...,keyn,value]
     * @returns {this} - The MultiKeyMap
     */
    set(...keysValue: Entry<KS,V>): this {
        const [keys, value] = (
            keysValue.length <= 1 ? [[],keysValue[0]] :
            [keysValue.slice(0,-1),keysValue[keysValue.length - 1]]
        ) as unknown as [KS,V];

        if(keys.length == 0) {
            this.#value = value;
        } else {
            const [k,ks] = [keys[0], keys.slice(1) as KS];
            if(this.#children.has(k)) {
                const child = this.#children.get(k)!;
                child.set(...[...ks,value]);
            } else {
                const child = new MultiKeyMap<KS,V>();
                child.set(...[...ks,value]);
                this.#children.set(k,child);
            }
        }

        return this;
    }

    /**
     * Returns the number of items in the MultiKeyMap
     */
    get size(): number {
        let s = 0;
        this.forEach(() => s++);

        return s;
    }

    /**
     * Returns a string representation of the MultiKeyMap
     * @returns {string} - The string representation
     */
    toString(): string {
        return [...this].map(entry => {
            const [keys, value] = (
                entry.length <= 1 ? [[],entry[0]] :
                [entry.slice(0,-1),entry[entry.length - 1]]
            ) as unknown as [KS,V];

            return `[${keys.join()}]:${value}`;
        }).join(';');
    }

    /**
     * Returns an iterator that yields the values of the MultiKeyMap
     */
    *values(): IterableIterator<V> {
        const values: V[] = [];
        this.forEach(value => values.push(value));
        for(const value of values) {
            yield value;
        }
    }

    protected _forEach(keys: KS, callbackfn: (value: V, keys: KS, multiKeyMap: MultiKeyMap<KS, V>) => void, thisArg?: any): void {
        if(this.#value !== noEntry) {
            callbackfn.call(thisArg ?? this,this.#value,keys,this);
        }

        this.#children.forEach((childMap, key) => {
            childMap._forEach([...keys,key] as KS, callbackfn, thisArg);
        });
    }
}

export default MultiKeyMap;