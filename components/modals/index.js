/* eslint-disable import/no-cycle */
import React from 'react';
import Modal from 'react-modal';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import LoginModal from './Login';
import RegisterModal from './Register';
import RequestResetModal from './RequestReset';

export const LOGIN = 'LOGIN';
export const REGISTER = 'REGISTER';
export const REQUEST_RESET = 'REQUEST_RESET';

const LOCAL_STATE_QUERY = gql`
  query {
    modalType @client
  }
`;

export const OPEN_MODAL_MUTATION = gql`
  mutation($modalType: String!) {
    openModal(modalType: $modalType) @client
  }
`;

export const CLOSE_MODAL_MUTATION = gql`
  mutation {
    closeModal @client
  }
`;

const MODAL_COMPONENTS = {
  LOGIN: LoginModal,
  REGISTER: RegisterModal,
  REQUEST_RESET: RequestResetModal,
};

const ModalRoot = () => (
  <Query query={LOCAL_STATE_QUERY}>
    {({ data }) => {
      const { modalType } = data;

      if (!modalType) {
        return null;
      }

      const SpecificModal = MODAL_COMPONENTS[modalType];

      if (!SpecificModal) {
        return null;
      }

      return (
        <Mutation mutation={CLOSE_MODAL_MUTATION}>
          {closeModal => (
            <Modal
              isOpen
              onRequestClose={closeModal}
              className="auth-modal"
              overlayClassName="auth-modal__overlay"
            >
              <SpecificModal closeModal={closeModal} />
            </Modal>
          )}
        </Mutation>
      );
    }}
  </Query>
);

Modal.setAppElement('body');

export default ModalRoot;
