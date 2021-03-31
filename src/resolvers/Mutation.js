import uuid from "uuid/v4";
export default {
  async createUser(parent, { data, data: { email } }, { db: { users }, prisma }, info) {
    return prisma.mutation.createUser({
      data
    }, info)
  },
  async updateUser(parent, { data, where: {id}, where }, { db: { users }, prisma }, info) {
    return prisma.mutation.updateUser({data, where: { id }}, info);
  },
  async deleteUser(parent, { where }, { db: { users, posts, comments }, prisma }, info) {
    return prisma.mutation.deleteUser({where});
  },
  async createPost(
    parent,
    { data },
    { db: { users, posts }, pubsub, prisma },
    info
  ) {
    return prisma.mutation.createPost({data}, info);
  },
  async updatePost(parent, { post: id, data, where }, { db: { posts }, pubsub, prisma }, info) {
    return prisma.mutation.updatePost({data, where}, info);
  },
  async deletePost(parent, { post, where }, { db: { posts, comments }, pubsub, prisma }, info) {
    return prisma.mutation.deletePost({where}, info);
  },
  async createComment(
    parent,
    { data },
    { db: { users, posts }, pubsub, prisma },
    info
  ) {
    return prisma.mutation.createComment({data}, info);
  },
  async updateComment(parent, { post: id, data, where }, { db: { posts }, pubsub, prisma }, info) {
    return prisma.mutation.updateComment({data, where}, info);
  },
  async deleteComment(parent, { post, where }, { db: { posts, comments }, pubsub, prisma }, info) {
    return prisma.mutation.deleteComment({where}, info);
  },
};
