"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidSecret = exports.iso8601ToJbcoinTime = exports.jbcoinTimeToISO8601 = exports.removeUndefined = exports.convertKeysFromSnakeCaseToCamelCase = exports.toJbcoindAmount = exports.jbcToDrops = exports.dropsToJbc = void 0;
const _ = require("lodash");
const bignumber_js_1 = require("bignumber.js");
const ripple_keypairs_1 = require("ripple-keypairs");
const errors_1 = require("./errors");
function isValidSecret(secret) {
    try {
        (0, ripple_keypairs_1.deriveKeypair)(secret);
        return true;
    }
    catch (err) {
        return false;
    }
}
exports.isValidSecret = isValidSecret;
function dropsToJbc(drops) {
    if (typeof drops === 'string') {
        if (!drops.match(/^-?[0-9]*\.?[0-9]*$/)) {
            throw new errors_1.ValidationError(`dropsToJbc: invalid value '${drops}',` +
                ` should be a number matching (^-?[0-9]*\.?[0-9]*$).`);
        }
        else if (drops === '.') {
            throw new errors_1.ValidationError(`dropsToJbc: invalid value '${drops}',` +
                ` should be a BigNumber or string-encoded number.`);
        }
    }
    // Converting to BigNumber and then back to string should remove any
    // decimal point followed by zeros, e.g. '1.00'.
    // Important: specify base 10 to avoid exponential notation, e.g. '1e-7'.
    drops = (new bignumber_js_1.default(drops)).toString(10);
    // drops are only whole units
    if (drops.includes('.')) {
        throw new errors_1.ValidationError(`dropsToJbc: value '${drops}' has` +
            ` too many decimal places.`);
    }
    // This should never happen; the value has already been
    // validated above. This just ensures BigNumber did not do
    // something unexpected.
    if (!drops.match(/^-?[0-9]+$/)) {
        throw new errors_1.ValidationError(`dropsToJbc: failed sanity check -` +
            ` value '${drops}',` +
            ` does not match (^-?[0-9]+$).`);
    }
    return (new bignumber_js_1.default(drops)).dividedBy(1000000.0).toString(10);
}
exports.dropsToJbc = dropsToJbc;
function jbcToDrops(jbc) {
    if (typeof jbc === 'string') {
        if (!jbc.match(/^-?[0-9]*\.?[0-9]*$/)) {
            throw new errors_1.ValidationError(`jbcToDrops: invalid value '${jbc}',` +
                ` should be a number matching (^-?[0-9]*\.?[0-9]*$).`);
        }
        else if (jbc === '.') {
            throw new errors_1.ValidationError(`jbcToDrops: invalid value '${jbc}',` +
                ` should be a BigNumber or string-encoded number.`);
        }
    }
    // Important: specify base 10 to avoid exponential notation, e.g. '1e-7'.
    jbc = (new bignumber_js_1.default(jbc)).toString(10);
    // This should never happen; the value has already been
    // validated above. This just ensures BigNumber did not do
    // something unexpected.
    if (!jbc.match(/^-?[0-9.]+$/)) {
        throw new errors_1.ValidationError(`jbcToDrops: failed sanity check -` +
            ` value '${jbc}',` +
            ` does not match (^-?[0-9.]+$).`);
    }
    const components = jbc.split('.');
    if (components.length > 2) {
        throw new errors_1.ValidationError(`jbcToDrops: failed sanity check -` +
            ` value '${jbc}' has` +
            ` too many decimal points.`);
    }
    const fraction = components[1] || '0';
    if (fraction.length > 6) {
        throw new errors_1.ValidationError(`jbcToDrops: value '${jbc}' has` +
            ` too many decimal places.`);
    }
    return (new bignumber_js_1.default(jbc)).times(1000000.0).floor().toString(10);
}
exports.jbcToDrops = jbcToDrops;
function toJbcoindAmount(amount) {
    if (amount.currency === 'JBC') {
        return jbcToDrops(amount.value);
    }
    if (amount.currency === 'drops') {
        return amount.value;
    }
    return {
        currency: amount.currency,
        issuer: amount.counterparty ? amount.counterparty :
            (amount.issuer ? amount.issuer : undefined),
        value: amount.value
    };
}
exports.toJbcoindAmount = toJbcoindAmount;
function convertKeysFromSnakeCaseToCamelCase(obj) {
    if (typeof obj === 'object') {
        let newKey;
        return _.reduce(obj, (result, value, key) => {
            newKey = key;
            // taking this out of function leads to error in PhantomJS
            const FINDSNAKE = /([a-zA-Z]_[a-zA-Z])/g;
            if (FINDSNAKE.test(key)) {
                newKey = key.replace(FINDSNAKE, r => r[0] + r[2].toUpperCase());
            }
            result[newKey] = convertKeysFromSnakeCaseToCamelCase(value);
            return result;
        }, {});
    }
    return obj;
}
exports.convertKeysFromSnakeCaseToCamelCase = convertKeysFromSnakeCaseToCamelCase;
function removeUndefined(obj) {
    return _.omitBy(obj, _.isUndefined);
}
exports.removeUndefined = removeUndefined;
/**
 * @param {Number} rpepoch (seconds since 1/1/2000 GMT)
 * @return {Number} ms since unix epoch
 *
 */
function jbcoinToUnixTimestamp(rpepoch) {
    return (rpepoch + 0x386D4380) * 1000;
}
/**
 * @param {Number|Date} timestamp (ms since unix epoch)
 * @return {Number} seconds since jbcoin epoch (1/1/2000 GMT)
 */
function unixToJbcoinTimestamp(timestamp) {
    return Math.round(timestamp / 1000) - 0x386D4380;
}
function jbcoinTimeToISO8601(jbcoinTime) {
    return new Date(jbcoinToUnixTimestamp(jbcoinTime)).toISOString();
}
exports.jbcoinTimeToISO8601 = jbcoinTimeToISO8601;
/**
 * @param {string} iso8601 international standard date format
 * @return {number} seconds since jbcoin epoch (1/1/2000 GMT)
 */
function iso8601ToJbcoinTime(iso8601) {
    return unixToJbcoinTimestamp(Date.parse(iso8601));
}
exports.iso8601ToJbcoinTime = iso8601ToJbcoinTime;
//# sourceMappingURL=utils.js.map