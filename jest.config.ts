/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  "extensionsToTreatAsEsm": [".ts"],
    "globals": {
        "ts-jest": {
            "useESM": true
        }
    },
    "preset": "ts-jest/presets/default-esm",
    testEnvironment: 'node',
    roots: ['<rootDir>/dist'],
  
};