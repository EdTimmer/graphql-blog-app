import { gql } from 'apollo-boost';

const createUser = gql`
  mutation($data: CreateUserInput!) {
    createUser (
      data: $data
    ) {
      token,
      user {
        id
        name 
        email 
      }
    }
  }
`

const getUsers = gql`
  query {
    users {
      id
      name
      email
    }
  }
`

const login = gql`
  mutation($data:LoginUserInput!) {
    login(
      data: $data
    ) {
      token
    }
  }
`

const getProfile = gql`
query {
  me {
    id
    name
    email
  }
}
`

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

const updatePost = gql`
  mutation($id: ID!, $data: UpdatePostInput!) {
    updatePost(
      id: $id
      data: $data
    ) {
      id
      title 
      body 
      published
    }
  }
`

const createPost = gql`
  mutation($data: CreatePostInput!) {
    createPost(data: $data){
      id
      title 
      body 
      published
    }
  } 
`

const deletePost = gql`
  mutation($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`


const getComments = gql`
  query {
    comments {
      id
      text
      author {
        name
      }
    }
  }
`

const deleteComment = gql`
  mutation($id: ID!) {
    deleteComment(id: $id) {
      id
    }
  }
`

const subscribeToComments = gql`
  subscription($postId: ID!) {
    comment(postId: $postId) {
      mutation
      node {
        id
        text
      }
    }
  }
`

const subscribeToPosts = gql`
  subscription {
    post {
      mutation
    }
  }
`

export { createUser, login, getUsers, getProfile, getPosts, getMyPosts, updatePost, createPost, deletePost, getComments, deleteComment, subscribeToComments, subscribeToPosts };
