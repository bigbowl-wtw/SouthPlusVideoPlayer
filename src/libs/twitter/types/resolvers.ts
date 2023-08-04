/**
 * Copied from https://github.com/Rishikant181/Rettiwt-API/blob/e2df415c131582d6c534bbbc2976afabd0bbc43e/src/types/Resolvers.ts
 */

/**
 * The data returned from extractor methods.
 *
 * @internal
 */

export interface IDataExtract {
    /** The required data. */
    required: any[];

    /** The cursor string to the next batch of data. */
    cursor: string;

    /** Additional extracted user details. */
    users: any[];

    /** Additional extracted tweet details */
    tweets: any[];
}
