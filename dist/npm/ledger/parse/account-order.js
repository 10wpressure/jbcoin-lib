"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAccountOrder = void 0;
const bignumber_js_1 = require("bignumber.js");
const amount_1 = require("./amount");
const utils_1 = require("./utils");
const common_1 = require("../../common");
const flags_1 = require("./flags");
// TODO: remove this function once jbcoind provides quality directly
function computeQuality(takerGets, takerPays) {
    const quotient = new bignumber_js_1.default(takerPays.value).dividedBy(takerGets.value);
    return quotient.toDigits(16, bignumber_js_1.default.ROUND_HALF_UP).toString();
}
// jbcoind 'account_offers' returns a different format for orders than 'tx'
// the flags are also different
function parseAccountOrder(address, order) {
    const direction = (order.flags & flags_1.orderFlags.Sell) === 0 ? 'buy' : 'sell';
    const takerGetsAmount = (0, amount_1.default)(order.taker_gets);
    const takerPaysAmount = (0, amount_1.default)(order.taker_pays);
    const quantity = (direction === 'buy') ? takerPaysAmount : takerGetsAmount;
    const totalPrice = (direction === 'buy') ? takerGetsAmount : takerPaysAmount;
    // note: immediateOrCancel and fillOrKill orders cannot enter the order book
    // so we can omit those flags here
    const specification = (0, common_1.removeUndefined)({
        direction: direction,
        quantity: quantity,
        totalPrice: totalPrice,
        passive: ((order.flags & flags_1.orderFlags.Passive) !== 0) || undefined,
        // jbcoind currently does not provide "expiration" in account_offers
        expirationTime: (0, utils_1.parseTimestamp)(order.expiration)
    });
    const makerExchangeRate = order.quality ?
        (0, utils_1.adjustQualityForJBC)(order.quality.toString(), takerGetsAmount.currency, takerPaysAmount.currency) :
        computeQuality(takerGetsAmount, takerPaysAmount);
    const properties = {
        maker: address,
        sequence: order.seq,
        makerExchangeRate: makerExchangeRate
    };
    return { specification, properties };
}
exports.parseAccountOrder = parseAccountOrder;
//# sourceMappingURL=account-order.js.map