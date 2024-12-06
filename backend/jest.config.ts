/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
import type { Config } from 'jest'
import { defaults } from 'jest-config'

const config: Config = {
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
}

export default config
