/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import MultiKeyMap from './index';

describe('Testing MultiKeyMap', () => {
    test('Constructing empty', () => {
        expect(() => new MultiKeyMap()).not.toThrow();

        const m = new MultiKeyMap();
        expect(m.delete()).toBe(false);
    });

    test('Constructing with entries', () => {
        expect(() => new MultiKeyMap<[string], number>([
            ['a',1],
            ['b',2]
        ])).not.toThrow();

        const m = new MultiKeyMap<[string], number>([
            ['a',1],
            ['b',2]
        ]);

        expect(m.size).toBe(2);
        expect(m.get('a')).toBe(1);
    });

    test('Constructing with multiple key entries', () => {
        let m!: MultiKeyMap<
            [string]|[string,string]|[string,string,string],number
        >;
        expect(() => {
            m = new MultiKeyMap<
                [string]|[string,string]|[string,string,string],number
            >([
                ['I', 1],
                ['I', 'I', 2],
                ['I', 'I','I', 3],
                ['I', 'V', 4],
                ['V', 5]
            ]);
        }).not.toThrow();

        expect(m.size).toBe(5);

        expect(m.has('I')).toBe(true);
        expect(m.has('I','V')).toBe(true);
        expect(m.has('V','I')).toBe(false);

        expect(m.get('I')).toBe(1);
        expect(m.get('I','V')).toBe(4);
    });

    test('undefined key', () => {
        const m = new MultiKeyMap<[undefined],number>();

        expect(m.get(undefined)).toBeUndefined();

        expect(m.has(undefined)).toBe(false);

        expect(m.size).toBe(0);

        expect(() => m.set(undefined,1)).not.toThrow();

        expect(m.has(undefined)).toBe(true);

        expect(m.get(undefined)).toBe(1);

        expect(m.size).toBe(1);

        expect(m.delete(undefined)).toBe(true);

        expect(m.size).toBe(0);
    });

    test('Single key',() => {
        const m = new MultiKeyMap<[string], number>();

        expect(() => m.set('a',1)).not.toThrow();

        expect(m.has('a')).toBe(true);
        expect(m.has('b')).toBe(false);

        expect(m.size).toBe(1);

        expect(() => m.set('b',2)).not.toThrow();

        expect(m.size).toBe(2);

        expect(m.get('a')).toBe(1);
        expect(m.get('b')).toBe(2);

        expect(m.delete('c')).toBe(false);
        expect(m.delete('b')).toBe(true);

        expect(m.size).toBe(1);
        expect(m.get('a')).toBe(1);

        expect(() => m.clear()).not.toThrow();

        expect(m.size).toBe(0);
    });

    test('Multi-Key', () => {
        const m = new MultiKeyMap<
            [string]|[string,string]|[string,string,string],number
        >();

        m.set('I',1);
        m.set('I','I',2);
        m.set('I','I','I',3);
        m.set('I','V',4);
        m.set('V',5);

        expect(m.size).toBe(5);

        expect(m.get('I')).toBe(1);
        expect(m.get('I','I','I')).toBe(3);

        expect(m.delete('X')).toBe(false);
        expect(m.size).toBe(5);

        expect(m.delete('I','I')).toBe(true);
        expect(m.size).toBe(4);

        expect(m.get('I','I')).toBe(undefined);
    });

    test('string representation', () => {
        expect(new MultiKeyMap().toString()).toBe('');

        expect(new MultiKeyMap([
            ['a',1],
            ['b',2],
            ['c',3]
        ]).toString()).toBe('[a]:1;[b]:2;[c]:3');

        expect(new MultiKeyMap<[...string[]],number>([
            ['I',1],
            ['I','I',2],
            ['I','I','I',3],
            ['I','V',4]
        ]).toString()).toBe('[I]:1;[I,I]:2;[I,I,I]:3;[I,V]:4');
    });

    test('forEach', () => {
        const m = new MultiKeyMap([
            ['a',1],
            ['b',2],
            ['c',3]
        ]),
        items: number[] = [];

        expect(() => {
            m.forEach(value => {
                items.push(value);
            });
        }).not.toThrow();

        expect(items.join()).toBe('1,2,3');

        const n = new MultiKeyMap<[],number>();
        n.set(1);
        items.length = 0;
        expect(() => {
            n.forEach(function(this: number[], value){ this.push(value); }, items);
        }).not.toThrow();
        expect(items.join()).toBe('1');
    });

    test('iterate directly', () => {
        const m = new MultiKeyMap<[string],number>([
            ['a', 1],
            ['b', 2],
            ['c', 3]
        ]);
        expect([...m].join()).toBe('a,1,b,2,c,3');
    });
    test('iterate entries', () => {
        const m = new MultiKeyMap<[string],number>([
            ['a', 1],
            ['b', 2],
            ['c', 3]
        ]),
        entries: [[string],number][] = [];

        expect(() => {
            for(const e of m.entries()) {
                entries.push(e);
            }
        }).not.toThrow();

        expect(entries.join()).toBe('a,1,b,2,c,3');
    });

    test('iterate keys', () => {
        const m = new MultiKeyMap([
            ['a', 1],
            ['b', 2],
            ['c', 3]
        ]),
        keys: string[][] = [];

        expect(() => {
            for(const key of m.keys()) {
                keys.push(key);
            }
        }).not.toThrow();

        expect(keys.join()).toBe('a,b,c');

        const n = new MultiKeyMap([
            ['0','0',0],
            ['0','1',0],
            ['1','0',0],
            ['1','1',1]
        ]),
        k2: string[][] = [];

        expect(() => {
            for(const key of n.keys()) {
                k2.push(key);
            }
        }).not.toThrow();

        expect(k2.join()).toBe('0,0,0,1,1,0,1,1');
    });

    test('iterate values', () => {
        const m = new MultiKeyMap([
            ['a', 1],
            ['b', 2],
            ['c', 3]
        ]),
        values: number[] = [];

        expect(() => {
            for(const value of m.values()) {
                values.push(value);
            }
        }).not.toThrow();

        expect(values.join()).toBe('1,2,3');
    });
});