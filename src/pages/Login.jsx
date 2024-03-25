import React, { useContext, useState } from 'react';
import UserContext from '../hooks/UserContext';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Submit from '../components/Submit';
import Paragraph from '../components/Paragraph';
import { JwtParser } from '../utils/JwtParser';
import styled from 'styled-components';

export const parseToken = (token) => {
    if(!token){
        return null;
    }
    const jwtParser = new JwtParser(token);
    return jwtParser.payLoad || jwtParser;
};

function Login() {
    const [errorAPICall, setErrorAPICall] = useState(false);
    // const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    

    const handleSubmit = async (e) => {
        
        e.preventDefault();

        const formData = new FormData(e.target);

        const { username, password } = Object.fromEntries(formData.entries());
        const settings = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
            {
                username, 
                password
            })
        };
        try {
            const response = await fetch(`https://api.ubervo.es/auth/login`, settings)
            const token = parseToken(response.access_token)
            navigate('/')
        } catch (e) {
            setErrorAPICall(true)
            return e;
        }
    }

    return (
    <PageContainer>
      { errorAPICall && 
                <Paragraph size='s' color='red'>Something went wrong with your login!</Paragraph>
            }
        <StyledForm onSubmit={handleSubmit}>
           <Input
            name="username"
            label="Username"
            maxLength="50"
            minLength="5"
            required
            placeholder=""
            />
            <Input
            name="password"
            label="Password"
            maxLength="50"
            minLength="5"
            required
            placeholder=""
            />
            <Submit secondary>Login</Submit>
        </StyledForm>
    </PageContainer>
  );
}

export default Login;

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
 `;


const StyledForm = styled.form`
    padding-top: 60px;
    width: 60%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
`;