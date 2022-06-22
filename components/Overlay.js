import { styled } from '@stitches/react';
import { useContext } from 'react';
import { Appstate } from '../context/Appstate';

/* * */
/* OVERLAY */
/* Explanation needed. */
/* * */

/* */
/* STYLES */

const Container = styled('div', {
  position: 'fixed',
  top: '0',
  left: '0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  padding: '50px',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  zIndex: 100,
});

/* */
/* LOGIC */

export default function Overlay() {
  //
  const appstate = useContext(Appstate);

  return appstate.hasOverlay ? <Container>{appstate.overlay}</Container> : null;
}
