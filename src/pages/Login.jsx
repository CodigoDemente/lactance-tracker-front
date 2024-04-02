import React, { useCallback, useContext, useState } from 'react';
import UserContext from '../hooks/UserContext';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Submit from '../components/Submit';
import Paragraph from '../components/Paragraph';
import styled from 'styled-components';
import { colors } from '../styles/colors';
import { parseToken } from '../utils/parserToken';
import { get_token } from '../api/childs';



function Login() {
    const [errorAPICall, setErrorAPICall] = useState(false);
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    

    const apiGetToken= useCallback(async (username, password) => {
        const response = await get_token(username, password);
        if (response) {
          const token = parseToken(response)
            setUser(token.sub);
            setErrorAPICall(false);
            navigate('/')
        }
        else {
          setErrorAPICall(true)
        }
    }, [setUser, navigate]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const { username, password } = Object.fromEntries(formData.entries());
        return apiGetToken(username, password);
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
            type="password"
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