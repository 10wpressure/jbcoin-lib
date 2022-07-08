"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePaymentChannel = void 0;
const utils_1 = require("./utils");
const common_1 = require("../../common");
function parsePaymentChannel(data) {
    return (0, common_1.removeUndefined)({
        account: data.Account,
        amount: (0, common_1.dropsToJbc)(data.Amount),
        balance: (0, common_1.dropsToJbc)(data.Balance),
        destination: data.Destination,
        publicKey: data.PublicKey,
        settleDelay: data.SettleDelay,
        expiration: (0, utils_1.parseTimestamp)(data.Expiration),
        cancelAfter: (0, utils_1.parseTimestamp)(data.CancelAfter),
        sourceTag: data.SourceTag,
        destinationTag: data.DestinationTag,
        previousAffectingTransactionID: data.PreviousTxnID,
        previousAffectingTransactionLedgerVersion: data.PreviousTxnLgrSeq
    });
}
exports.parsePaymentChannel = parsePaymentChannel;
//# sourceMappingURL=payment-channel.js.map