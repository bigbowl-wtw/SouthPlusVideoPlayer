/**
 * Copied from https://github.com/Rishikant181/Rettiwt-API/blob/e2df415c131582d6c534bbbc2976afabd0bbc43e/src/enums/Errors.ts
 */

/**
 * Different type of error messages related to data that are returned by services.
 *
 * @public
 */
export enum DataErrors {
    UserNotFound = 'An account with given username/id was not found',
    TweetNotFound = 'A tweet with the given id was not found',
}
