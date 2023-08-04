// TYPES
import { DataErrors } from '../../enums/errors';
import { IDataExtract } from '../../types/resolvers';
import RawTweet from '../../types/tweet/tweet';
// PARSERS
import * as Parsers from '../parser';

/**
 * @returns The raw tweet data formatted and sorted into required and additional data
 * @param res The raw response received from TwitterAPI
 * @param tweetId The rest id of the tweet to fetch
 */
export function extractTweet(res: RawTweet, tweetId: string): IDataExtract {
    const required: any[] = []; // To store the reqruied raw data
    const cursor: string = ''; // To store the cursor to next batch
    const users: any[] = []; // To store additional user data
    const tweets: any[] = []; // To store additional tweet data

    // If tweet does not exist
    if (Parsers.isJSONEmpty(res.data)) {
        throw new Error(DataErrors.TweetNotFound);
    }

    // Destructuring the received raw data
    res.data.threaded_conversation_with_injections_v2.instructions
        .filter(item => item.type === 'TimelineAddEntries')[0]
        .entries?.forEach(entry => {
            // If entry is of type tweet and tweet exists
            if (
                entry.entryId.indexOf('tweet') !== -1 &&
                entry.content.itemContent?.tweet_results?.result.__typename ===
                    'Tweet'
            ) {
                // If this is the required tweet
                if (entry.entryId.indexOf(tweetId) !== -1) {
                    required.push(
                        entry.content.itemContent.tweet_results.result
                    );
                }
                tweets.push(entry.content.itemContent.tweet_results.result);
                users.push(
                    entry.content.itemContent.tweet_results.result.core
                        .user_results.result
                );
            }
            // If entry if of type conversation
            else if (entry.entryId.indexOf('conversationthread') !== -1) {
                // Iterating over the conversation
                entry.content.items?.forEach(item => {
                    // If item is of type tweet and tweet exists
                    if (
                        item.entryId.indexOf('tweet') !== -1 &&
                        item.item.itemContent.tweet_results?.result
                            ?.__typename === 'Tweet'
                    ) {
                        required.push(
                            item.item.itemContent.tweet_results.result
                        );
                        tweets.push(item.item.itemContent.tweet_results.result);
                        users.push(
                            item.item.itemContent.tweet_results.result.core
                                .user_results.result
                        );
                    }
                });
            }
        });

    // Returning the data
    return {
        required,
        cursor,
        users,
        tweets,
    };
}
