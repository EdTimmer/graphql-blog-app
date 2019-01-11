import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import prisma from '../src/prisma';
import seedDatabase, { userOne } from './utils/seedDatabase';
import getClient from './utils/getClient';
// import { extractFragmentReplacements } from 'prisma-binding';
// import { extractFragmentReplacements } from 'prisma-binding';

jest.setTimeout(1000000000);

const client = getClient();

beforeEach(seedDatabase)

test('Should create a new user', async () => {
  const createUser = gql`
    mutation {
      createUser (
        data: {
          name: "Andrew",
          email: "andrew@example.com",
          password: "MyPass123"
        }
      ) {
        token,
        user {
          id
        }
      }
    }
  `

  const response = await client.mutate({
    mutation: createUser
  });

  const exists = await prisma.exists.User({ id: response.data.createUser.user.id });

  expect(exists).toBe(true);
});

test('Should expose public user profiles', async () => {
  const getUsers = gql`
    query {
      users {
        id
        name
        email
      }
    }
  `

  const response = await client.query({ query: getUsers });

  expect(response.data.users.length).toBe(1);
  expect(response.data.users[0].email).toBe(null);
  expect(response.data.users[0].name).toBe('Jen');
});

test('Should not login with bad credential', async () => {

  const login = gql`
    mutation {
      login(
        data: {
          email: "jen@example.com",
          password: "red12345x"
        }
      ) {
        token
      }
    }
  `

  await expect(
    client.mutate({ mutation: login })
  ).rejects.toThrow();

});

test('Should not sign up user with a password that is shorter than 8 characters', async () => {
   const createUser = gql`
    mutation {
      createUser (
        data: {
          name: "Dude",
          email: "dude@example.com",
          password: "dude"
        }
      ) {
        token,
        user {
          id
        }
      }
    }
   `

   await expect(
     client.mutate({ mutation: createUser })
   ).rejects.toThrow();
});


