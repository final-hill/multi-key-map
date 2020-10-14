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

    test('null key', () => {
        const m = new MultiKeyMap<[],number>();

        expect(m.get()).toBeUndefined();

        expect(m.has()).toBe(false);

        expect(m.size).toBe(0);

        expect(() => m.set(1)).not.toThrow();

        expect(m.has()).toBe(true);

        expect(m.get()).toBe(1);

        expect(m.size).toBe(1);

        expect(m.delete()).toBe(true);

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
    });
});