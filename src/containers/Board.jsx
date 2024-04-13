import React, { useState } from 'react';
import check from '../assets/ellipse.svg';
import { FaEdit } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { Link,  } from "react-router-dom";
import styled from 'styled-components';
import Button from '../components/Button';
import Input from '../components/Input';
import { colors } from '../styles/colors';
import Tabs from '../components/Tabs';
import { parseTimeToISO } from '../utils/parserTime';
import Paragraph from '../components/Paragraph';

const buttons = [
  {
    name: 'breast',
    text: '🤱 Tits',
  },
  {
    name: 'bottle',
    text: '🍼 Bibs'
  }
]

const inputs = [
  {
    name: 'hours',
    placeholder: "Hours..."
  },
  {
    name: 'minutes',
    placeholder: 'Minutes...'
  }
]

const radioType = [
  {
    name: 'breast'
  },
  {
    name: 'bottle'
  }
]

const radioDate = [
  {
    name: 'today',
    checked: true
  },
  {
    name: 'yesterday'
  }
]

const Board = ({
    apiPostMeal,
    userId,
    childs,
    submittedForm,
    tab,
    onChangeTab
}) => {

  
  const [edit, setEdit] = useState(false);
  const [errorForm, setErrorForm] = useState('')


  const handleSubmit = (e) => {
    e.preventDefault();
    apiPostMeal(e.target.name, tab);
  }

  const registerManually = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { hours, minutes, type, day } = Object.fromEntries(formData.entries());
    
    if (hours.length !== 2 || minutes.length !== 2 || isNaN(hours) || isNaN(minutes) || hours >= 24 || minutes >= 60) {
      setErrorForm('Time format should be 2 digits and valid time')
    }
    else if (!type) {
      setErrorForm('You should select a type of meal')
    } else {
      const isoString = parseTimeToISO(hours, minutes, day);
      apiPostMeal(type, tab, isoString);
    }
  }

  const tabs = childs.map((child, i) => ({ name: child.name, id: child.id, value: i }));
  
  return (
    <>
        <Tabs
          tabs={tabs}
          onChangeTab={onChangeTab}
          size="fixed"
          isActive={tab}
        />
      <CheckContainer>{submittedForm && <img src={check} alt="check" />}</CheckContainer>
      {childs[tab] && (
        <FlexContainer $gap={'20px'} $col>
          <StyledLink to={`${userId}/child/${childs[tab].id}`}>
            {childs[tab].name}
          </StyledLink>
          <FlexContainer $col>
            {buttons.map((button, i) => (
                <Button
                    key={i}
                primary={i % 2 === 0}
                secondary={i % 2 !== 0}
                onClick={handleSubmit}
                name={button.name}>
                {button.text}
              </Button>
            ))}
          </FlexContainer>
          <FlexContainer $col>
            <EditButton onClick={()=> setEdit(!edit)}>
              Register <FaEdit size={20}/>
            </EditButton>
            {edit && <StyledForm onSubmit={registerManually}>
               {errorForm && <Paragraph size='s' color='red'>{errorForm}</Paragraph>}
              <FlexContainer $gap={'8px'}>
               {radioDate.map((radio, i) => (
                <div key={i}>
                   <input id={radio.name} checked={radio.checked}  value={radio.name} name="day" type="radio"/>
                    <label htmlFor={radio.name} class="radio-label">{radio.name}</label>
                  </div>
               ))}
                </FlexContainer>
              <FlexContainer $gap={'8px'}>
              {inputs.map((input, i) => (
                  <Input
                      label=""
                      key={i} 
                    name={input.name} 
                    placeholder={input.placeholder} 
                    maxLength="2"
                    minLength="1"
                    required
                    size="small"
                />
              ))}
              </FlexContainer>
              <FlexContainer $gap={'8px'}>
              {radioType.map((radio, i) => (
                <div key={i}>
                  <input id={radio.name} value={radio.name} name="type" type="radio"/>
                    <label htmlFor={radio.name} class="radio-label">{radio.name}</label>
                  </div>
              ))}
                <SendButton type="submit">
                <IoSend size={15} />
              </SendButton>
              </FlexContainer>
            </StyledForm>
            }
          </FlexContainer>
        </FlexContainer>
        )}
    </>
  );
}


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
    };
    display: flex;
    align-items: center;
    gap: 8px;
  `;

const EditButton = styled.button`
   
    padding-bottom: 20px;
    ${buttonStyles}
  `; 

const SendButton = styled.button`
   ${buttonStyles}
   color: ${colors.primary};
  `;

  const StyledForm = styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding-bottom: 20px;

    & .radio-label {
      font-size: 12px;
      color: ${colors.darkgrey};
    }
`;


export default Board;
