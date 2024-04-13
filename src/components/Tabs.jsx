import React, { useState } from 'react';
import styled from 'styled-components';
import { colors } from '../styles/colors';


const Tabs = ({ tabs, size, isActive, onChangeTab, toShow }) => {
    const initialTabs = toShow ? tabs.slice(0, toShow) : tabs;
    const [showTabs, setShowTabs] = useState(initialTabs);
    return (
        <FlexContainer $gap="4px">
            {showTabs.map((tab) => (
                <Tab
                    key={tab.id}
                    value={tab.value}
                    onClick={onChangeTab}
                    $size={size}
                    $active={tab.value === isActive}
                >{tab.name}</Tab>
            ))}
            {toShow && tabs.length > toShow &&
                <Tab
                    key="more"
                    value="more"
                    onClick={() => setShowTabs(showTabs.length !== tabs.length ? tabs : tabs.slice(0, toShow))}
                >
                    {showTabs.length !== tabs.length ? '...' : ' - '}
                </Tab>
            }
        </FlexContainer>
    );
}


const Tab = styled.button`
    background-color: ${colors.white}; 
    color: ${colors.primary};
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: ${props => props.$size === "fixed" ? '140px' : 'auto'};
    height: ${props => props.$size === "fixed" ? '50px' : 'auto'};
    min-width: 80px;
    max-width: 200px;
    font-size: 16px;
    text-decoration: none;
    font-weight: 600;
    padding: 4px;
    border-radius: 2px;
    border: 2px solid ${colors.primary};
    &:hover {
        color: ${colors.white};
        background-color: ${colors.primary}
    };
    &:focus {
        color: ${colors.white};
        background-color: ${colors.primary}
    };
    ${props => props.$active && `
        color: ${colors.white};
        background-color: ${colors.primary}
    `}
  `;

  const FlexContainer = styled.div`
    display: flex;
    flex-direction: ${props => props.$col ? 'column' : 'row'};
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: ${props => props.$gap || '0px'};
`


export default Tabs;
