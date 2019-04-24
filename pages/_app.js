import App, { Container } from 'next/app';
import Sidebar from '../components/Sidebar';

class Myapp extends App {
  render() {
    const { Component } = this.props;

    return (
      <Container>
        <Sidebar />
        <Component />
      </Container>
    );
  }
}

export default Myapp;
