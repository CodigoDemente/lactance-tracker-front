import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { colors } from '../styles/colors';
import Paragraph from '../components/Paragraph';
import { device } from '../styles/breakpoints';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';


const List = () => {

  const { childId } = useParams();
  const [data, setData] = useState();
  const [sortOrder, setSortOrder] = useState('asc');
  const token = Cookies.get('token')

  const handleSort = () => {
    data = data.sort((a, b) => {
      const timeA = new Date(a.date);
      const timeB = new Date(b.date);
      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });

    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

    useEffect(() => {
      const fetchData = async () => {
        const settings = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ token }`
            },
        };
        const response = await fetch(`https://lactance-tracker-back-dev-frat.2.ie-1.fl0.io/childs/${childId}/meals`, settings);
        const body = await response.json();
        setData(body);
      };
  
      fetchData();
  }, []);
    
const renderTable = () => {
    if (data && data.length) {
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
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.date}</TableCell>
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