import { PrismaClient } from "@prisma/client";

async function userSeed(prisma: PrismaClient) {
    await prisma.user.createMany({
        data: [
            {
                sub: 'user-sub-1',
                email: 'test1@example.com',
                password: 'test1',
                name: 'Bob',
                address: 'test_address1',
                phone_number: '000-0000-000',
            },
            {
                sub: 'user-sub-2',
                email: 'test2@example.com',
                password: 'test2',
                name: 'Alice',
                address: 'test_address2',
                phone_number: '000-0000-000',
            }
        ]
    })
}

export default userSeed