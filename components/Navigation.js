import { styled } from '@stitches/react';
import { UserButton } from '@clerk/nextjs';
import NavigationButton from './NavigationButton';

import {
  IoStorefront,
  IoCalendar,
  IoBarChart,
  IoShieldCheckmark,
  IoPeople,
  IoPricetags,
  IoPrism,
  IoReceipt,
  IoSettings,
  IoLayers,
} from 'react-icons/io5';

/* * */
/* NAVIGATION */
/* Explanation needed. */
/* * */

/* */
/* STYLES */

const Container = styled('div', {
  position: 'fixed',
  top: '0',
  left: '0',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  justifyContent: 'stretch',
  height: '100%',
  width: '100%',
});

const Sidebar = styled('div', {
  width: '250px',
  minWidth: '250px',
  maxWidth: '250px',
  backgroundColor: '$gray1',
  padding: '$lg',
  boxShadow: '$md',
  zIndex: 999,
});

const NavContainer = styled('div', {
  display: 'grid',
  gap: '$md',
  marginTop: '$lg',
});

const AppContainer = styled('div', {
  width: '100%',
  padding: '50px',
  overflow: 'scroll',
  backgroundColor: '$gray0',
});

export default function Navigation({ children }) {
  return (
    <Container>
      <Sidebar>
        <UserButton showName />
        <NavContainer>
          <NavigationButton icon={<IoStorefront />} label={'Home'} destination={'/'} />
          <NavigationButton disabled icon={<IoCalendar />} label={'Planeamento'} destination={'/planning'} />
          <NavigationButton disabled icon={<IoBarChart />} label={'Relatórios'} destination={'/reports'} />
          <NavigationButton disabled icon={<IoPricetags />} label={'Produtos'} destination={'/products'} />
          <NavigationButton disabled icon={<IoPeople />} label={'Clientes'} destination={'/customers'} />
          <NavigationButton icon={<IoShieldCheckmark />} label={'Colaboradores'} destination={'/users'} />
          <NavigationButton disabled icon={<IoPrism />} label={'Equipamentos'} destination={'/devices'} />
          <NavigationButton disabled icon={<IoReceipt />} label={'Transações'} destination={'/transactions'} />
          <NavigationButton disabled icon={<IoLayers />} label={'Layouts'} destination={'/layouts'} />
          <NavigationButton disabled icon={<IoSettings />} label={'Definições'} destination={'/settings'} />
        </NavContainer>
      </Sidebar>
      <AppContainer>{children}</AppContainer>
    </Container>
  );
}
