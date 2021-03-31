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
    { data, data: { author } },
    { db: { users, posts }, pubsub },
    info
  ) {
    const userExists = users.some((u) => u.id === author);
    if (!userExists) {
      throw new Error("User not found");
    }

    const post = {
      id: uuid(),
      ...data,
    };

    posts.push(post);
    if(post.published) {
      console.log(post)
      pubsub.publish(`post: ${post.author}`, {post: {mutation: "create", data: post}})
    }
    return post;
  },
  updatePost(parent, { post: id, data }, { db: { posts }, pubsub }, info) {
    const post = posts.find((u) => u.id === id);
    if (!post) {
      throw new Error("Post not found.");
    }

    if (typeof data.title === "string") {
      post.title = data.title;
    }

    if (typeof data.body === "string") {
      post.body = data.body;
    }

    if (typeof data.published === "boolean") {
      post.published = data.published;
    }

    if(post.published) {
      pubsub.publish(`post: ${post.author}`, {post: {mutation: "update", data: post}})
    }

    return post;
  },
  deletePost(parent, { post }, { db: { posts, comments }, pubsub }, info) {
    const postIndex = posts.findIndex((p) => p.id === post);

    if (postIndex === -1) {
      throw new Error("Post not found.");
    }
    const deletedPost = { ...posts[postIndex] };

    posts.splice(postIndex, 1);
    comments = comments.filter((c) => c.post !== deletedPost.id);

    if(deletedPost.published) {
      pubsub.publish(`post: ${post.author}`, {post: {mutation: "delete", data: deletedPost}})
    }
    return deletedPost;
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
