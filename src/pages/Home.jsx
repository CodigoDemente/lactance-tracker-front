import React, { useContext, useEffect, useState, useCallback } from 'react';
import {  useNavigate } from "react-router-dom";
import styled from 'styled-components';
import UserContext from '../hooks/UserContext';
import Cookies from 'js-cookie';
import { get_childs, post_meal } from '../api/childs';
import { parseToken } from '../utils/parserToken';
import Board from '../containers/Board';
import Error from '../containers/Error';

const Home = () => {

  const token = Cookies.get('token')

  const [tab, setTab] = useState(0);
  const { userId, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [errorAPICall, setErrorAPICall] = useState('');
  
  const [submittedForm, setSubmittedForm] = useState(false);
  const [childs, setChilds] = useState(null);


  const onChangeTab = (e) => {
    setTab(e.target.value);
  }
  const apiPostMeal = useCallback(async (type, tab, date = null) => {
    setLoading(true)
    const response = await post_meal(childs[tab].id, type, date);
    if (response) {
      setSubmittedForm(true);
      setErrorAPICall(false)
      setLoading(false)
      setTimeout(() => {setSubmittedForm(false)}, 800)
    }
    else {
      setErrorAPICall('Something went wrong when registering lactance!')
      setLoading(false)
    }
  }, [childs]);
 
  const apiGetChilds = useCallback(async () => {
    if (userId) {
      setLoading(true)
      const response = await get_childs(userId);
      if (response) {
        setChilds(response);
        setErrorAPICall(false);
        setLoading(false)
      }
      else {
        setErrorAPICall('Something went wrong when getting your data!')
        setLoading(false)
      }
    }
  }, [userId]);



  useEffect(() => { 
    if (!token) {
      navigate('/login');
    } else {
      if (!userId) {
        const parsedToken = parseToken(token);
        setUser(parsedToken.sub);
      }
      apiGetChilds();
    }
  }, [token, setUser, userId]);

  if (loading) {
    return <div>Loading...</div>
  }

  if (errorAPICall) {
    return (
      <Error
        errorMessage={errorAPICall}
      />
    )
  }

  if(!childs || !childs.length) {
    return (
      <PageContainer>
        <div>No data to show</div>
      </PageContainer>
    )  
  }

  return (
    <PageContainer>
      {childs && childs.length &&
        <Board
          apiPostMeal={apiPostMeal}
          childs={childs}
          userId={userId}
        submittedForm={submittedForm}
        tab={tab}
        onChangeTab={onChangeTab}
        />}
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

export default Home;
