# Object Auger

[![Build Status](https://travis-ci.com/hutsoninc/object-auger.svg?branch=master)](https://travis-ci.com/hutsoninc/object-auger) [![Current npm package version](https://img.shields.io/npm/v/object-auger.svg)](https://www.npmjs.com/package/object-auger) 

Safely get or set values in nested objects and arrays.

## Why?

There are tons of other libraries that have similar functionality (notably [dot-prop](https://www.npmjs.com/package/dot-prop) and [lodash](https://www.npmjs.com/package/lodash)). While these packages are great, they can cause confusion when working with numbers as an object key.

```js
const _ = require('lodash');

_.set({}, ['a', '1000'], 'b');
// => { a: [ <1000 empty items>, 'b' ] }
// Expected => { a: { '1000': 'b' } }

_.set({}, ['a', 1000], 'b');
// => { a: [ <1000 empty items>, 'b' ] }
// Expected => { a: [ <1000 empty items>, 'b' ] }
```

Using a dot path syntax with `lodash` and `dot-prop`:

```js
const _ = require('lodash');
const dotProp = require('dot-prop');

_.set({}, 'a.1000', 'b');
// => { a: [ <1000 empty items>, 'b' ] }

dotProp.set({}, 'a.1000', 'b');
// => { a: { '1000': 'b' } }
```

With the dot path syntax, it's hard to tell if you're working with an array index number or an object property key. Dot path also makes it difficult to dynamically build up the path.

With `object-auger`, you can set the value and know exactly what the outcome will be.

```js
const auger = require('object-auger');

auger.set({}, ['a', '1000'], 'b');
// => { a: { '1000': 'b' } }

auger.set({}, ['a', 1000], 'b');
// => { a: [ <1000 empty items>, 'b' ] }
```

## Installation

`npm install --save object-auger`

## Usage

See the [tests](test/test.js) for more examples.

```js
const auger = require('object-auger');

const haystack = {
    a: {
        b: {
            c: [
                'needle',
            ]
        }
    }
};

auger.has(haystack, ['a', 'b', 'c']);
// => true

auger.get(haystack, ['a', 'b', 'c', 0]);
// => 'needle'

auger.set(haystack, ['a', 'b', 'c', 1], 'hay');
// => { a: { b: { c: ['needle', 'hay'] } } }
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details