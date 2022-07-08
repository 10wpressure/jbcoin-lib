"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatLedgerClose = exports.getLedgerVersion = exports.isConnected = exports.disconnect = exports.connect = void 0;
const common = require("../common");
function isConnected() {
    return this.connection.isConnected();
}
exports.isConnected = isConnected;
function getLedgerVersion() {
    return this.connection.getLedgerVersion();
}
exports.getLedgerVersion = getLedgerVersion;
function connect() {
    return this.connection.connect();
}
exports.connect = connect;
function disconnect() {
    return this.connection.disconnect();
}
exports.disconnect = disconnect;
function formatLedgerClose(ledgerClose) {
    return {
        baseFeeJBC: common.dropsToJbc(ledgerClose.fee_base),
        ledgerHash: ledgerClose.ledger_hash,
        ledgerVersion: ledgerClose.ledger_index,
        ledgerTimestamp: common.jbcoinTimeToISO8601(ledgerClose.ledger_time),
        reserveBaseJBC: common.dropsToJbc(ledgerClose.reserve_base),
        reserveIncrementJBC: common.dropsToJbc(ledgerClose.reserve_inc),
        transactionCount: ledgerClose.txn_count,
        validatedLedgerVersions: ledgerClose.validated_ledgers
    };
}
exports.formatLedgerClose = formatLedgerClose;
//# sourceMappingURL=server.js.map