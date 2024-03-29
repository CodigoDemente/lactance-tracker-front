import React from 'react';
import styled from 'styled-components';
import { colors } from '../styles/colors';


const Tabs = ({ tabs, activeTab, onChangeTab }) => {
    return (
        <>
            {tabs.map((tab, i) => (
                <Tab
                    key={tab.id}
                    name={tab.name}
                    value={i}
                    $active={activeTab === i}
                    onClick={onChangeTab}
                >{tab.name}</Tab>
            ))}
        </>
    );
}


const Tab = styled.button`
    background-color: ${props => props.$active ? colors.primary : colors.white};
    color:  ${props => props.$active ? colors.white : colors.primary};
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
    &:focus {
        color: ${colors.white};
        background-color: ${colors.primary};
    }
  `;


export default Tabs;
