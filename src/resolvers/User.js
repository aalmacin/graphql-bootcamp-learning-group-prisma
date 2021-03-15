export default {
        posts(parent, args, {db: {posts}}) {
            return posts.filter(p => p.author === parent.id)
        },
        comments(parent, args, {db: {comments}}) {
            return comments.filter(c => c.user === parent.id)
        },
    }