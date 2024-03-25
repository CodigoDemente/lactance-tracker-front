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

const childs = [
  {
    name: 'Alex',
    id: 1,
  },
  {
    name: 'Eva',
    id: 2,
  }
]


const Home = () => {

  const [tab, setTab] = useState(0);
  const [edit, setEdit] = useState(false);
  const [submittedForm, setSubmittedForm] = useState(false);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!user) {
  //     navigate('/login');
  //   }
  // }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target.name);
     setSubmittedForm(true)
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
  return (
    <PageContainer>
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
          <StyledLink to={`/child/${childs[tab].id}`}>
            {childs[tab].name}
          </StyledLink>
          <FlexContainer $col>
            <Button
              size="small"
              primary
              name="tits"
             onClick={handleSubmit}
            >
             🤱 Tits
            </Button>
            <Button
              size="small"
              secondary
              name="bibs"
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
    font-size: 16px;
    text-decoration: none;
    font-weight: 600;
    min-width: 100px;
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
    width: 20%;
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
