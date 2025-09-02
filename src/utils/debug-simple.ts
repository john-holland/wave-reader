import { jsxToText } from './jsx-to-text.js';

const simpleJSX = '<button className="btn" onClick={handleClick}>Click me</button>';
const result = jsxToText(simpleJSX);

console.log('Input:', simpleJSX);
console.log('Output:', result);
console.log('Expected: Click me');
console.log('Match:', result === 'Click me');
