import React from 'react';
import styled from 'styled-components';
import { colors } from '../styles/colors';


const Submit = ({ children, primary, secondary }) => {
    return (
        <StyledButton type="submit" $primary={primary} $secondary={secondary}>
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
    padding: 10px;
     width: ${props => props.$size === 'small' ? '200px' : '100%'};
    text-align: center;
    border: 2px solid ${colors.primary};
    border-radius: 30px;
    margin-bottom: 20px;
    cursor: pointer;
    &:hover {
        opacity: 0.8;
    }
`;

export default Submit;