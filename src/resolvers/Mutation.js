import uuid from "uuid/v4";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {getUserId} from '../utils/getUserId'

// const token = jwt.sign({ id: 46 }, "mysecret");
// console.log("TOKEN", token);

// const decoded = jwt.decode(token);
// console.log("DECODED", decoded);

// const decoded2 = jwt.verify(token, "mybestguess");
// console.log("DECODED 2", decoded2);

// const dummy = async () => {
//   const email = "somethin@example.com";
//   const password = "pword1234";

//   const hashedPassword =
//     "$2a$10$LeLM3bwCDnTFNpmXcaYZluZG8hOzBf8dVSX/7ugxGeIRqY/9Cpe6W";
//   const isMatch = await bcrypt.compare(password, hashedPassword);
//   console.log(isMatch);
// };
// dummy();

export default {
  async createUser(
    parent,
    { data, data: { email, password } },
    { db: { users }, prisma },
    info
  ) {
    if (password.length < 8) {
      throw new Error("Password must be 8 characters or longer.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log({
      data: { ...data, password: hashedPassword },
    })
    const user = await prisma.mutation.createUser({
      data: { ...data, password: hashedPassword },
    });

    console.log("New User", user);

    return {
      user,
      token: jwt.sign({ userId: user.id }, "whatasecret"),
    };
  },
  async updateUser(
    parent,
    { data, where: { id }, where },
    { db: { users }, prisma },
    info
  ) {
    return prisma.mutation.updateUser({ data, where: { id } }, info);
  },
  async deleteUser(
    parent,
    { where },
    { db: { users, posts, comments }, prisma, request },
    info
  ) {
    const userId = getUserId(request)
    return prisma.mutation.deleteUser({ where });
  },
  async createPost(
    parent,
    { data },
    { db: { users, posts }, pubsub, prisma, request },
    info
  ) {
    const userId = getUserId(request)
    return prisma.mutation.createPost({ data: {...data, author: {
      connect: {
        id: userId
      }
    }} }, info);
  },
  async updatePost(
    parent,
    { post: id, data, where },
    { db: { posts }, pubsub, prisma },
    info
  ) {
    return prisma.mutation.updatePost({ data, where }, info);
  },
  async deletePost(
    parent,
    { post, where },
    { db: { posts, comments }, pubsub, prisma },
    info
  ) {
    return prisma.mutation.deletePost({ where }, info);
  },
  async createComment(
    parent,
    { data },
    { db: { users, posts }, pubsub, prisma },
    info
  ) {
    return prisma.mutation.createComment({ data }, info);
  },
  async updateComment(
    parent,
    { post: id, data, where },
    { db: { posts }, pubsub, prisma },
    info
  ) {
    return prisma.mutation.updateComment({ data, where }, info);
  },
  async deleteComment(
    parent,
    { post, where },
    { db: { posts, comments }, pubsub, prisma },
    info
  ) {
    return prisma.mutation.deleteComment({ where }, info);
  },
  async login(
    parent,
    args,
    {prisma},
    info
  ) {
    const user = await prisma.query.user({where: {email: args.data.email}})
    if(!user) {
      throw new Error("User does not exist")
    }
    const correctPassword = await bcrypt.compare(args.data.password, user.password)
    if(correctPassword) {
      return {
        token: jwt.sign({ userId: user.id }, "whatasecret"),
        user
      }
    }
    throw new Error("Login failed")
  },
};
