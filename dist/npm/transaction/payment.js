"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const utils = require("./utils");
const validate = utils.common.validate;
const toJbcoindAmount = utils.common.toJbcoindAmount;
const paymentFlags = utils.common.txFlags.Payment;
const ValidationError = utils.common.errors.ValidationError;
const common_1 = require("../common");
function isMaxAdjustment(source) {
    return source.maxAmount !== undefined;
}
function isMinAdjustment(destination) {
    return destination.minAmount !== undefined;
}
function isJBCToJBCPayment(payment) {
    const { source, destination } = payment;
    const sourceCurrency = isMaxAdjustment(source)
        ? source.maxAmount.currency : source.amount.currency;
    const destinationCurrency = isMinAdjustment(destination)
        ? destination.minAmount.currency : destination.amount.currency;
    return (sourceCurrency === 'JBC' || sourceCurrency === 'drops') &&
        (destinationCurrency === 'JBC' || destinationCurrency === 'drops');
}
function isIOUWithoutCounterparty(amount) {
    return amount && amount.currency !== 'JBC' && amount.currency !== 'drops'
        && amount.counterparty === undefined;
}
function applyAnyCounterpartyEncoding(payment) {
    // Convert blank counterparty to sender or receiver's address
    //   (Jbcoin convention for 'any counterparty')
    // https://jbcoin.com/build/transactions/
    //    #special-issuer-values-for-sendmax-and-amount
    // https://jbcoin.com/build/jbcoin-rest/#counterparties-in-payments
    _.forEach([payment.source, payment.destination], adjustment => {
        _.forEach(['amount', 'minAmount', 'maxAmount'], key => {
            if (isIOUWithoutCounterparty(adjustment[key])) {
                adjustment[key].counterparty = adjustment.address;
            }
        });
    });
}
function createMaximalAmount(amount) {
    const maxJBCValue = '100000000000';
    const maxIOUValue = '9999999999999999e80';
    let maxValue;
    if (amount.currency === 'JBC') {
        maxValue = maxJBCValue;
    }
    else if (amount.currency === 'drops') {
        maxValue = common_1.jbcToDrops(maxJBCValue);
    }
    else {
        maxValue = maxIOUValue;
    }
    return _.assign({}, amount, { value: maxValue });
}
function createPaymentTransaction(address, paymentArgument) {
    const payment = _.cloneDeep(paymentArgument);
    applyAnyCounterpartyEncoding(payment);
    if (address !== payment.source.address) {
        throw new ValidationError('address must match payment.source.address');
    }
    if ((isMaxAdjustment(payment.source) && isMinAdjustment(payment.destination))
        ||
            (!isMaxAdjustment(payment.source) && !isMinAdjustment(payment.destination))) {
        throw new ValidationError('payment must specify either (source.maxAmount '
            + 'and destination.amount) or (source.amount and destination.minAmount)');
    }
    const destinationAmount = isMinAdjustment(payment.destination)
        ? payment.destination.minAmount : payment.destination.amount;
    const sourceAmount = isMaxAdjustment(payment.source)
        ? payment.source.maxAmount : payment.source.amount;
    // when using destination.minAmount, jbcoind still requires that we set
    // a destination amount in addition to DeliverMin. the destination amount
    // is interpreted as the maximum amount to send. we want to be sure to
    // send the whole source amount, so we set the destination amount to the
    // maximum possible amount. otherwise it's possible that the destination
    // cap could be hit before the source cap.
    const amount = (isMinAdjustment(payment.destination) && !isJBCToJBCPayment(payment))
        ? createMaximalAmount(destinationAmount) : destinationAmount;
    const txJSON = {
        TransactionType: 'Payment',
        Account: payment.source.address,
        Destination: payment.destination.address,
        Amount: toJbcoindAmount(amount),
        Flags: 0
    };
    if (payment.invoiceID !== undefined) {
        txJSON.InvoiceID = payment.invoiceID;
    }
    if (payment.source.tag !== undefined) {
        txJSON.SourceTag = payment.source.tag;
    }
    if (payment.destination.tag !== undefined) {
        txJSON.DestinationTag = payment.destination.tag;
    }
    if (payment.memos !== undefined) {
        txJSON.Memos = _.map(payment.memos, utils.convertMemo);
    }
    if (payment.noDirectJbcoin === true) {
        txJSON.Flags |= paymentFlags.NoJbcoinDirect;
    }
    if (payment.limitQuality === true) {
        txJSON.Flags |= paymentFlags.LimitQuality;
    }
    if (!isJBCToJBCPayment(payment)) {
        // Don't set SendMax for JBC->JBC payment
        // temREDUNDANT_SEND_MAX removed in:
        // https://github.com/jbcoin/jbcoind/commit/
        //  c522ffa6db2648f1d8a987843e7feabf1a0b7de8/
        if (payment.allowPartialPayment || isMinAdjustment(payment.destination)) {
            txJSON.Flags |= paymentFlags.PartialPayment;
        }
        txJSON.SendMax = toJbcoindAmount(sourceAmount);
        if (isMinAdjustment(payment.destination)) {
            txJSON.DeliverMin = toJbcoindAmount(destinationAmount);
        }
        if (payment.paths !== undefined) {
            txJSON.Paths = JSON.parse(payment.paths);
        }
    }
    else if (payment.allowPartialPayment === true) {
        throw new ValidationError('JBC to JBC payments cannot be partial payments');
    }
    return txJSON;
}
function preparePayment(address, payment, instructions = {}) {
    validate.preparePayment({ address, payment, instructions });
    const txJSON = createPaymentTransaction(address, payment);
    return utils.prepareTransaction(txJSON, this, instructions);
}
exports.default = preparePayment;
//# sourceMappingURL=payment.js.map