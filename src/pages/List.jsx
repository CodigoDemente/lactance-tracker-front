import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { delete_meal, get_meals } from '../api/childs';
import Error from '../containers/Error';
import { getLocalIsoString } from '../utils/parserTime';
import Tabs from '../components/Tabs';
import Table from '../components/Table';

const handleSort = (data) => {
    const sortedData = data.sort((a, b) => {
    const timeA = getLocalIsoString(a.date);
    const timeB = getLocalIsoString(b.date);
    return timeB - timeA;
  });

  const groupedData = sortedData.reduce((acc, item) => {
    const date = getLocalIsoString(item.date).split('T')[0];
    const time = getLocalIsoString(item.date).split('T')[1].slice(0, 5);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push({ ...item, date: time });
    return acc;
  }, {});

  return groupedData;
};

const List = () => {
  const { childId } = useParams();
  const [data, setData] = useState();
  const [tab, setTab] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorAPICall, setErrorAPICall] = useState(false);

  const onChangeTab = (e) => {
    setTab(e.target.value);
  }

  const apiGetMeals = useCallback(async () => {
    setLoading(true)
    const response = await get_meals(childId);
    if (response) {
      setData(handleSort(response));
      setTab(Object.keys(handleSort(response))[0]);
      setErrorAPICall(false);
      setLoading(false)
    }
    else {
      setErrorAPICall('Something went wrong when getting your data!')
      setLoading(false)
    }
  }, [childId]);

   const apiDeleteMeal = useCallback(async (id) => {
    setLoading(true)
    const response = await delete_meal(childId, id);
     if (response) {
      apiGetMeals();
      setErrorAPICall(false);
      setLoading(false)
    }
    else {
      setErrorAPICall('Something went wrong when getting your data!')
      setLoading(false)
    }
  }, [childId]);

  useEffect(() => {
      apiGetMeals();
  }, []);

  const renderTabs = () => {
    if (data) {
       const tabs = Object.keys(data).map((key, i) => ({
          name: new Date(key).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
          id: i,
          value: key
       }));
      return (
        <Tabs
          tabs={tabs}
          onChangeTab={onChangeTab}
          isActive={tab}
        />
      );
    }
  };

    
  const renderTable = () => {
    if (data && data[tab]) { 
      const body = data[tab].map((item) => {
        return {
          meal: item.type,
          time: item.date,
          action: <button onClick={() => apiDeleteMeal(item.id)}>delete</button>,
        }
      })
      return (
        <Table
          body={body}
          headers={['Meals', 'Time', 'Actions']}
          onDelete={apiDeleteMeal}
        />
      );
    }
  };
   
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
 
  return (
    <PageContainer>
      {renderTabs()}
      {renderTable()}
    </PageContainer>
  )
}
const PageContainer = styled.div`
  padding-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  justify-content: center;
  width: 100%; 
`
export default List;