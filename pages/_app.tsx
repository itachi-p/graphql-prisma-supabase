//すべてのコンポーネントで Apollo Client が利用できるよう<ApolloProvider>を追加

import type { AppProps } from 'next/app';

// GraphQLのクライアント側ライブラリをインポート
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
// GraphQLではREST APIと違いエンドポイントに階層構造はなく単一
  uri: '/api/graphql',
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;