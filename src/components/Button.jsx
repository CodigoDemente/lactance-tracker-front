import React from 'react';
import { Link } from "react-router-dom";
import styled from 'styled-components';
import { colors } from '../styles/colors';
import { device } from '../styles/breakpoints';

const Button = ({ children, primary, secondary, size, onClick, ...props }) => {
    return (
        <StyledButton {...props} onClick={onClick} $size={size} $primary={primary} $secondary={secondary}>
            {children}
        </StyledButton>
    );
};

const StyledButton = styled.button`
    background-color: ${props => props.$primary ? colors.primary : colors.white};
    color: ${props => props.$secondary ? colors.primary : colors.white};
    font-size: 16px;
    text-decoration: none;
    font-weight: 600;
    padding: 14px;
    width: 100%;
    text-align: center;
    border: 2px solid ${colors.primary};
    border-radius: 30px;
    margin-bottom: 20px;
    cursor: pointer;
    &:hover {
        opacity: 0.8;
    }

    @media ${device.md} {
        font-size: 18px;
        padding: 10px;
    }

    @media ${device.lg} {
        font-size: 16px;
        padding: 10px;
    }
`;

export default Button;