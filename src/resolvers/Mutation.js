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
  createPost(
    parent,
    { data },
    { db: { users, posts }, pubsub, prisma },
    info
  ) {
    return prisma.mutation.createPost({data}, info);
  },
  updatePost(parent, { post: id, data, where }, { db: { posts }, pubsub, prisma }, info) {
    return prisma.mutation.updatePost({data, where}, info);
  },
  deletePost(parent, { post, where }, { db: { posts, comments }, pubsub, prisma }, info) {
    return prisma.mutation.deletePost({where});
  },
  async createComment(
    parent,
    { data, data: { user, post } },
    { db: { users, posts, comments }, pubsub, prisma },
    info
  ) {
    const userExists = await prisma.exists.User({id: user})
    const postExists = await prisma.exists.Post({id: post})
    if (!userExists) {
      throw new Error("User not found");
    }
    if (!postExists) {
      throw new Error("Post not found");
    }
    const selectedPost = await prisma.query.post({where: {id: post}}, null)
    if (!selectedPost.published) {
      throw new Error("Post not published");
    }

    console.log(data)
    const comment = await prisma.mutation.createComment({data}, info)
    
    pubsub.publish(`comment: ${post}`, { post: { mutation: 'create', data: comment }});
    return comment
  },
  updateComment(parent, { comment: id, data }, { db: { comments } }, info) {
    const comment = comments.find((u) => u.id === id);
    if (!comment) {
      throw new Error("Comment not found.");
    }

    if (typeof data.text === "string") {
      comment.text = data.text;
    }

    pubsub.publish(`comment: ${post}`, { post: { mutation: 'update', data: comment }});
    return comment;
  },
  deleteComment(parent, { comment }, { db: { comments } }, info) {
    const commentIndex = comments.findIndex((c) => c.id === comment);

    if (commentIndex === -1) {
      throw new Error("Comment not found.");
    }
    const deletedComment = { ...comments[commentIndex] };

    comments.splice(commentIndex, 1);
    pubsub.publish(`comment: ${post}`, { post: { mutation: 'delete', data: comment }});

    return deletedComment;
  },
};
