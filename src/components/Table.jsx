import React from 'react';
import styled from 'styled-components';
import { colors } from '../styles/colors';


const Table = ({body, headers, onDelete}) => {
  return (
    <TableContainer>
          {body && <StyledTable>
            <thead>
            <tr>
            {headers && headers.map((header, i) =>
                <TableHeader>{header}</TableHeader>
            )}
            </tr>
            </thead>
            <tbody>
              {body.map((item, i) =>
                <tr key={i}>
                      {Object.values(item).map((value, i) =>
                        <TableCell>{value}</TableCell>
                      )}
                </tr>)
              }

            </tbody>
          </StyledTable>}
    </TableContainer>
  )
}
const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  
`
const StyledTable = styled.table`
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

export default Table;