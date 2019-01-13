import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import prisma from '../src/prisma';
import seedDatabase, { userOne, postOne, postTwo } from './utils/seedDatabase';
import getClient from './utils/getClient';
import { getPosts, getMyPosts, updatePost, createPost, deletePost, subscribeToPosts } from './utils/operations';
import { printSchema } from 'graphql';

jest.setTimeout(1000000000);

const client = getClient();

beforeEach(seedDatabase);

test('Should expose published posts', async () => {

  const response = await client.query({ query: getPosts });

  expect(response.data.posts.length).toBe(1);
  expect(response.data.posts[0].published).toBe(true);
});

test('Should fetch user posts', async () => {
  const client = getClient(userOne.jwt);
  
  const { data } = await client.query({ query: getMyPosts });

  expect(data.myPosts.length).toBe(2);
});

test('Should be able to update own post', async () => {
  const client = getClient(userOne.jwt);

  const variables = {
    id: postOne.post.id,
    data: {
      published: false
    }
  }
  
  const { data } = await client.mutate({ mutation: updatePost, variables });

  const exists = await prisma.exists.Post({ id: postOne.post.id, published: false })

  expect(data.updatePost.published).toBe(false);  //checking response
  expect(exists).toBe(true);  // checks prisma database 
});

test('Should create a new post', async () => {
  const client = getClient(userOne.jwt);

  const variables = {
    data: {
      title: "New Post",
      body: "...",
      published: true
    }
  }

  const { data } = await client.mutate({ mutation: createPost, variables });

  // const exists = await prisma.exists.Post({ id: postOne.post.id, published: false })
  expect(data.createPost.title).toBe('New Post');
  expect(data.createPost.body).toBe('...');
  expect(data.createPost.published).toBe(true);  //checking response
  // expect(exists).toBe(true);  // checks prisma database 
});

test('Should delete post', async () => {
  const client = getClient(userOne.jwt);

  const variables = {
    id: postTwo.post.id
  }

  await client.mutate({ mutation: deletePost, variables });
  const exists = await prisma.exists.Post({ id: postTwo.post.id });

  expect(exists).toBe(false)
});

test('Should subscribe to posts', async (done) => {

  client.subscribe({ query: subscribeToPosts }).subscribe({
    next(response) {
      expect(response.data.post.mutation).toBe('DELETED')
      done()
    }
  });

  //change post 
  await prisma.mutation.deletePost({ where: { id: postOne.post.id }})
});
