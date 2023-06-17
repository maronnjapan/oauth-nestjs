import { Injectable } from '@nestjs/common';
import { Config } from 'src/config/Config';

@Injectable()
export class IntrospectService {
    isValidResourceInfo(authHeader: string) {
        const clientCredentials = Config.decodeClientCredentials(authHeader);
        const allowedResource = Config.getResourceServers().find((serve) => serve.client_id === clientCredentials.id)
        if (!allowedResource) {
            return false
        }
        if (allowedResource.client_secret !== clientCredentials.secret) {
            return false
        }
        return true
    }
}
