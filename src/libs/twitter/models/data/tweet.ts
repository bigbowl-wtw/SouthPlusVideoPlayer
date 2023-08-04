/**
 * Copies from https://github.com/Rishikant181/Rettiwt-API/blob/e2df415c131582d6c534bbbc2976afabd0bbc43e/src/models/data/Tweet.ts
 */
import * as Parsers from '../../helper/parser';
import {
    ITweetExtendedEntities,
    IMedia,
    ITweet,
    ITweetEntities,
} from '../../types/tweet';
import {
    ExtendedEntities as RawExtendedEntities,
    Medum as RawMedum,
} from '../../types/tweet/extended_entities/ExtendedEntities';
import {
    Result as RawTweet,
    Entities2 as RawTweetEntities,
} from '../../types/tweet/tweet';

/**
 * The different types parsed entities like urls, media, mentions, hashtags, etc.
 *
 * @internal
 */
export class TweetEntities implements ITweetEntities {
    // MEMBER DATA
    /** The list of hashtags mentioned in the tweet. */
    hashtags: string[] = [];

    /** The list of urls mentioned in the tweet. */
    urls: string[] = [];

    /** The list of IDs of users mentioned in the tweet. */
    mentionedUsers: string[] = [];

    /** The list of urls to various media mentioned in the tweet. */
    media: string[] = [];

    // MEMBER METHODS
    constructor(entities: RawTweetEntities) {
        // Extracting user mentions
        if (entities.user_mentions) {
            for (const user of entities.user_mentions) {
                this.mentionedUsers.push(user.id_str);
            }
        }

        // Extracting urls
        if (entities.urls) {
            for (const url of entities.urls) {
                this.urls.push(url.expanded_url);
            }
        }

        // Extracting hashtags
        if (entities.hashtags) {
            for (const hashtag of entities.hashtags) {
                this.hashtags.push(hashtag.text);
            }
        }

        // Extracting media urls (if any)
        if (entities.media) {
            for (const media of entities.media) {
                this.media.push(media.media_url_https);
            }
        }
    }
}

export class TweetMeida implements IMedia {
    stream: string;
    fallback: string;
    poster?: string;
    durationMs: number;

    constructor(media: RawMedum) {
        this.poster = media.media_url_https;
        this.durationMs = media.video_info.duration_millis;
        const variants = media.video_info.variants;
        variants
            .map(x => {
                if (x.bitrate === undefined) x.bitrate = Infinity;
                return x;
            })
            .sort((a, b) => b.bitrate - a.bitrate);
        this.stream = variants[0].url;
        this.fallback = variants[1].url;
    }
}

export class TweetExtendedEntities implements ITweetExtendedEntities {
    media: IMedia[] = [];
    constructor(extendedEntities: RawExtendedEntities) {
        extendedEntities.media.forEach(media => {
            this.media.push(new TweetMeida(media));
        });
    }
}

/**
 * The details of a single Tweet.
 *
 * @internal
 */
export class Tweet implements ITweet {
    /** The rest id of the tweet. */
    id: string;

    /** The rest id of the user who made the tweet. */
    tweetBy: string;

    /** The date and time of creation of the tweet, in UTC string format. */
    createdAt: string;

    /** Additional tweet entities like urls, mentions, etc. */
    entities: TweetEntities;

    /** extended_entities */
    extendedEntities: ITweetExtendedEntities;

    /** The rest id of the tweet which is quoted in the tweet. */
    quoted: string;

    /** The full text content of the tweet. */
    fullText: string;

    /** The rest id of the user to which the tweet is a reply. */
    replyTo: string;

    /** The language in which the tweet is written. */
    lang: string;

    /** The number of quotes of the tweet. */
    quoteCount: number;

    /** The number of replies to the tweet. */
    replyCount: number;

    /** The number of retweets of the tweet. */
    retweetCount: number;

    /** The number of likes of the tweet. */
    likeCount: number;

    /**
     * @param tweet The raw tweet data.
     */
    constructor(tweet: RawTweet) {
        this.id = tweet.rest_id;
        this.createdAt = tweet.legacy.created_at;
        this.tweetBy = tweet.legacy.user_id_str;
        this.entities = new TweetEntities(tweet.legacy.entities);
        this.extendedEntities = new TweetExtendedEntities(
            tweet.legacy.extended_entities
        );
        this.quoted = tweet.legacy.quoted_status_id_str;
        this.fullText = Parsers.normalizeText(tweet.legacy.full_text);
        this.replyTo = tweet.legacy.in_reply_to_status_id_str;
        this.lang = tweet.legacy.lang;
        this.quoteCount = tweet.legacy.quote_count;
        this.replyCount = tweet.legacy.reply_count;
        this.retweetCount = tweet.legacy.retweet_count;
        this.likeCount = tweet.legacy.favorite_count;
    }
}
