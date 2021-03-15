export default {
  count: {
    subscribe(parent, args, { pubsub }, info) {
      let count = 0;

      setInterval(() => {
        count++;
        pubsub.publish("count", { count });
      }, 1000);

      return pubsub.asyncIterator("count");
    },
  },
  post: {
    subscribe(parent, {user: id}, {db: {users}, pubsub}, info) {
      const user = users.find((u) => u.id === id);
      if (!user) {
        throw new Error("User not found");
      }
      return pubsub.asyncIterator(`post: ${id}`)
    }
  },
  comment: {
    subscribe(parent, { post: id }, { pubsub, db: { posts } }, info) {
      const post = posts.find((p) => p.id === id);
      if (!post) {
        throw new Error("Post not found");
      }
      if (!post.published) {
        throw new Error("Post not published");
      }

      return pubsub.asyncIterator(`comment: ${id}`);
    },
  },
};
