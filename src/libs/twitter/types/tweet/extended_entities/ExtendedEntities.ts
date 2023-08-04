export interface ExtendedEntities {
    media: Medum[];
}

export interface Medum {
    display_url: string;
    expanded_url: string;
    id_str: string;
    indices: number[];
    media_key: string;
    media_url_https: string;
    source_status_id_str: string;
    source_user_id_str: string;
    type: string;
    url: string;
    additional_media_info: {
        monetizable: boolean;
        source_user: {
            user_results: {
                result: {
                    __typename: string;
                    id: string;
                    rest_id: string;
                    affiliates_highlighted_label: {};
                    has_graduated_access: boolean;
                    is_blue_verified: boolean;
                    profile_image_shape: string;
                    legacy: {
                        can_dm: boolean;
                        can_media_tag: boolean;
                        created_at: string;
                        default_profile: boolean;
                        default_profile_image: boolean;
                        description: string;
                        entities: {
                            description: {
                                urls: {
                                    0: {
                                        display_url: string;
                                        expanded_url: string;
                                        url: string;
                                        indices: number[];
                                    };
                                    1: {
                                        display_url: string;
                                        expanded_url: string;
                                        url: string;
                                        indices: number[];
                                    };
                                };
                            };
                            url: {
                                urls: {
                                    0: {
                                        display_url: string;
                                        expanded_url: string;
                                        url: string;
                                        indices: number[];
                                    };
                                };
                            };
                        };
                        fast_followers_count: number;
                        favourites_count: number;
                        followers_count: number;
                        friends_count: number;
                        has_custom_timelines: boolean;
                        is_translator: boolean;
                        listed_count: number;
                        location: string;
                        media_count: number;
                        name: string;
                        normal_followers_count: number;
                        pinned_tweet_ids_str: string[];
                        possibly_sensitive: boolean;
                        profile_banner_url: string;
                        profile_image_url_https: string;
                        profile_interstitial_type: string;
                        screen_name: string;
                        statuses_count: number;
                        translator_type: string;
                        url: string;
                        verified: boolean;
                        want_retweets: boolean;
                        withheld_in_countries: undefined[];
                    };
                };
            };
        };
    };
    mediaStats: { viewCount: number };
    ext_media_availability: { status: string };
    features: {};
    sizes: {
        large: SizeInfo;
        medium: SizeInfo;
        small: SizeInfo;
        thumb: SizeInfo;
    };
    original_info: { height: number; width: number };
    video_info: {
        aspect_ratio: number[];
        duration_millis: number;
        variants: Variant[];
    };
}

export interface SizeInfo {
    h: number;
    w: number;
    resize: string;
}

export interface VariantFile {
    bitrate: number;
    content_type: 'video/mp4';
    url: string;
}

export interface VariantStream {
    bitrate: undefined;
    content_type: 'application/x-mpegURL';
    url: string;
}

export type Variant = VariantFile | VariantStream;
