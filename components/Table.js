import { useEffect } from 'react';
import { styled } from '../stitches.config';
import Loading from './Loading';

/* * */
/* TABLE */
/* Explanation needed. */
/* * */

const Container = styled('div', {
  width: '100%',
  boxShadow: '$md',
  borderRadius: '$md',
  overflow: 'hidden',
});

const Header = styled('div', {
  backgroundColor: '$gray2',
  fontWeight: '$bold',
  textTransform: 'uppercase',
  fontSize: '14px',
});

const Body = styled('div', {
  width: '100%',
});

const Row = styled('div', {
  display: 'grid',
  justifyItems: 'stretch',
  alignItems: 'stretch',
  gap: '$md',
  padding: '$md',
  borderBottomWidth: '$md',
  borderBottomStyle: 'solid',
  borderBottomColor: '$gray2',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '$gray1',
  },
});

const Cell = styled('div', {
  // backgroundColor: 'yellow',
});

export default function Table(props) {
  //

  const colsLength = 'repeat(' + props.columns.length + ', 1fr)';

  // function searchArray(e) {
  //   let filtered = [];
  //   const input = e.target.value.toLowerCase();
  //   if (input) {
  //     filtered = data.filter((el) => {
  //       return Object.values(el).some((val) =>
  //         String(val).toLowerCase().includes(input)
  //       );
  //     });

  //     log.textContent = JSON.stringify(filtered);
  //   }
  // }

  return props.data ? (
    <Container>
      <Header>
        <Row css={{ gridTemplateColumns: colsLength }}>
          {props.columns.map((col, index) => (
            <Cell key={index}>{col.label}</Cell>
          ))}
        </Row>
      </Header>
      <Body>
        {props.data?.map((row, index) => (
          <Row key={index} css={{ gridTemplateColumns: colsLength }} onClick={() => props.onRowClick(row)}>
            {props.columns.map((col, index) => (
              <Cell key={index}>{row[col.key] || '-'}</Cell>
            ))}
          </Row>
        ))}
      </Body>
    </Container>
  ) : (
    <Loading />
  );
}
