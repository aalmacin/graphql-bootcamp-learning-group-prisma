import { getUserId } from "../utils/getUserId"

export default {
        users(parent, args, {db: {users}, prisma}, info) {
            const opArgs = {}
            if(args.query) {
                opArgs.where = {
                    OR: [
                        {name_contains: args.query},
                        {email_contains: args.query}
                    ]
                }
                return prisma.query.users(opArgs, info)
            }

            return prisma.query.users(null, info)

            // // nothing, string, object

            // if(!args.query) {
            //     return users
            // }

            // return users.filter((u) => u.name.toLowerCase().includes(args.query.toLowerCase()))
        },
        async me(parent, args, {prisma, request}, info) {
            const userId = getUserId(request)
            const user = await prisma.query.user({where: {
                id: userId
            }})
            return user
        },
        async post(parent, args, {prisma, request}, info) {
            const userId = getUserId(request, false)
            const posts = await prisma.query.posts({
                where: {
                    id: args.id,
                    OR: [
                        {
                            published: true
                        },
                        {
                            author: {
                                id: userId
                            }
                        }
                    ]
                }
            }, info)
            if(posts.length === 0) {
                throw new Error('Post not found')
            }
            return posts[0]
            // return {
            //     id: '1234jdj',
            //     title: 'A new post',
            //     body: 'Here is a new post',
            //     published: true
            // }
        },
        posts(parent, args, {db: {posts}, prisma}, info) {
            if(args.query) {
                return prisma.query.posts({
                    where: {
                        OR: [
                            {title_contains: args.query},
                            {body_contains: args.query},
                        ]
                    }
                }, info)
            }

            return prisma.query.posts(null, info)
            // if(!args.query) {
            // return posts
            // }
            // return posts.filter((p) => {
            //     return p.body.toLowerCase().includes(
            //         args.query.toLowerCase()
            //     ) || p.title.toLowerCase().includes(
            //         args.query.toLowerCase()
            //     )
            // })
        },
        comments(parent, args, {prisma}, info) {
            return prisma.query.comments(null, info)
        }
    }