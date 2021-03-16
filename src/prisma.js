import {Prisma} from 'prisma-binding'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466'
})


const createPostForUser = async (authorId, data) => {
    const userExists = await prisma.exists.User({
        id: authorId,
    })
    if(!userExists) {
        throw new Error("User not found")
    }
    const post = await prisma.mutation.createPost({
        data: {
            ...data,
            author: {
                connect: {
                    id: authorId
                }
            }
        }
    }, '{ id author { id name email posts {id title published } } }')
    return post.author
}

const updatePost = async (postId, data) => {
    const postExists = await prisma.exists.Post({
        id: postId,
    })
    if(!postExists) {
        throw new Error("Post not found")
    }
    const post = await prisma.mutation.updatePost({
        data: {
            ...data
        },
        where: {
            id: postId
        }
    }, '{ id author { id name email posts {id title published } } }')
    return post.author
}

updatePost('ckmbda8qc00bl0a00yujit7ph', {
    title: 'This works'
}).then(data => {
    console.log(data)
}).catch(err => console.log(err))

// createPostForUser('ckmbd7gwl009r0a00t0d10ofo', {
//     title: "Great books to read",
//     body: "The war of art",
//     published: true
// }).then(data => {
//     console.log(data)
// })

// createPostForUser('ckmbd7gwl009r0a00t0d10ofo', {
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