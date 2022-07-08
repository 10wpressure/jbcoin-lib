"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const utils_1 = require("./utils");
const common_1 = require("../../common");
function parseEscrowExecution(tx) {
    assert(tx.TransactionType === 'EscrowFinish');
    return (0, common_1.removeUndefined)({
        memos: (0, utils_1.parseMemos)(tx),
        owner: tx.Owner,
        escrowSequence: tx.OfferSequence,
        condition: tx.Condition,
        fulfillment: tx.Fulfillment
    });
}
exports.default = parseEscrowExecution;
//# sourceMappingURL=escrow-execution.js.map