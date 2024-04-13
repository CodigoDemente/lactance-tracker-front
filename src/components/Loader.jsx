import React from 'react';
import styled from 'styled-components';
import { colors } from '../styles/colors';

const Loader = ({ children, primary, secondary, onClick, ...props }) => {
    return (
        <Container>
            <StyledLoader />
        </Container>
    );
};
const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

const StyledLoader = styled.div`
  border: 6px solid #f3f3f3;
  border-top: 6px solid ${colors.primary};
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
`


export default Loader;