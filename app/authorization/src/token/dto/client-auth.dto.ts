export class ClientAuthDto {
    grant_type: string;
    redirect_uri: string;
    code?: string;
    scope?:string;
    refresh_token?:string;
    client_id?: string;
    client_secret?: string;
    user?:string;
}
