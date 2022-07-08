"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = require("bignumber.js");
const common_1 = require("../../common");
function parseFeeUpdate(tx) {
    const baseFeeDrops = (new bignumber_js_1.default(tx.BaseFee, 16)).toString();
    return {
        baseFeeJBC: common_1.dropsToJbc(baseFeeDrops),
        referenceFeeUnits: tx.ReferenceFeeUnits,
        reserveBaseJBC: common_1.dropsToJbc(tx.ReserveBase),
        reserveIncrementJBC: common_1.dropsToJbc(tx.ReserveIncrement)
    };
}
exports.default = parseFeeUpdate;
//# sourceMappingURL=fee-update.js.map