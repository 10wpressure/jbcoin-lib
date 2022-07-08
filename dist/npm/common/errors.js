"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerVersionError = exports.MissingLedgerHistoryError = exports.PendingLedgerVersionError = exports.NotFoundError = exports.ValidationError = exports.ResponseFormatError = exports.TimeoutError = exports.JbcoindNotInitializedError = exports.DisconnectedError = exports.NotConnectedError = exports.JbcoindError = exports.ConnectionError = exports.UnexpectedError = exports.JbcoinError = void 0;
const util_1 = require("util");
const browserHacks = require("./browser-hacks");
class JbcoinError extends Error {
    constructor(message = '', data) {
        super(message);
        this.name = browserHacks.getConstructorName(this);
        this.message = message;
        this.data = data;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
    toString() {
        let result = '[' + this.name + '(' + this.message;
        if (this.data) {
            result += ', ' + util_1.inspect(this.data);
        }
        result += ')]';
        return result;
    }
    /* console.log in node uses util.inspect on object, and util.inspect allows
    us to customize its output:
    https://nodejs.org/api/util.html#util_custom_inspect_function_on_objects */
    inspect() {
        return this.toString();
    }
}
exports.JbcoinError = JbcoinError;
class JbcoindError extends JbcoinError {
}
exports.JbcoindError = JbcoindError;
class UnexpectedError extends JbcoinError {
}
exports.UnexpectedError = UnexpectedError;
class LedgerVersionError extends JbcoinError {
}
exports.LedgerVersionError = LedgerVersionError;
class ConnectionError extends JbcoinError {
}
exports.ConnectionError = ConnectionError;
class NotConnectedError extends ConnectionError {
}
exports.NotConnectedError = NotConnectedError;
class DisconnectedError extends ConnectionError {
}
exports.DisconnectedError = DisconnectedError;
class JbcoindNotInitializedError extends ConnectionError {
}
exports.JbcoindNotInitializedError = JbcoindNotInitializedError;
class TimeoutError extends ConnectionError {
}
exports.TimeoutError = TimeoutError;
class ResponseFormatError extends ConnectionError {
}
exports.ResponseFormatError = ResponseFormatError;
class ValidationError extends JbcoinError {
}
exports.ValidationError = ValidationError;
class NotFoundError extends JbcoinError {
    constructor(message = 'Not found') {
        super(message);
    }
}
exports.NotFoundError = NotFoundError;
class MissingLedgerHistoryError extends JbcoinError {
    constructor(message) {
        super(message || 'Server is missing ledger history in the specified range');
    }
}
exports.MissingLedgerHistoryError = MissingLedgerHistoryError;
class PendingLedgerVersionError extends JbcoinError {
    constructor(message) {
        super(message || 'maxLedgerVersion is greater than server\'s most recent' +
            ' validated ledger');
    }
}
exports.PendingLedgerVersionError = PendingLedgerVersionError;
//# sourceMappingURL=errors.js.map