import React, { useContext, useState } from 'react';
import UserContext from '../hooks/UserContext';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Submit from '../components/Submit';
import Paragraph from '../components/Paragraph';
import styled from 'styled-components';
import { colors } from '../styles/colors';
import Cookies from 'js-cookie';
import { parseToken } from '../utils/parserToken';



function Login() {
    const [errorAPICall, setErrorAPICall] = useState(false);
    const { setUser } = useContext(UserContext);
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
            const response = await fetch(`https://lactance-tracker-back-dev-frat.2.ie-1.fl0.io/auth/login`, settings)
            if (response.status === 201) {
                const { access_token } = await response.json();
                const token = parseToken(access_token)
                Cookies.set('token', access_token, { expires: 7, secure: true });
                setUser(token.sub);
                navigate('/')
            }
        } catch (e) {
            setErrorAPICall(true)
            return e;
        }
    }

    return (
        <PageContainer>
            <div>
                <Paragraph size='l' color={`${colors.darkgrey}`}>Welcome</Paragraph>
                { errorAPICall && 
                <Paragraph size='s' color='red'>Something went wrong with your login!</Paragraph>
                }
            </div>
      
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
    padding-top: 20px;
    width: 100%;
 `;


const StyledForm = styled.form`
    padding-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
`;