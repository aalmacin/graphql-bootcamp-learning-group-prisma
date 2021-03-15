import {Prisma} from 'prisma-binding'

prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'localhost:4466'
})