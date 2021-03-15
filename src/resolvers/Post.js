export default {
        author(parent, args, {db: {users}}) {
            return users.find(u => u.id === parent.author)
        },
        comments(parent, args, {db: {comments}}) {
            return comments.filter(c => c.post === parent.id)
        },
    }