

export const Config = {
    getRedirectUris(): string[] {
        return ['http://localhost:3000/callback']
    },

    getAuthorizationEndpoint(): string {
        return 'http://localhost:3001/authorize'
    },
    getTokenEndpoint(): string {
        return 'http://localhost:3001/token'
    },
    getResourceEndpoinst():string{
        return 'http://localhost:3002/resource'
    },

    getEncodeClientCredentials() {
        return Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64');
    }
}