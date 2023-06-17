import { Injectable } from '@nestjs/common';
import { URL } from 'url';


type Options = {
    response_type: 'code'
    client_id: string
    redirect_uri: string
    state: string
    scope: string;
    code_challenge: string;
    code_challenge_method: 's256' | 'plain'
    prompt?: 'consent';
}
@Injectable()
export class AuthorizeService {

    buildUrl(base: string, options: Options, hash?: string) {
        const newUrl = new URL(base);

        const urlSearchParam = new URLSearchParams(options).toString();

        newUrl.search = urlSearchParam;
        if (hash) {
            newUrl.hash = hash;
        }

        return newUrl.toString();
    }
}
