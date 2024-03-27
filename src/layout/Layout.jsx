import React from 'react';
import { Outlet, Link } from "react-router-dom";
import { colors } from '../styles/colors';
import styled from 'styled-components';
import brand from '../assets/brand.png';
import { device } from '../styles/breakpoints';

const StyledHeader = styled.header`
    padding-top: 10px;
    background-color: ${colors.white};
    border-bottom: 1px solid ${colors.lightgrey};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    @media ${device.md} {
        padding: 20px 40px;
        max-height: 100px;
    }
    @media ${device.lg} {
        padding: 10px 40px;
        max-height: 100px;
        justify-content: center;
    }
`;

const StyledLogo = styled.img`
    height: 50px;
`;

const StyledContainer = styled.div`
 padding-inline: 20%;
`

const Layout = () => {
    return (
        <>
            <StyledHeader>
                <Link to="/">
                    <StyledLogo src={brand} alt="logo" />
                </Link>
            </StyledHeader>
            <StyledContainer>
                <Outlet />
            </StyledContainer>
            
        </>
    );
}

export default Layout;