"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const common_1 = require("../../common");
// jbcoind 'account_lines' returns a different format for
// trustlines than 'tx'
function parseAccountTrustline(trustline) {
    const specification = (0, common_1.removeUndefined)({
        limit: trustline.limit,
        currency: trustline.currency,
        counterparty: trustline.account,
        qualityIn: (0, utils_1.parseQuality)(trustline.quality_in) || undefined,
        qualityOut: (0, utils_1.parseQuality)(trustline.quality_out) || undefined,
        ripplingDisabled: trustline.no_jbcoin || undefined,
        frozen: trustline.freeze || undefined,
        authorized: trustline.authorized || undefined
    });
    // jbcoind doesn't provide the counterparty's qualities
    const counterparty = (0, common_1.removeUndefined)({
        limit: trustline.limit_peer,
        ripplingDisabled: trustline.no_jbcoin_peer || undefined,
        frozen: trustline.freeze_peer || undefined,
        authorized: trustline.peer_authorized || undefined
    });
    const state = {
        balance: trustline.balance
    };
    return { specification, counterparty, state };
}
exports.default = parseAccountTrustline;
//# sourceMappingURL=account-trustline.js.map