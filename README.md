# Object Auger

[![Build Status](https://travis-ci.com/hutsoninc/object-auger.svg?branch=master)](https://travis-ci.com/hutsoninc/object-auger) [![Current npm package version](https://img.shields.io/npm/v/object-auger.svg)](https://www.npmjs.com/package/object-auger)

Safely get or set values in nested objects and arrays.

## Installation

`npm install --save object-auger`

## Usage

See the [tests](test/test.js) for more examples. Passing

```js
const auger = require('object-auger');

let haystack = {};

haystack = auger.set(haystack, ['a', 'b', 'c', 0], 'needle');
// => { a: { b: { c: ['needle'] } } }

auger.has(haystack, ['a', 'b', 'c']);
// => true

auger.get(haystack, ['a', 'b', 'c', 0]);
// => 'needle'

auger.get(haystack, ['a', 'b', 'c', 1], 'no needle here');
// => 'no needle here'
```

### auger.has(object, path)

Safely check if a value exists in an object. Returns a boolean.

#### object

Type: `object` or `array`

Object to look for a value in.

#### path

Type: `array`

Path to the value.

### auger.get(object, path, defaultValue)

Safely retrieve a value from an object. Returns the retrieved value or the defaultValue if the it cannot be found.

#### object

Type: `object` or `array`

Object to retrieve a value from.

#### path

Type: `array`

Path to the value.

#### default

Type: `any`<br />
Default: `undefined`

Default value. (Optional)

### auger.set(object, path, value)

Safely set a value in an object. Returns the new object.

#### object

Type: `object` or `array`

Object to set a value in.

#### path

Type: `array`

Path to where the value will be set.

#### value

Type: `any`

Value to set at the path.

## Why?

There are tons of other libraries that have similar functionality (notably [dot-prop](https://www.npmjs.com/package/dot-prop) and [lodash](https://www.npmjs.com/package/lodash)). While these packages are great, they can cause confusion when working with arrays in a nested object.

Trying to set an object with a number as the key in `lodash` will result in an array:

```js
const _ = require('lodash');

_.set({}, ['a', '0'], 'b');
// => { a: [ 'b' ] }
// Expected => { a: { '0': 'b' } }

_.set({}, ['a', 0], 'b');
// => { a: [ 'b' ] }
// Expected => { a: [ 'b' ] }
```

Using the same dot path syntax with `lodash` and `dot-prop` will result in different outcomes:

```js
const _ = require('lodash');
const dotProp = require('dot-prop');

_.set({}, 'a.0', 'b');
// => { a: [ 'b' ] }

dotProp.set({}, 'a.0', 'b');
// => { a: { '0': 'b' } }
```

With the dot path syntax, it's hard to tell if you're working with an array index number or an object property key. Dot path also makes it difficult to dynamically build up the path.

With `object-auger`, you can set the value and know exactly what the outcome will be:

```js
const auger = require('object-auger');

auger.set({}, ['a', '0'], 'b');
// => { a: { '0': 'b' } }

auger.set({}, ['a', 0], 'b');
// => { a: [ 'b' ] }
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
