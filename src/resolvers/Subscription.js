export default {
  // count: {
  //   subscribe(parent, args, { pubsub }, info) {
  //     let count = 0;

  //     setInterval(() => {
  //       count++;
  //       pubsub.publish("count", { count });
  //     }, 1000);

  //     return pubsub.asyncIterator("count");
  //   },
  // },
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
    subscribe(parent, { post: id }, { pubsub, db: { posts }, prisma }, info) {
      return prisma.subscription.comment(null, info)
    },
  },
};
