import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import prisma from '../src/prisma';
import seedDatabase, { userOne } from './utils/seedDatabase';
import getClient from './utils/getClient';
import { createUser, login, getUsers, getProfile } from './utils/operations';
// import { extractFragmentReplacements } from 'prisma-binding';
// import { extractFragmentReplacements } from 'prisma-binding';

jest.setTimeout(1000000000);

const client = getClient();

beforeEach(seedDatabase);

test('Should create a new user', async () => {
  const variables = {
    data: {
      name: 'Andrew',
      email: 'andrew@example.com',
      password: 'red12345'
    }
  }
  
  const response = await client.mutate({
    mutation: createUser,
    variables
  });

  const exists = await prisma.exists.User({ id: response.data.createUser.user.id });

  expect(exists).toBe(true);
});

test('Should expose public user profiles', async () => {
  
  const response = await client.query({ query: getUsers });

  expect(response.data.users.length).toBe(1);
  expect(response.data.users[0].email).toBe(null);
  expect(response.data.users[0].name).toBe('Jen');
});

test('Should not login with bad credential', async () => {

  const variables = {
    data: {
      email: "jen@example.com",
      password: "1234567890"
    }
  }

  await expect(
    client.mutate({ mutation: login, variables })
  ).rejects.toThrow();

});

test('Should not sign up user with a password that is shorter than 8 characters', async () => {

  const variables = {
    data: {
      name: "Dude",
      email: "dude@example.com",
      password: "dude"
    }
  }   

  await expect(
    client.mutate({ mutation: createUser, variables })
  ).rejects.toThrow();
});

test('Should fetch user profile', async () => {
  const client = getClient(userOne.jwt);

  const { data } = await client.query({ query: getProfile });

  expect(data.me.id).toBe(userOne.user.id);
  expect(data.me.name).toBe(userOne.user.name);
  expect(data.me.email).toBe(userOne.user.email);
});
