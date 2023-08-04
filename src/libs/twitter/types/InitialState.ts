export interface InitialState {
    entities: {
        users: {
            entities: {
                [id: string]: {
                    can_dm: boolean;
                    can_media_tag: boolean;
                    default_profile: boolean;
                    default_profile_image: boolean;
                    description: string;
                    entities: { description: { urls: any[] } };
                    fast_followers_count: number;
                    favourites_count: number;
                    followers_count: number;
                    friends_count: number;
                    has_custom_timelines: boolean;
                    is_translator: boolean;
                    listed_count: number;
                    location: '';
                    media_count: number;
                    name: string;
                    needs_phone_verification: boolean;
                    normal_followers_count: number;
                    pinned_tweet_ids_str: any[];
                    possibly_sensitive: boolean;
                    profile_banner_url: string;
                    profile_image_url_https: string;
                    profile_interstitial_type: '';
                    screen_name: string;
                    statuses_count: number;
                    translator_type: string;
                    verified: boolean;
                    want_retweets: boolean;
                    withheld_in_countries: any[];
                    id_str: string;
                    is_profile_translatable: boolean;
                    profile_image_shape: string;
                    is_blue_verified: boolean;
                    birthdate: {
                        day: number;
                        month: number;
                        year: number;
                        visibility: string;
                        year_visibility: string;
                    };
                    has_graduated_access: boolean;
                    created_at: string;
                    blocked_by: boolean;
                    muting: boolean;
                    blocking: boolean;
                };
            };
        };
    };
}
