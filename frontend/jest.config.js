module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect', '<rootDir>/src/setupTests.js', '<rootDir>/.env'],
    moduleDirectories: ['node_modules', '<rootDir>/src'],
    moduleNameMapper: {
        "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
        "\\.(css|scss|less)$": "<rootDir>/__mocks__/fileMock.js"
    },
    transform: {
        "^.+\\.svg$": "<rootDir>/svgTransform.js",
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    transformIgnorePatterns: [
        "node_modules/(?!node-fetch|data-uri-to-buffer|fetch-blob|formdata-polyfill/)"
    ]
};