import * as _ from 'lodash';
import * as common from '../common';
import { Connection } from '../common';
import { FormattedTransactionType } from '../transaction/types';
import { Issue } from '../common/types/objects';
export declare type RecursiveData = {
    marker: string;
    results: Array<any>;
};
export declare type Getter = (marker?: string, limit?: number) => Promise<RecursiveData>;
declare function clamp(value: number, min: number, max: number): number;
declare function getJBCBalance(connection: Connection, address: string, ledgerVersion?: number): Promise<string>;
declare function getRecursive(getter: Getter, limit?: number): Promise<Array<any>>;
declare function renameCounterpartyToIssuer<T>(obj: T & {
    counterparty?: string;
    issuer?: string;
}): (T & {
    issuer?: string;
});
export declare type RequestBookOffersArgs = {
    taker_gets: Issue;
    taker_pays: Issue;
};
declare function renameCounterpartyToIssuerInOrder(order: RequestBookOffersArgs): RequestBookOffersArgs & _.Dictionary<any>;
/**
 *  Order two jbcoind transactions based on their ledger_index.
 *  If two transactions took place in the same ledger, sort
 *  them based on TransactionIndex
 *  See: https://jbcoin.com/build/transactions/
 */
declare function compareTransactions(first: FormattedTransactionType, second: FormattedTransactionType): number;
declare function hasCompleteLedgerRange(connection: Connection, minLedgerVersion?: number, maxLedgerVersion?: number): Promise<boolean>;
declare function isPendingLedgerVersion(connection: Connection, maxLedgerVersion?: number): Promise<boolean>;
declare function ensureLedgerVersion(options: any): Promise<object>;
export { getJBCBalance, ensureLedgerVersion, compareTransactions, renameCounterpartyToIssuer, renameCounterpartyToIssuerInOrder, getRecursive, hasCompleteLedgerRange, isPendingLedgerVersion, clamp, common };
