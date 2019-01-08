const users = [
  {
    id: '1',
    name: 'Andrew',
    email: 'andrew@example.com',
    age: 27
  },
  {
    id: '2',
    name: 'Sarah',
    email: 'sarah@example.com',
  },
  {
    id: '3',
    name: 'Bob',
    email: 'bob@example.com',
    age: 34
  },
];

const posts = [
  {
    id: '11',
    title: 'One Time',
    body: 'Ghhjjtuuoyoo',
    published: true,
    author: '1'
  },
  {
    id: '12',
    title: 'Time for Rest',
    body: 'Uhhnnoyoo the',
    published: true,
    author: '2'
  },
  {
    id: '13',
    title: 'Sail the Seas',
    body: 'Xhhyyxzz',
    published: false,
    author: '1'
  },
];

const comments = [
  {
    id: '123',
    text: 'This is a great post!',
    author: '1',
    post: '11'
  },
  {
    id: '124',
    text: 'I am hungry, who wants pizza?',
    author: '1',
    post: '12'
  },
  {
    id: '125',
    text: 'Needs more cowbell',
    author: '2',
    post: '13'
  },
  {
    id: '126',
    text: 'Who let the dogs out?',
    author: '3',
    post: '11'
  },
];

const db = {
  users,
  posts,
  comments
};

export { db as default };
