const auger = require('..');

const noop = function () { };

describe('auger.get', function () {

    test('should return object when no other parameters provided', function () {
        expect(auger.get({ a: 'b' })).toStrictEqual({ a: 'b' });
        expect(auger.get({ a: { b: 'c' } })).toStrictEqual({ a: { b: 'c' } });
        expect(auger.get(['a', { b: 'c' }])).toStrictEqual(['a', { b: 'c' }]);
    });

    test('should return object when empty array is provided as path', function () {
        expect(auger.get({ a: 'b' }, [])).toStrictEqual({ a: 'b' });
        expect(auger.get({ a: { b: 'c' } }, [])).toStrictEqual({ a: { b: 'c' } });
        expect(auger.get(['a', { b: 'c' }], [])).toStrictEqual(['a', { b: 'c' }]);
    });

    test('should return undefined when non-object is provided', function () {
        expect(auger.get()).toBeUndefined();
        expect(auger.get('str')).toBeUndefined();
        expect(auger.get(123)).toBeUndefined();
        expect(auger.get(undefined)).toBeUndefined();
        expect(auger.get(null)).toBeUndefined();
        expect(auger.get(noop)).toBeUndefined();
    });

    test('should return a value', function () {
        expect(auger.get({ a: 'b' }, ['a'])).toEqual('b');
        expect(auger.get({ a: 123 }, ['a'])).toEqual(123);
        expect(auger.get({ a: { b: 'c' } }, ['a', 'b'])).toEqual('c');
        expect(auger.get({ a: { b: false } }, ['a', 'b'])).toEqual(false);
        expect(auger.get({ a: { b: null } }, ['a', 'b'])).toEqual(null);
    });

    test('should return a value from an array', function () {
        expect(auger.get({ a: { b: ['c'] } }, ['a', 'b', 0])).toEqual('c');
        expect(auger.get({ a: { b: ['c', { d: 1 }] } }, ['a', 'b', 1, 'd'])).toEqual(1);
        expect(auger.get({ a: { b: [false] } }, ['a', 'b', 0])).toEqual(false);
    });

    test('should return an object', function () {
        expect(auger.get({ a: { b: { c: 'd' } } }, ['a'])).toStrictEqual({ b: { c: 'd' } });
        expect(auger.get({ a: { b: { c: 'd' } } }, ['a', 'b'])).toStrictEqual({ c: 'd' });
        expect(auger.get({ a: { b: [{ c: 'd' }] } }, ['a', 'b', 0])).toStrictEqual({ c: 'd' });
    });

    test('should return an array', function () {
        expect(auger.get({ a: ['b', 'c'] }, ['a'])).toStrictEqual(['b', 'c']);
        expect(auger.get({ a: { b: ['c', 'd'] } }, ['a', 'b'])).toStrictEqual(['c', 'd']);
        expect(auger.get({ a: { b: [['c', 'd']] } }, ['a', 'b'])).toStrictEqual([['c', 'd']]);
        expect(auger.get({ a: { b: [['c', 'd']] } }, ['a', 'b', 0])).toStrictEqual(['c', 'd']);
    });

    test('should work on a property that uses a number as the key', function () {
        expect(auger.get({ a: { "1": "b" } }, ['a', '1'])).toEqual('b');
        expect(auger.get({ a: { "1": ['c'] } }, ['a', '1'])).toStrictEqual(['c']);
        expect(auger.get({ a: { "1": ['c'] } }, ['a', '1', 0])).toEqual('c');
    });

    test('should get a property that has dots in the key', function () {
        expect(auger.get({ 'a.b': 'c' }, ['a.b'])).toEqual('c');
    });

    test('should return default fallback', function () {
        expect(auger.get(Object.create(null), ['a'])).toBeUndefined();
        expect(auger.get({}, ['a'])).toBeUndefined();
        expect(auger.get([], [1])).toBeUndefined();
        expect(auger.get({}, [1])).toBeUndefined();
        expect(auger.get([], ['a'])).toBeUndefined();
        expect(auger.get({ a: 'b' }, ['a', 'b'])).toBeUndefined();
        expect(auger.get({ a: 'b' }, ['a', 'b', 'c'])).toBeUndefined();
        expect(auger.get({a: ['c']}, ['a', '0'])).toBeUndefined();
        expect(auger.get({a: {'0': 'c'}}, ['a', 0])).toBeUndefined();
    });

    test('should return provided fallback', function () {
        expect(auger.get(Object.create(null), ['a'], 'Oh no!')).toEqual('Oh no!');
        expect(auger.get({}, ['a'], 'Oh no!')).toEqual('Oh no!');
        expect(auger.get([], [1], 'Oh no!')).toEqual('Oh no!');
        expect(auger.get({}, [1], 'Oh no!')).toEqual('Oh no!');
        expect(auger.get([], ['a'], 'Oh no!')).toEqual('Oh no!');
        expect(auger.get({ a: 'b' }, ['a', 'b'], 'Oh no!')).toEqual('Oh no!');
        expect(auger.get({ a: 'b' }, ['a', 'b', 'c'], 'Oh no!')).toEqual('Oh no!');
    });

});

