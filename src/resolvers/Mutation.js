import uuid from "uuid/v4";
export default {
  async createUser(parent, { data, data: { email } }, { db: { users }, prisma }, info) {
    const emailTaken = await prisma.exists.User({email: email})

    if (emailTaken) {
      throw new Error("Email taken.");
    }

    // const user = {
    //   id: uuid(),
    //   ...data,
    // };
    // users.push(user);
    return prisma.mutation.createUser({
      data
    }, info)
  },
  updateUser(parent, { user: id, data }, { db: { users } }, info) {
    const user = users.find((u) => u.id === id);
    if (!user) {
      throw new Error("User not found.");
    }

    if (typeof data.email === "string") {
      const emailTaken = users.some((u) => u.email === data.email);
      if (emailTaken) {
        throw new Error("Email taken");
      }

      if (typeof data.name === "string") {
        user.name = data.name;
      }

      if (typeof data.email === "string") {
        user.email = data.email;
      }

      if (typeof data.age !== "undefined") {
        user.age = data.age;
      }
    }
    return user;
  },
  deleteUser(parent, { user }, { db: { users, posts, comments } }, info) {
    const userIndex = users.findIndex((u) => u.id === user);

    if (userIndex === -1) {
      throw new Error("User not found.");
    }
    const deletedUser = { ...users[userIndex] };

    users.splice(userIndex, 1);
    posts = posts.filter((p) => p.author !== deletedUser.id);
    comments = comments.filter((c) => c.author !== deletedUser.id);

    return deletedUser;
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
  createComment(
    parent,
    { data, data: { user, post } },
    { db: { users, posts, comments }, pubsub },
    info
  ) {
    const userExists = users.some((u) => u.id === user);
    const postExists = posts.some((p) => p.id === post);
    if (!userExists) {
      throw new Error("User not found");
    }
    if (!postExists) {
      throw new Error("Post not found");
    }
    const isPostPublished = posts.find((p) => p.id === post).published;
    if (!isPostPublished) {
      throw new Error("Post not published");
    }

    const comment = {
      id: uuid(),
      ...data,
    };

    comments.push(comment);
    pubsub.publish(`comment: ${post}`, { post: { mutation: 'create', data: comment }});
    return comment;
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
