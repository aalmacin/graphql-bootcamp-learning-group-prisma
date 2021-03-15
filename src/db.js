const users = [{
    id: '1',
    name: 'Aldrin',
    email: 'aldrin@aldrin.com',
    age: 29
}, {
    id: '2',
    name: 'Raizza',
    email: 'raizza@gushkin.com',
    age: 28
}, {
    id: '3',
    name: 'Julien',
    email: 'julien@gushkin.com',
}
]

const posts = [
    {
        id: '1',
        title: 'Hola',
        body: 'Hello to you my friend',
        published: false,
        author: '1'
    },
    {
        id: '2',
        title: 'Hello',
        body: 'Hola to you my friend',
        published: true,
        author: '1'
    },
    {
        id: '3',
        title: 'Woah',
        body: 'What exactly is this',
        published: false,
        author: '2'
    },
]

const comments = [
    {
        id: '1',
        text: 'First comment',
        user: '3',
        post: '3'
    },
    {
        id: '2',
        text: 'I like this thing',
        user: '2',
        post: '1'
    },
    {
        id: '3',
        text: 'Cool',
        user: '3',
        post: '2'
    },
    {
        id: '4',
        text: 'How is that possible?',
        user: '1',
        post: '2'
    },
]

const db = {
    users,
    posts,
    comments
}
export default db