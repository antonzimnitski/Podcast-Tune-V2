import App, { Container } from 'next/app';
import '../styles/index.scss';

import Page from '../components/Page';

class Myapp extends App {
  render() {
    const { Component } = this.props;

    return (
      <Container>
        <Page>
          <Component />
        </Page>
      </Container>
    );
  }
}

export { Myapp as default };
