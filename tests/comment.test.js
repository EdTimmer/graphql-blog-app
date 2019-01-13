import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import prisma from '../src/prisma';
import seedDatabase, { userOne, postOne, commentOne, commentTwo } from './utils/seedDatabase';
import getClient from './utils/getClient';
import { getComments, deleteComment, subscribeToComments } from './utils/operations';
import { doesNotReject } from 'assert';

jest.setTimeout(1000000000);

const client = getClient();

beforeEach(seedDatabase);

test('Should expose comments', async () => {

  const response = await client.query({ query: getComments });

  expect(response.data.comments.length).toBe(2);
  
});

test('Should delete own comment', async () => {
  const client = getClient(userOne.jwt);

  const variables = {
    id: commentTwo.comment.id
  };

  await client.mutate({ mutation: deleteComment, variables });
  const exists = await prisma.exists.Comment({ id: commentTwo.comment.id });

  expect(exists).toBe(false);
});

test('Should not delete other users comment', async () => {
  const client = getClient(userOne.jwt);

  const variables = {
    id: commentOne.comment.id
  };

  await expect(
    client.mutate({ mutation: deleteComment, variables })
  ).rejects.toThrow()
});

test('Should subscribe to comments for a post', async (done) => {
  const variables = {
    postId: postOne.post.id
  };

  client.subscribe({ query: subscribeToComments, variables }).subscribe({
    next(response) {
      expect(response.data.comment.mutation).toBe('DELETED')
      done()
    }
  });

  //change comment 
  await prisma.mutation.deleteComment({ where: { id: commentOne.comment.id }})
});

