"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trustlineFlags = exports.orderFlags = void 0;
const orderFlags = {
    Passive: 0x00010000,
    Sell: 0x00020000 // offer was placed as a sell
};
exports.orderFlags = orderFlags;
const trustlineFlags = {
    LowReserve: 0x00010000,
    HighReserve: 0x00020000,
    LowAuth: 0x00040000,
    HighAuth: 0x00080000,
    LowNoJbcoin: 0x00100000,
    HighNoJbcoin: 0x00200000,
    LowFreeze: 0x00400000,
    HighFreeze: 0x00800000
};
exports.trustlineFlags = trustlineFlags;
//# sourceMappingURL=flags.js.map