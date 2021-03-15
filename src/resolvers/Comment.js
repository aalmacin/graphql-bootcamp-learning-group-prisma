export default {
        user(parent, args, {db: {users}}) {
            return users.find(u => u.id === parent.user)
        },
        post(parent, args, {db: {posts}}) {
            return posts.find(p => p.id === parent.post)
        },
    }