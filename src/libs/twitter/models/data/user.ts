// TYPES
import { InitialState } from '../../types/InitialState';
import { IUser } from '../../types/user';
import { Result as RawUser } from '../../types/user/user';

/**
 * The details of a single user.
 *
 * @internal
 */
export class User implements IUser {
    /** The rest id of the user. */
    id: string;

    /** The username/screenname of the user. */
    userName: string;

    /** The full name of the user. */
    fullName: string;

    /** The creation date of user's account. */
    createdAt: string;

    /** The user's description. */
    description: string;

    /** Whether the account is verified or not. */
    isVerified: boolean;

    /** The number of tweets liked by the user. */
    favouritesCount: number;

    /** The number of followers of the user. */
    followersCount: number;

    /** The number of following of the user. */
    followingsCount: number;

    /** The number of tweets made by the user. */
    statusesCount: number;

    /** The location of user as provided by user. */
    location: string;

    /** The rest id of the tweet pinned in the user's profile. */
    pinnedTweet: string;

    /** The url of the profile banner image. */
    profileBanner: string;

    /** The url of the profile image. */
    profileImage: string;

    /**
     * @param user The raw user data.
     */
    constructor(user: RawUser) {
        this.id = user.rest_id;
        this.userName = user.legacy.screen_name;
        this.fullName = user.legacy.name;
        this.createdAt = user.legacy.created_at;
        this.description = user.legacy.description;
        this.isVerified = user.legacy.verified;
        this.favouritesCount = user.legacy.favourites_count;
        this.followersCount = user.legacy.followers_count;
        this.followingsCount = user.legacy.friends_count;
        this.statusesCount = user.legacy.statuses_count;
        this.location = user.legacy.location;
        this.pinnedTweet = user.legacy.pinned_tweet_ids_str[0];
        this.profileBanner = user.legacy.profile_banner_url;
        this.profileImage = user.legacy.profile_image_url_https;
    }
}

export class UserFromInitialState implements IUser {
    id: string;
    userName: string;
    fullName: string;
    createdAt: string;
    description: string;
    isVerified: boolean;
    favouritesCount: number;
    followersCount: number;
    followingsCount: number;
    statusesCount: number;
    location: string;
    pinnedTweet: string;
    profileBanner: string;
    profileImage: string;

    constructor(initialState: InitialState) {
        const entities = initialState.entities.users.entities;
        this.id = Object.keys(entities)[0];
        const user = entities[this.id];
        this.userName = user.screen_name;
        this.fullName = user.name;
        this.createdAt = user.created_at;
        this.description = user.description;
        this.isVerified = user.verified;
        this.favouritesCount = user.favourites_count;
        this.followersCount = user.followers_count;
        this.followingsCount = user.friends_count;
        this.statusesCount = user.statuses_count;
        this.location = user.location;
        this.pinnedTweet = user.pinned_tweet_ids_str[0];
        this.profileBanner = user.profile_banner_url;
        this.profileImage = user.profile_image_url_https;
    }
}
