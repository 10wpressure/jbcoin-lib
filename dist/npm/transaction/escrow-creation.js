"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const utils = require("./utils");
const common_1 = require("../common");
const ValidationError = utils.common.errors.ValidationError;
function createEscrowCreationTransaction(account, payment) {
    const txJSON = {
        TransactionType: 'EscrowCreate',
        Account: account,
        Destination: payment.destination,
        Amount: (0, common_1.jbcToDrops)(payment.amount)
    };
    if (payment.condition !== undefined) {
        txJSON.Condition = payment.condition;
    }
    if (payment.allowCancelAfter !== undefined) {
        txJSON.CancelAfter = (0, common_1.iso8601ToJbcoinTime)(payment.allowCancelAfter);
    }
    if (payment.allowExecuteAfter !== undefined) {
        txJSON.FinishAfter = (0, common_1.iso8601ToJbcoinTime)(payment.allowExecuteAfter);
    }
    if (payment.sourceTag !== undefined) {
        txJSON.SourceTag = payment.sourceTag;
    }
    if (payment.destinationTag !== undefined) {
        txJSON.DestinationTag = payment.destinationTag;
    }
    if (payment.memos !== undefined) {
        txJSON.Memos = _.map(payment.memos, utils.convertMemo);
    }
    if (Boolean(payment.allowCancelAfter) && Boolean(payment.allowExecuteAfter) &&
        txJSON.CancelAfter <= txJSON.FinishAfter) {
        throw new ValidationError('prepareEscrowCreation: ' +
            '"allowCancelAfter" must be after "allowExecuteAfter"');
    }
    return txJSON;
}
function prepareEscrowCreation(address, escrowCreation, instructions = {}) {
    common_1.validate.prepareEscrowCreation({ address, escrowCreation, instructions });
    const txJSON = createEscrowCreationTransaction(address, escrowCreation);
    return utils.prepareTransaction(txJSON, this, instructions);
}
exports.default = prepareEscrowCreation;
//# sourceMappingURL=escrow-creation.js.map