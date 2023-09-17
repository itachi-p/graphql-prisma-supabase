import { ApolloServer, gql } from 'apollo-server-micro';
import type { NextApiRequest, NextApiResponse } from 'next';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    hello: String
    users: [User]
  }
`;

// リゾルバ内でPrismaClientを使うためのコンテキストを定義
interface Context {
    prisma: PrismaClient;
}

// 実際にクエリの処理を行う
// リゾルバの関数はparent, args, context, infoの4つの引数を受け取れる
const resolvers = {
    Query: {
        hello: () => 'Hello World',
        users: async (parent: undefined, args: {}, context: Context) => {
            return await context.prisma.user.findMany(); // SQLの'SELECT * FROM User;' に相当
        },
    },
};

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    // ApolloServerをインスタンス化する際にPrismaClientをコンテキストに渡す
    context: {
        prisma,
    },
});

const startServer = apolloServer.start();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader(
        'Access-Control-Allow-Origin',
        'https://studio.apollographql.com'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    if (req.method === 'OPTIONS') {
        res.end();
        return false;
    }

    await startServer;
    await apolloServer.createHandler({
        path: '/api/graphql',
    })(req, res);
}

export const config = {
    api: {
        bodyParser: false,
    },
};