import { PrismaClient } from "@prisma/client";

async function userSeed(prisma: PrismaClient) {
    await prisma.user.createMany({
        data: [
            {
                sub: 'user-sub-1',
                email: 'test1@example.com',
                password: 'test1',
                name: 'Bob'
            },
            {
                sub: 'user-sub-2',
                email: 'test2@example.com',
                password: 'test2',
                name: 'Alice',
            }
        ]
    })
}

export default userSeed