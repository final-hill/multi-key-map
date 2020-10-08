/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

module.exports = {
    "reporters": [
      "default",
      ["jest-junit", { "outputDirectory": "./coverage" }]
    ],
    "testEnvironment": "node",
    "transform": { 
      '^.+\\.ts$': 'ts-jest'
    }
}