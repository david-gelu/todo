import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
})

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}

async function main() {
    try {
        await prisma.$connect()
        console.log('Connected to the database.')
    } catch (error) {
        console.error('Error connecting to the database:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()