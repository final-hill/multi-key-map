# MultiKeyMap

[![Build](https://github.com/final-hill/multi-key-map/workflows/Build/badge.svg?branch=main)](https://github.com/final-hill/multi-key-map/actions?query=workflow%3ABuild%2FRelease)
[![npm version](https://badge.fury.io/js/%40final-hill%2Fmulti-key-map.svg)](https://www.npmjs.com/package/@final-hill/multi-key-map)
[![Downloads](https://img.shields.io/npm/dm/@final-hill/multi-key-map.svg)](https://www.npmjs.com/package/@final-hill/multi-key-map)

## Table of Contents

- [Introduction](#introduction)
- [Library Installation](#library-installation)
- [Usage](#usage)

## Introduction

This library is a map implementation that supports multiple keys.
Also known as a [Trie](https://en.wikipedia.org/wiki/Trie)

Note that the license for this library is [AGPL-3.0-only](https://www.gnu.org/licenses/agpl-3.0.en.html).
You should [know what that means](https://choosealicense.com/licenses/agpl-3.0/) before
using this library. If you would like an exception to this license per section 7
[contact the author](mailto:tno@thenewobjective.com).

## Library Installation

As a dependency run the command:

`npm install @final-hill/multi-key-map`

You can also use a specific [version](https://www.npmjs.com/package/@final-hill/multi-key-map):

`npm install @final-hill/multi-key-map@1.0.0`

For use in a webpage:

`<script src="https://unpkg.com/@final-hill/multi-key-map"></script>`

With a specific [version](https://www.npmjs.com/package/@final-hill/multi-key-map):

`<script src="https://unpkg.com/@final-hill/multi-key-map@1.0.0></script>`

## Usage

After installation the library can be imported as such:

```typescript
import MultiKeyMap from '@final-hill/multi-key-map';
```

The interface is similar to the standard [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), but extended to support multiple keys:

```typescript
interface MultiKeyMap<KS extends unknown[], V> {
    *[Symbol.iterator](): IterableIterator<[KS, V]>
    constructor(entries?: readonly (readonly [...KS, V])[] | null)
    clear(): void
    delete(...keys: KS): boolean
    *entries(): IterableIterator<[KS, V]>
    forEach(callbackfn: (value: V, keys: KS, multiKeyMap: MultiKeyMap<KS, V>) => void, thisArg?: any): void
    get(...keys: KS): V | undefined
    has(...keys: KS): boolean
    *keys(): IterableIterator<KS>
    set(...keysValue: [...KS, V]): this
    get size(): number
    toString(): string
    *values(): IterableIterator<V>
}
```

For examples view `src/index.test.ts`
