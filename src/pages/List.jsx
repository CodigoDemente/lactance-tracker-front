import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { colors } from '../styles/colors';
import Paragraph from '../components/Paragraph';
import { device } from '../styles/breakpoints';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { delete_meal, get_meals } from '../api/childs';
import Error from '../containers/Error';
import { getLocalIsoString } from '../utils/parserTime';


const List = () => {

  const { childId } = useParams();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [errorAPICall, setErrorAPICall] = useState(false);

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

  const apiGetMeals = useCallback(async () => {
    setLoading(true)
    const response = await get_meals(childId);
    if (response) {
      setData(handleSort(response));
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
    
const renderTable = () => {
    if (data) {
      return (
        <div>
          {Object.entries(data).map(([key, value]) => ( 
            <div>
            <p>{new Date(key).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</p>
              <Table>
          <thead>
            <tr>
              <TableHeader>Meal</TableHeader>
              <TableHeader>Time</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody>
            {value.map((item, i) => 
              <tr key={i}>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>
                  <button onClick={()=> apiDeleteMeal(item.id)}>
                    delete
                  </button>
                </TableCell>
              </tr>)
            }

          </tbody>
              </Table>
            </div>
          ))
          }
          </div>
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
    <TableContainer>
      {renderTable()}
    </TableContainer>
  )
}
const TableContainer = styled.div`
  padding-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  
`
const Table = styled.table`
  width: 60%;
`

const TableHeader = styled.th`
  font-size: 22px;
  padding: 8px;
  border: 1px solid ${colors.lightgrey};
  border-radius: 4px;
  background-color: ${colors.primary};
  color: ${colors.white};
`

const TableCell = styled.td`
  text-align: center;
  padding: 4px;
  font-size: 16px;
  border: 1px solid ${colors.lightgrey};
  border-radius: 4px;
`

export default List;