type Client = {
    client_id: string;
    client_secret: string;
    redirect_uris: string[];
    scope: string[];
}
export const Config = {
    getClients(): Client[] {
        return [
            {
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                redirect_uris: ['http://localhost:3000/callback', 'http://localhost:3003/callback'],
                scope: ['openid', 'profile', 'email', 'address', 'phone', 'offline_access']
            },
        ]
    },

    decodeClientCredentials(auth: string) {
        const clientCredentials = Buffer.from(auth.slice('basic '.length), 'base64').toString().split(':');
        return { id: clientCredentials[0], secret: clientCredentials[1] };
    },

}