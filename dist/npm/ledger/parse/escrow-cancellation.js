"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const utils_1 = require("./utils");
const common_1 = require("../../common");
function parseEscrowCancellation(tx) {
    assert(tx.TransactionType === 'EscrowCancel');
    return (0, common_1.removeUndefined)({
        memos: (0, utils_1.parseMemos)(tx),
        owner: tx.Owner,
        escrowSequence: tx.OfferSequence
    });
}
exports.default = parseEscrowCancellation;
//# sourceMappingURL=escrow-cancellation.js.map