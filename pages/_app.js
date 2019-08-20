import App, { Container } from 'next/app';
import { ApolloProvider } from 'react-apollo';
import '../styles/index.scss';

import Sidebar from '../components/Sidebar';
import Meta from '../components/Meta';
import ModalRoot from '../components/modals';
import Audioplayer from '../components/Audioplayer';

import withData from '../lib/withData';

class Myapp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    // this exposes the query to the user
    pageProps.query = ctx.query;
    return { pageProps };
  }

  render() {
    const { Component, apollo, pageProps } = this.props;

    return (
      <Container>
        <ApolloProvider client={apollo}>
          <div className="app">
            <Meta />
            <div className="main">
              <Sidebar />
              <div className="content">
                <Component {...pageProps} />
              </div>
            </div>
            {process.browser && (
              <>
                <Audioplayer />
                <ModalRoot />
              </>
            )}
          </div>
        </ApolloProvider>
      </Container>
    );
  }
}

export default withData(Myapp);
