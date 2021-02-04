module.exports = {
    get: function(obj, path, fallback) {
        if (!isValidObject(obj)) {
            return fallback;
        }
        if (!Array.isArray(path)) {
            return obj;
        }
        const len = path.length;
        const last = len - 1;
        for (let i = 0; i < len; i++) {
            const partType = typeof path[i];
            if (partType === 'number' && !Array.isArray(obj)) {
                return fallback;
            } else if (partType !== 'number' && Array.isArray(obj)) {
                return fallback;
            }
            obj = obj[path[i]];
            if (i === last && obj !== undefined) {
                break;
            }
            if (isValidObject(obj)) {
                continue;
            }
            return fallback;
        }
        return obj;
    },
    has: function(obj, path) {
        if (!isValidObject(obj) || !Array.isArray(path)) {
            return false;
        }
        const len = path.length;
        if (len === 0) {
            return false;
        }
        for (let i = 0; i < len; i++) {
            if (isValidObject(obj)) {
                const partType = typeof path[i];
                if (partType === 'number' && !Array.isArray(obj)) {
                    return false;
                } else if (partType !== 'number' && Array.isArray(obj)) {
                    return false;
                }
                if (!(path[i] in obj)) {
                    return false;
                }
                obj = obj[path[i]];
            } else {
                return false;
            }
        }
        return true;
    },
    set: function(obj, path, val) {
        if (!isValidObject(obj) || !Array.isArray(path)) {
            return obj;
        }
        const len = path.length;
        const root = obj;
        for (let i = 0; i < len; i++) {
            const part = path[i];

            if (isPrototypePolluted(part)) {
                continue;
            } else if (i === len - 1) {
                obj[part] = val;
            } else {
                const nextType = typeof path[i + 1];
                if (nextType === 'number' && !Array.isArray(obj[part])) {
                    obj[part] = [];
                } else if (nextType !== 'number' && Array.isArray(obj[part])) {
                    obj[part] = {};
                } else if (!isValidObject(obj[part])) {
                    obj[part] = {};
                }
            }

            obj = obj[part];
        }
        return root;
    },
};

function isValidObject(val) {
    return (val !== null && typeof val === 'object') || Array.isArray(val);
}

function isPrototypePolluted(key) {
    return ['__proto__', 'constructor', 'prototype'].includes(key);
}