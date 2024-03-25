import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { colors } from '../styles/colors';
import Paragraph from '../components/Paragraph';
import { device } from '../styles/breakpoints';
import { useParams } from 'react-router-dom';

let data = [
  {
    meal: 'tits',
    time: '15:04'
  },
  {
    meal: 'bibs',
    time: '13:09'
  },
  {
    meal: 'tits',
    time: '15:04'
  },
  {
    meal: 'bibs',
    time: '13:09'
  },
  {
    meal: 'tits',
    time: '15:04'
  },
  {
    meal: 'bibs',
    time: '13:09'
  },
];

const List = () => {

  const { id } = useParams();
  console.log(id, 'ID');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = () => {
    data = data.sort((a, b) => {
      const timeA = new Date(`1970/01/01 ${a.time}`);
      const timeB = new Date(`1970/01/01 ${b.time}`);
      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });

    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

    // useEffect(() => {
    //   const fetchData = async () => {
    //     const response = await fetch(`https://api.ubervo.es/child/${childId}/meals`);
    //     const newData = await response.json();
    //     setData(newData);
    //   };
  
    //   fetchData();
  // }, []);
    
const renderTable = () => {
    if (data) {
      return (
        <Table>
          <thead>
            <tr>
              <TableHeader>Meal</TableHeader>
              <TableHeader onClick={handleSort}>Time</TableHeader>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => 
              <tr key={i}>
                <TableCell>{item.meal}</TableCell>
                <TableCell>{item.time}</TableCell>
              </tr>)
            }
          </tbody>
        </Table>
      );
    }
  };
     
 

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