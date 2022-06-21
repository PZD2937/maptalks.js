export function now() {
    return Date.now();
}

/**
 * @classdesc
 * Utilities methods used internally. It is static and should not be initiated.
 * @class
 * @static
 * @category core
 * @name Util
 */

/**
 * Merges the properties of sources into destination object.
 * @param  {Object} dest   - object to extend
 * @param  {...Object} src - sources
 * @return {Object}
 * @memberOf Util
 */
export function extend(dest) { // (Object[, Object, ...]) ->
    for (let i = 1; i < arguments.length; i++) {
        const src = arguments[i];
        for (const k in src) {
            dest[k] = src[k];
        }
    }
    return dest;
}

/**
 * Whether the object is null or undefined.
 * @param  {Object}  obj - object
 * @return {Boolean}
 * @memberOf Util
 */
export function isNil(obj) {
    return obj == null;
}

/**
 * Whether val is a number and not a NaN.
 * @param  {Object}  val - val
 * @return {Boolean}
 * @memberOf Util
 */
export function isNumber(val) {
    return (typeof val === 'number') && !isNaN(val);
}

/**
 * Whether a number is an integer
 * @param  {Number}  n
 * @return {Boolean}
 * @memberOf Util
 */
export function isInteger(n) {
    return (n | 0) === n;
}

/**
 * Whether the obj is a javascript object.
 * @param  {Object}  obj  - object
 * @return {Boolean}
 * @memberOf Util
 */
export function isObject(obj) {
    return typeof obj === 'object' && !!obj;
}

/**
 * Check whether the object is a string
 * @param {Object} obj
 * @return {Boolean}
 * @memberOf Util
 */
export function isString(obj) {
    if (isNil(obj)) {
        return false;
    }
    return typeof obj === 'string' || (obj.constructor !== null && obj.constructor === String);
}

/**
 * Check whether the object is a function
 * @param {Object} obj
 * @return {Boolean}
 * @memberOf Util
 */
export function isFunction(obj) {
    if (isNil(obj)) {
        return false;
    }
    return typeof obj === 'function' || (obj.constructor !== null && obj.constructor === Function);
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * Check whether the object owns the property.
 * @param  {Object}  obj - object
 * @param  {String}  key - property
 * @return {Boolean}
 * @memberOf Util
 */
export function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
}

/**
 * Join an array, standard or a typed one.
 * @param  {Object[]} arr       array to join
 * @param  {String} seperator  seperator
 * @return {String}           result string
 * @private
 * @memberOf Util
 */
export function join(arr, seperator) {
    if (arr.join) {
        return arr.join(seperator || ',');
    } else {
        return Array.prototype.join.call(arr, seperator || ',');
    }
}

/**
 * Determine if an object has any properties.
 * @param object The object to check.
 * @returns {boolean} The object is empty
 */
export function isEmpty(object) {
    let property;
    for (property in object) {
        return false;
    }
    return !property;
}

const pi = Math.PI / 180;

export function toRadian(d) {
    return d * pi;
}

export function toDegree(r) {
    return r / pi;
}

export function keepDecimals(number, fractionDigits = 2, zeroPadding = false) {
    if (zeroPadding) return Number(number).toFixed(fractionDigits);
    return Number(Number(number).toFixed(fractionDigits));
}


export function addUnit(options) {
    const { fractionDigits, unit } = options;
    let { length, area } = options;
    if (length) {
        if (unit === 'SI') {
            length = length < 1000 ? (keepDecimals(length, fractionDigits) + '米') : (keepDecimals(length / 1000, fractionDigits) + '千米');
        } else {
            length *= 3.2808399;
            length = length < 5280 ? (keepDecimals(length, fractionDigits) + '英尺') : (keepDecimals(length / 5280, fractionDigits) + '英里');
        }
        return length;
    } else if (area) {
        if (unit === 'SI') {
            area = area < 1E6 ? (keepDecimals(area, fractionDigits) + '平方米') : (keepDecimals(area / 1E6, fractionDigits) + '平方千米');
        } else if (unit === 'MU') {
            area = keepDecimals(area * 0.0015, fractionDigits) + '亩';
        } else if (unit === 'HA') {
            area = keepDecimals(area * 0.0001, fractionDigits) + '公顷';
        } else {
            area *= 10.7639104;
            area = area < 27878400 ? (keepDecimals(area, fractionDigits) + '平方英尺') : (keepDecimals(area / 27878400, fractionDigits) + '平方英里');
        }
        return area;
    }
    return 0;
}
