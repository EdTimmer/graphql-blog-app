import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import prisma from '../src/prisma';
import seedDatabase, { userOne, postOne, postTwo } from './utils/seedDatabase';
import getClient from './utils/getClient';
import { printSchema } from 'graphql';

jest.setTimeout(1000000000);

const client = getClient();

beforeEach(seedDatabase);

test('Should expose published posts', async () => {
  const getPosts = gql`
    query {
      posts {
        id
        title 
        body 
        published
        author {
          name
        }
      }
    }
  `

  const response = await client.query({ query: getPosts });

  expect(response.data.posts.length).toBe(1);
  expect(response.data.posts[0].published).toBe(true);
});

test('Should fetch user posts', async () => {
  const client = getClient(userOne.jwt);

  const getMyPosts = gql`
    query {
      myPosts {
        id
        title 
        body 
        published
      }
    }
  `
  const { data } = await client.query({ query: getMyPosts });

  expect(data.myPosts.length).toBe(2);
});

test('Should fetch user profile', async () => {
  const client = getClient(userOne.jwt);

  const getProfile = gql`
    query {
      me {
        id
        name
        email
      }
    }
  `
  const { data } = await client.query({ query: getProfile });

  expect(data.me.id).toBe(userOne.user.id);
  expect(data.me.name).toBe(userOne.user.name);
  expect(data.me.email).toBe(userOne.user.email);
});

test('Should be able to update own post', async () => {
  const client = getClient(userOne.jwt)
  const updatePost = gql`
    mutation {
      updatePost(
        id: "${postOne.post.id}",
        data: {
          published: false
        }
      ){
        id
        title 
        body 
        published
      }
    }
  `
  const { data } = await client.mutate({ mutation: updatePost });

  const exists = await prisma.exists.Post({ id: postOne.post.id, published: false })

  expect(data.updatePost.published).toBe(false);  //checking response
  expect(exists).toBe(true);  // checks prisma database 
});

test('Should create a new post', async () => {
  const client = getClient(userOne.jwt);
  const createPost = gql`
    mutation {
      createPost(
        data: {
          title: "New Post",
          body: "..."
          published: true
        }
      ){
        id
        title 
        body 
        published
      }
    } 
  `

  const { data } = await client.mutate({ mutation: createPost });

  // const exists = await prisma.exists.Post({ id: postOne.post.id, published: false })
  expect(data.createPost.title).toBe('New Post');
  expect(data.createPost.body).toBe('...');
  expect(data.createPost.published).toBe(true);  //checking response
  // expect(exists).toBe(true);  // checks prisma database 
});

test('Should delete post', async () => {
  const client = getClient(userOne.jwt);

  const deletePost = gql`
    mutation {
      deletePost(
        id: "${postTwo.post.id}"
      ) {
        id
      }
    }
  `

  await client.mutate({ mutation: deletePost });
  const exists = await prisma.exists.Post({ id: postTwo.post.id });

  expect(exists).toBe(false)
})