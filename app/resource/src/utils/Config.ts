

export const Config = {
    getIntrospectEndpoint(): string {
        return 'http://localhost:3001/introspect'
    },
    getEncodeClientCredentials() {
        return Buffer.from(process.env.RESOURCE_ID + ':' + process.env.RESOURCE_SECRET).toString('base64');
    }
}