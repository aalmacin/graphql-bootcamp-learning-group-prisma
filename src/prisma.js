import {Prisma} from 'prisma-binding'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466'
})


const createPostForUser = async (authorId, data) => {
    const post = await prisma.mutation.createPost({
        data: {
            ...data,
            author: {
                connect: {
                    id: authorId
                }
            }
        }
    }, '{ id }')
    const user = await prisma.query.user({
        where: {
            id: authorId
        }
    }, '{ id name email posts {id title published } }')
    return user
}

const updatePost = async (postId, data) => {
    const post = await prisma.mutation.updatePost({
        data: {
            ...data
        },
        where: {
            id: postId
        }
    }, '{ id author { id } }')
    const user = await prisma.query.user({
        where: {
            id: post.author.id
        }
    }, '{ id name email posts {id title published } }')
    return user
}

// updatePost('ckmbda8qc00bl0a00yujit7ph', {
//     title: 'This works'
// }).then(data => {
//     console.log(data)
// }).catch(err => console.log(err))
// createPostForUser('ckmbd7gwl009r0a00t0d10ofo', {
//     title: "Great books to read",
//     body: "The war of art",
//     published: true
// }).then(data => {
//     console.log(data)
// })

// createPostForUser('ckm9ybk3j00110b00db5j0mj5', {
//     title: "Great books to read",
//     body: "The war of art",
//     published: true
// }).then(user => {
//     console.log(user)
// })

// prisma.query.users(null, '{ id name posts { id title } }').then((data) => {
//     console.log(data)
// })

// prisma.query.comments(null, '{ id text user { id name } }').then((data) => {
//     console.log(data)
// })

// prisma.mutation.createPost({
//     data: {
//         title: "My new GraphQL post is live",
//         body: "You can find the new course here",
//         published: true,
//         author: {
//             connect: {
//                 id: "ckm9ybuo6001c0b00fciocubt"
//             }
//         }
//     }
// }, '{ id title body published }').then(data => {
//     console.log(data)
//     return prisma.query.users(null, '{ id name posts { id title body } }')
// }).then(data => {
//         console.log(JSON.stringify(data, undefined, 2))
// })

// prisma.mutation.updatePost({
//     data: {
//         body: "Nice Text",
//     },
//     where: {
//         id: "ckmbc973r00290a00o4oxy6kh"
//     }
// }, '{ id title body published }').then(data => {
//     console.log(data)
//     return prisma.query.users(null, '{ id name posts { id title body } }')
// }).then(data => {
//         console.log(JSON.stringify(data, undefined, 2))
// })