describe('auger.has', function () {

    test('should return false when non-object is provided', function () {
        expect(auger.has()).toBe(false);
        expect(auger.has('str')).toBe(false);
        expect(auger.has(123)).toBe(false);
        expect(auger.has(undefined)).toBe(false);
        expect(auger.has(null)).toBe(false);
        expect(auger.has(noop)).toBe(false);
    });

    test('should return false when no other parameters provided', function () {
        expect(auger.has({ a: 'b' })).toBe(false);
        expect(auger.has({ a: { b: 'c' } })).toBe(false);
    });

    test('should return false when empty array is provided as path', function () {
        expect(auger.has({ a: 'b' }, [])).toBe(false);
        expect(auger.has({ a: { b: 'c' } }, [])).toBe(false);
        expect(auger.has(['a', { b: 'c' }], [])).toBe(false);
    });

    
    test('should return true', function () {
        expect(auger.has({ a: 'b' }, ['a'])).toBe(true);
        expect(auger.has({ a: 123 }, ['a'])).toBe(true);
        expect(auger.has({a: ['c']}, ['a', 0], 'c')).toBe(true);
        expect(auger.has({a: {'0': 'c'}}, ['a', '0'], 'c')).toBe(true);
        expect(auger.has({ a: { b: 'c' } }, ['a', 'b'])).toBe(true);
        expect(auger.has({ a: { b: false } }, ['a', 'b'])).toBe(true);
        expect(auger.has({ a: { b: null } }, ['a', 'b'])).toBe(true);
        expect(auger.has({ a: { b: ['c'] } }, ['a', 'b', 0])).toBe(true);
        expect(auger.has({ a: { b: ['c', { d: 1 }] } }, ['a', 'b', 1, 'd'])).toBe(true);
        expect(auger.has({ a: { b: [false] } }, ['a', 'b', 0])).toBe(true);
        expect(auger.has({ a: { b: { c: 'd' } } }, ['a'])).toBe(true);
        expect(auger.has({ a: { b: { c: 'd' } } }, ['a', 'b'])).toBe(true);
        expect(auger.has({ a: { b: [{ c: 'd' }] } }, ['a', 'b', 0])).toBe(true);
        expect(auger.has({ a: ['b', 'c'] }, ['a'])).toBe(true);
        expect(auger.has({ a: { b: ['c', 'd'] } }, ['a', 'b'])).toBe(true);
        expect(auger.has({ a: { b: [['c', 'd']] } }, ['a', 'b'])).toBe(true);
        expect(auger.has({ a: { b: [['c', 'd']] } }, ['a', 'b', 0])).toBe(true);
        expect(auger.has({ a: { b: [['c', 'd']] } }, ['a', 'b', 0, 1])).toBe(true);
    });

    test('should return false', function () {
        expect(auger.has(Object.create(null), ['a'])).toBe(false);
        expect(auger.has({}, ['a'])).toBe(false);
        expect(auger.has([], [1])).toBe(false);
        expect(auger.has({}, [1])).toBe(false);
        expect(auger.has([], ['a'])).toBe(false);
        expect(auger.has({ a: 'b' }, ['a', 'b'])).toBe(false);
        expect(auger.has({ a: 'b' }, ['a', 'b', 'c'])).toBe(false);
        expect(auger.has({a: ['c']}, ['a', '0'])).toBe(false);
        expect(auger.has({a: {'0': 'c'}}, ['a', 0])).toBe(false);
    });

    test('should work on a property that uses a number as the key', function () {
        expect(auger.has({ a: { "1": "b" } }, ['a', '1'])).toBe(true);
        expect(auger.has({ a: { "1": "b" } }, ['a', 1])).toBe(false);
        expect(auger.has({ a: { "1": ["b"] } }, ['a', '1', 0])).toBe(true);
        expect(auger.has({ a: { "1": ["b"] } }, ['a', '1', '0'])).toBe(false);
        expect(auger.has({ a: [["b"]] }, ['a', 0, 0])).toBe(true);
        expect(auger.has({ a: [["b"]] }, ['a', '0', 0])).toBe(false);
        expect(auger.has({ a: [["b"]] }, ['a', 0, '0'])).toBe(false);
    });

    test('should work on a property that has dots in the key', function () {
        expect(auger.has({ 'a.b': 'c' }, ['a.b'])).toBe(true);
    });

});

