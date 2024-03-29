import React from 'react';
import styled from 'styled-components';
import { colors } from '../styles/colors';

const Input = ({ label, maxLength, minLength, name, required, placeholder, size }) => {
    return (
        <StyledInput>
            <StyledLabel>{label}</StyledLabel>
            <StyledInputField
                name={name}
                required={required}
                maxLength={maxLength}
                $size={size}
                minLength={minLength}
                placeholder={placeholder} />
        </StyledInput>
    );
}

const StyledInput = styled.div`
   display: flex;
    flex-direction: column;
`;

const StyledLabel = styled.label`
    padding: 0 5px;
    color: ${colors.darkgrey};
    font-size: 14px;
    font-weight: 600;
`;

const StyledInputField = styled.input`
    width: ${props => props.$size === 'small' && '80px'};
    font-family: "Open Sans";
    height: 20px;
    padding: 10px;
    border: 1px solid ${colors.lightgrey};
    border-radius: 10px;
    font-size: 12px;
    font-weight: 400;
    color: ${colors.darkgrey};
    &::placeholder {
    color: ${colors.grey};
    }
    &:focus {
        outline: none;
        border: 1px solid ${colors.primary};
    }
`;

export default Input;