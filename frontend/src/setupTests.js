// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import fetch from 'node-fetch';

global.fetch = fetch;
global.TextDecoder = require('util').TextDecoder;
process.env.SSL_CRT_FILE = "../../backend/cert/cert.pem";
process.env.SSL_KEY_FILE = "../../backend/cert/key.pem";
process.env.REACT_APP_SERVER_URL = "http://localhost:3030";