describe('auger.set', function () {

    test('should return given value when non-object is provided', function () {
        expect(auger.set()).toBeUndefined();
        expect(auger.set('str')).toEqual('str');
        expect(auger.set(123)).toEqual(123);
        expect(auger.set(undefined)).toBeUndefined();
        expect(auger.set(null)).toEqual(null);
        expect(auger.set(noop)).toStrictEqual(noop);
    });

    test('should return same object when no other parameters provided', function () {
        expect(auger.set({ a: 'b' })).toStrictEqual({ a: 'b' });
        expect(auger.set({ a: { b: 'c' } })).toStrictEqual({ a: { b: 'c' } });
        expect(auger.set(['a', { b: 'c' }])).toStrictEqual(['a', { b: 'c' }]);
    });

    test('should return same object when empty array is provided as path', function () {
        expect(auger.set({ a: 'b' }, [])).toStrictEqual({ a: 'b' });
        expect(auger.set({ a: { b: 'c' } }, [])).toStrictEqual({ a: { b: 'c' } });
        expect(auger.set(['a', { b: 'c' }], [])).toStrictEqual(['a', { b: 'c' }]);
    });

    test('should set value', function () {
        expect(auger.set({}, ['a'], 'c')).toStrictEqual({ a: 'c' });
        expect(auger.set({}, ['a'], noop)).toStrictEqual({ a: noop });
        expect(auger.set({ a: 'b' }, ['a'], 'c')).toStrictEqual({ a: 'c' });
        expect(auger.set({ a: { b: 'c' } }, ['a', 'b'], 1)).toStrictEqual({ a: { b: 1 } });
        expect(auger.set({ a: { b: false } }, ['a', 'b'], true)).toStrictEqual({ a: { b: true } });
        expect(auger.set({ a: { b: null } }, ['a', 'b'], 'null')).toStrictEqual({ a: { b: 'null' } });
        expect(auger.set({ a: { b: ['c'] } }, ['a', 'b', 1], 'd')).toStrictEqual({ a: { b: ['c', 'd'] } });
        expect(auger.set({ a: { b: { c: 'd' } } }, ['a'], { c: 'd' })).toStrictEqual({ a: { c: 'd' } });
        expect(auger.set({ a: { b: [{ c: 'd' }] } }, ['a', 'b', 0], 'c')).toStrictEqual({ a: { b: ['c'] } });
    });
    
    test('should set default value (undefined)', function () {
        expect(auger.set({}, ['a'])).toStrictEqual({ a: undefined });
        expect(auger.set({}, ['a', 0])).toStrictEqual({ a: [undefined] });
        expect(auger.set({ a: { b: 'c' } }, ['a', 'b'])).toStrictEqual({ a: { b: undefined } });
    });

    test('should not set magic attribute values', function () {
        expect(auger.set({}, ['__proto__', 'polluted'], true)).toStrictEqual({ polluted: true });
        expect({}.polluted).toBe(undefined);
    });
    
    test('should set as object or array depending on if the value is a string or number', function () {
        expect(auger.set({}, ['a', 0], 'c')).toStrictEqual({ a: ['c'] });
        expect(auger.set({}, ['a', '0'], 'c')).toStrictEqual({ a: { '0': 'c' } });
        expect(auger.set({a: ['b']}, ['a', '0'], 'c')).toStrictEqual({ a: { '0': 'c' } });
        expect(auger.set({a: ['b']}, ['a', 0], 'c')).toStrictEqual({ a: ['c'] });
    });

    test('should work on a property that uses a number as the key', function () {
        expect(auger.set({ a: { "1": "b" } }, ['a', '1'], 'c')).toStrictEqual({ a: { "1": "c" } });
        expect(auger.set({ a: { "1": ['c'] } }, ['a', '1', 1], 'd')).toStrictEqual({ a: { "1": ['c', 'd'] } });
    });

    test('should work on a property that has dots in the key', function () {
        expect(auger.set({ 'a.b': 'c' }, ['a.b'], 'd')).toStrictEqual({ 'a.b': 'd' });
    });

});