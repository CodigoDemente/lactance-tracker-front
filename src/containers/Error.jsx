import React from 'react';
import styled from 'styled-components';
import fantom from '../assets/fantom.png';
import Paragraph from '../components/Paragraph';
import { device } from '../styles/breakpoints';
import { colors } from '../styles/colors';

const Error = ({errorMessage}) => {

const refreshPage = () => {
    window.location.reload();
  }
  return (
      <PageContainer>
          <StyledImage src={fantom} alt="fantom" />
        <Paragraph size='l' color='red'>...Oh no !...</Paragraph>
        <Paragraph size='m' color='red'>{errorMessage}</Paragraph>
        <RefreshButton onClick={refreshPage}>🌀 Refresh 🌀</RefreshButton>
    </PageContainer>
  );
}


const StyledImage = styled.img`
    width: 50%;
    margin-bottom: 20px;

    @media ${device.md} {
      width: 40%;
    }

    @media ${device.lg} {
      width: 20%;
    }
`;
const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 40px;
 `;

 const RefreshButton = styled.button`
    margin-top: 20px;
    border: none;
    background-color: transparent;
    color: ${colors.darkgrey};
    padding: 10px 20px;
    font-size: 16px;
`;


export default Error;
