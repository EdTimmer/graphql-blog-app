import getUserId from "../utils/getUserId";

const Query = {
  users(parent, args, { prisma }, info) {

    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    };

    if (args.query) {
      opArgs.where = {
        OR: [{
          name_contains: args.query
        }]
      }
    }

    return prisma.query.users(opArgs, info)
  },

  posts(parent, args, { prisma }, info) {

    const opArgs = {
      where: {
        published: true
      },
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    };

    if (args.query) {
      opArgs.where.OR = [{
        title_contains: args.query
      }, {
        body_contains: args.query
      }]
    }
    return prisma.query.posts(opArgs, info)
  },

  comments(parent, args, { prisma }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    };

    if (args.query) {
      opArgs.where = {
        text_contains: args.query
      }
    }

    return prisma.query.comments(opArgs, info);
  },

  me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.query.user({
      where: {
        id: userId
      }
    })
  },

  async post(parent, args, { prisma, request }, info) {

    const userId = getUserId(request, false)
    
    const posts = await prisma.query.posts({  //have to use posts to access where
      where: {
        id: args.id,  //limits to one post
        OR: [{
          published: true
        }, {
          author: {
            id: userId
          }
        }]
      }
    }, info);

    if (posts.length === 0) {
      throw new Error('Post not found');
    }

    return posts[0];
   },

   async myPosts(parent, args, { prisma, request }, info) {

    const userId = getUserId(request);  // no false for second parameter because we want authentication

    const opArgs = {
      where: {
        author: {
          id: userId
        }
      },
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    };

    if (args.query) {
      opArgs.where.OR = [{
        title_contains: args.query
      }, {
        body_contains: args.query
      }];
    }
    
    return prisma.query.posts(opArgs, info);

   },
}

export { Query as default };
