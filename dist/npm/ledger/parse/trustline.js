"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const utils_1 = require("./utils");
const common_1 = require("../../common");
const flags = common_1.txFlags.TrustSet;
function parseFlag(flagsValue, trueValue, falseValue) {
    if (flagsValue & trueValue) {
        return true;
    }
    if (flagsValue & falseValue) {
        return false;
    }
    return undefined;
}
function parseTrustline(tx) {
    assert(tx.TransactionType === 'TrustSet');
    return (0, common_1.removeUndefined)({
        limit: tx.LimitAmount.value,
        currency: tx.LimitAmount.currency,
        counterparty: tx.LimitAmount.issuer,
        memos: (0, utils_1.parseMemos)(tx),
        qualityIn: (0, utils_1.parseQuality)(tx.QualityIn),
        qualityOut: (0, utils_1.parseQuality)(tx.QualityOut),
        ripplingDisabled: parseFlag(tx.Flags, flags.SetNoJbcoin, flags.ClearNoJbcoin),
        frozen: parseFlag(tx.Flags, flags.SetFreeze, flags.ClearFreeze),
        authorized: parseFlag(tx.Flags, flags.SetAuth, 0)
    });
}
exports.default = parseTrustline;
//# sourceMappingURL=trustline.js.map