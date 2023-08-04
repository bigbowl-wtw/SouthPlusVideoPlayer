import cache from '../../../managers/cache';
import Endpoint from '../endpoints';
import * as TweetExtractors from '../helper/extractors/tweets';
import { Tweet } from '../models/data/tweet';
import RawTweet from '../types/tweet/tweet';
import { Url } from '../url';
import { AuthService } from './auth';
import { FetchService } from './fetch';

export class TweetService {
    private http: FetchService;

    constructor(auth: AuthService) {
        this.http = new FetchService(auth);
    }

    async getTweetDetail(id: string): Promise<Tweet> {
        const cachedData = cache.get(id);
        if (cachedData) {
            return cachedData;
        }
        const url = new Url(Endpoint.TweetDetail, { id });
        const ret = await this.http.get<RawTweet>(url);

        // Fetching the raw data
        const data = TweetExtractors.extractTweet(ret, id);

        // Parsing data
        const tweet = new Tweet(data.required[0]);

        // Caching data
        cache.set(id, tweet);

        return tweet;
    }
}
