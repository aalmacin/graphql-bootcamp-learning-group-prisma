export default {
  post: {
    subscribe(parent, {user: id}, {db: {users}, pubsub, prisma}, info) {
      return prisma.subscription.post({where: {node: {published: true}}}, info)
    }
  },
  comment: {
    subscribe(parent, { post: id }, { pubsub, db: { posts }, prisma }, info) {
      return prisma.subscription.comment({where: {node: {post: {id: id}}}}, info)
    },
  },
};
