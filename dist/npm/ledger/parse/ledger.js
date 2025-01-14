"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseLedger = void 0;
const _ = require("lodash");
const common_1 = require("../../common");
const transaction_1 = require("./transaction");
function parseTransactionWrapper(ledgerVersion, tx) {
    // renames metaData to meta and adds ledger_index
    const transaction = _.assign({}, _.omit(tx, 'metaData'), {
        meta: tx.metaData,
        ledger_index: ledgerVersion
    });
    const result = transaction_1.default(transaction, true);
    if (!result.outcome.ledgerVersion) {
        result.outcome.ledgerVersion = ledgerVersion;
    }
    return result;
}
function parseTransactions(transactions, ledgerVersion) {
    if (_.isEmpty(transactions)) {
        return {};
    }
    if (_.isString(transactions[0])) {
        return { transactionHashes: transactions };
    }
    return {
        transactions: _.map(transactions, _.partial(parseTransactionWrapper, ledgerVersion))
    };
}
function parseState(state) {
    if (_.isEmpty(state)) {
        return {};
    }
    if (_.isString(state[0])) {
        return { stateHashes: state };
    }
    return { rawState: JSON.stringify(state) };
}
function parseLedger(ledger) {
    const ledgerVersion = parseInt(ledger.ledger_index || ledger.seqNum, 10);
    return common_1.removeUndefined(Object.assign({
        stateHash: ledger.account_hash,
        closeTime: common_1.jbcoinTimeToISO8601(ledger.close_time),
        closeTimeResolution: ledger.close_time_resolution,
        closeFlags: ledger.close_flags,
        ledgerHash: ledger.hash || ledger.ledger_hash,
        ledgerVersion: ledgerVersion,
        parentLedgerHash: ledger.parent_hash,
        parentCloseTime: common_1.jbcoinTimeToISO8601(ledger.parent_close_time),
        totalDrops: ledger.total_coins || ledger.totalCoins,
        transactionHash: ledger.transaction_hash
    }, parseTransactions(ledger.transactions, ledgerVersion), parseState(ledger.accountState)));
}
exports.parseLedger = parseLedger;
//# sourceMappingURL=ledger.js.map