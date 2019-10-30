import styled from 'styled-components';
import Icon from '@mdi/react';

import { colors, spacing } from '../../styles/variables';

export const Sidebar = styled.aside`
  background: ${colors.grey90};
  width: 24rem;
  height: 100%;
`;

export const LogoWrapper = styled.div`
  padding: ${spacing.space2};
`;

export const LogoLink = styled.a`
  display: block;
  width: 100%;
  height: 3.7rem;
  cursor: pointer;
`;

export const Logo = styled.img`
  height: 100%;
  width: auto;
  margin: 0 auto;
`;

export const Nav = styled.nav`
  padding: 0 ${spacing.space3};
  margin-top: ${spacing.space3};
`;

export const Group = styled.div`
  margin-bottom: ${spacing.space4};
`;

export const GroupLink = styled.a`
  display: flex;
  margin-bottom: ${spacing.space2};
  align-items: center;
  color: ${colors.grey70};
  cursor: pointer;
  font-size: 2rem;

  &:hover,
  &--active {
    color: ${colors.grey10};
  }
`;

export const GroupIcon = styled(Icon)`
  height: 2.5rem;
  width: 2.5rem;
  margin-right: ${spacing.space1};
  fill: currentColor;
  padding: ${props => (props.fix ? '2px !important' : '0')};
`;

export const GroupText = styled.span``;

export const GroupBtn = styled.button`
  display: block;
  margin-bottom: ${spacing.space2};
  color: ${colors.grey70};
  cursor: pointer;
  font-size: 2rem;

  &:hover,
  &--active {
    color: ${colors.grey10};
  }
`;
