import { Prisma } from 'prisma-binding';
import { fragmentReplacements } from './resolvers/index';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  fragmentReplacements
});

export { prisma as default };

// const createPostForUser = async (authorId, data) => {

//   const userExists = await prisma.exists.User({ id: authorId });

//   if (!userExists) {
//     throw new Error('User not found')
//   }

//   const post = await prisma.mutation.createPost({
//     data: {
//       ...data,
//       author: {
//         connect: {
//           id: authorId
//         }
//       }
//     }
//   }, '{ author { id name email posts { id title published } } }')

//   return post;
// }

// const updatePostForUser = async (postId, data) => {

//   const postExists = await prisma.exists.Post({ id: postId });

//   if (!postExists) {
//     throw new Error('Post not found')
//   }

//   const post = await prisma.mutation.updatePost({
//     where: {
//       id: postId
//     },
//     data
//   }, '{ author { id name email posts { id title published } } }');

//   return post;
// };

// createPostForUser('cjqct2km1000t0a23jl3tp4ke', {
//   title: 'Far Out 2',
//   body: 'Nice marmot',
//   published: true
// }).then(user => {
//   console.log(JSON.stringify(user, undefined, 2))
// }).catch(error => {
//   console.log(error.message);
// })

// updatePostForUser('cjqcul60i001k0a23d1qfh0js', {
//   title: 'No Eagles!',
//   body: ''
// }).then(user => {
//   console.log(JSON.stringify(user, undefined, 2));
// }).catch(error => {
//   console.log(error.message);
// });

// prisma.query.users(null, '{ id name posts { id title } }').then( data => {
//   console.log(JSON.stringify(data, undefined, 2))
// });

// prisma.query.comments(null, '{ id text author { id name } }').then( data => {
//   console.log(JSON.stringify(data, undefined, 2))
// });

