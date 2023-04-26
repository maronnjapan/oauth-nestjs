

export const Config = {
    getRedirectUris(): string[] {
        return ['http://localhost:3003/callback']
    },
    getAuthorizationServerEndpoint(): string {
        return 'http://localhost:3001'
    },
    getAuthorizationEndpoint(): string {
        return 'http://localhost:3001/authorize'
    },
    getTokenEndpoint(): string {
        return 'http://localhost:3001/token'
    },
    getResourceEndpoinst(): string {
        return 'http://localhost:3002/resource'
    },
    getUserInfoEndpoinst(): string {
        return 'http://localhost:3002/userinfo'
    },

    getEncodeClientCredentials() {
        return Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64');
    }
}