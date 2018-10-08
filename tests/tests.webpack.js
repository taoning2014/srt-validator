/**
 * This file builds a special context for testing.
 * Spec files can require files from 'src' directly, which is not possible in the built docs.
 * This allows for easy unit tests.
 */
const testsContext = require.context('.', true, /\.spec\.js$/);
testsContext.keys().forEach(testsContext);
