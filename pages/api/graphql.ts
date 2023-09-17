import { ApolloServer, gql } from 'apollo-server-micro';
import type { NextApiRequest, NextApiResponse } from 'next';

const users = [
    { id: 1, name: 'John Doe', email: 'john@test.com' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
];

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

const resolvers = {
    Query: {
        hello: () => 'Hello World',
        users: () => users,
    },
};

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
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