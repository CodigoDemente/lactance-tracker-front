import React, { useContext, useEffect, useState } from 'react';
import check from '../assets/ellipse.svg';
import { FaEdit } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import Button from '../components/Button';
import Input from '../components/Input';
import { colors } from '../styles/colors';
import UserContext from '../hooks/UserContext';
import Paragraph from '../components/Paragraph';
import Cookies from 'js-cookie';


const Home = () => {

  const [tab, setTab] = useState(0);
  const [edit, setEdit] = useState(false);
  const [submittedForm, setSubmittedForm] = useState(false);
  const [errorAPICall, setErrorAPICall] = useState(false);
  const [childs, setChilds] = useState(null);
  
  const token = Cookies.get('token')

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const getChilds = async () => {
    const settings = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ token }`
            },
        };
        try {
            const response = await fetch(`https://lactance-tracker-back-dev-frat.2.ie-1.fl0.io/parents/${user}/childs`, settings)
          if (response.status === 200) {
            const body = await response.json();
            setChilds(body)
            }
        } catch (e) {
            setErrorAPICall(true)
            return e;
        }
  }
  
  const postMeal = async (type) => {
    const settings = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        type: type
      })
    };
    try {
      const response = await fetch(`https://lactance-tracker-back-dev-frat.2.ie-1.fl0.io/childs/${childs[tab].id}/meals`, settings)
      if (response.status === 201) {
        setSubmittedForm(true)
      }
    } catch (e) {
      setErrorAPICall(true)
      return e;
    }
  }

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      getChilds();
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    postMeal(e.target.name);
  }

  const registerManually = (e) => {
    e.preventDefault();
    console.log('register manually');
     setSubmittedForm(true)
  }
  
  const onChangeTab = (e) => {
    setTab(e.target.name);
    setSubmittedForm(false);
  }
  if (!childs) {
    return <div>Loading...</div>
  }
  return (
    <PageContainer>
      { errorAPICall && 
                <Paragraph size='s' color='red'>Something went wrong with your login!</Paragraph>
                }
         <FlexContainer>
        {childs.map((child, i) => {
        return (
          <Tab
            key={child.id}
            name={i}
            onClick={onChangeTab}
            $primary={i % 2 === 0}
            $secondary={i % 2 !== 0}
          >{child.name}</Tab>
        )
      })}
      </FlexContainer>
      <CheckContainer>
          {
            submittedForm &&  <img src={check} alt="check" />
          }
          </CheckContainer>
      {childs[tab] && (
        <FlexContainer $gap={'40px'} $col>
          <StyledLink to={`${user}/child/${childs[tab].id}`}>
            {childs[tab].name}
          </StyledLink>
          <FlexContainer $col>
            <Button
              primary
              name="breast"
             onClick={handleSubmit}
            >
             🤱 Tits
            </Button>
            <Button
              secondary
              name="bottle"
             onClick={handleSubmit}
            >
               🍼 Bibs
            </Button>
          </FlexContainer>
          <FlexContainer $col>
            <EditButton onClick={()=> setEdit(!edit)}>
              Register <FaEdit size={20}/>
            </EditButton>
            {edit && <FlexContainer $gap={'10px'}>
              <Input
                name="hours"
                maxLength="2"
                minLength="1"
                required
                size="small"
                placeholder="Hours..."
              />
              <Input
                name="minutes"
                maxLength="2"
                minLength="1"
                required
                size="small"
                placeholder="Minutes..."
              />
              <SendButton onClick={registerManually}>
                <IoSend size={15} />
              </SendButton>
            </FlexContainer>
            }
          </FlexContainer>
        </FlexContainer>
        )}
    </PageContainer>
  );
}

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 40px;
 `;


const FlexContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: ${props => props.$col ? 'column' : 'row'};
    align-items: center;
    justify-content: center;
    gap: ${props => props.$gap || '0px'};
`

const CheckContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
`;

const Tab = styled.button`
    background-color: ${props => props.$primary ? colors.primary : colors.white};
    color: ${props => props.$secondary ? colors.primary : colors.white};
    width: 100%;
    font-size: 16px;
    text-decoration: none;
    font-weight: 600;
    padding: 6px;
    border-radius: 2px;
    border: 2px solid ${colors.primary};
    &:hover {
        opacity: 0.8;
    }
  `;

  const StyledLink = styled(Link)`
    color: ${colors.darkgrey};
    font-size:  28px;
    text-decoration: none;
    font-weight: 600;
    &:hover {
        text-decoration: underline;
    }
`;

const buttonStyles = `
    background-color: transparent;
    border: none;
    color: ${colors.darkgrey};
    text-decoration: none;
    unset: none;
    cursor: pointer;
     &:hover {
        opacity: 0.8;
    }
  `;

const EditButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding-bottom: 20px;
    ${buttonStyles}
  `; 

const SendButton = styled.button`
   ${buttonStyles}
   color: ${colors.primary};
  `;

export default Home;
