"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const amount_1 = require("./amount");
const utils_1 = require("./utils");
const common_1 = require("../../common");
function parseEscrowCreation(tx) {
    assert(tx.TransactionType === 'EscrowCreate');
    return (0, common_1.removeUndefined)({
        amount: (0, amount_1.default)(tx.Amount).value,
        destination: tx.Destination,
        memos: (0, utils_1.parseMemos)(tx),
        condition: tx.Condition,
        allowCancelAfter: (0, utils_1.parseTimestamp)(tx.CancelAfter),
        allowExecuteAfter: (0, utils_1.parseTimestamp)(tx.FinishAfter),
        sourceTag: tx.SourceTag,
        destinationTag: tx.DestinationTag
    });
}
exports.default = parseEscrowCreation;
//# sourceMappingURL=escrow-creation.js.map