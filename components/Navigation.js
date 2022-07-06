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
  IoLocation,
  IoBalloon,
  IoBookmarks,
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
  top: 0,
  left: 0,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  justifyContent: 'stretch',
  height: '100%',
  width: '100%',
});

const Sidebar = styled('div', {
  width: '275px',
  minWidth: '275px',
  maxWidth: '275px',
  backgroundColor: '$gray0',
  padding: '$lg',
  boxShadow: '$md',
  zIndex: 999,
  overflowY: 'scroll',
});

const NavContainer = styled('div', {
  display: 'grid',
  gap: '$md',
  marginTop: '$lg',
});

const AppContainer = styled('div', {
  width: '100%',
  padding: '50px',
  backgroundColor: '$gray1',
  overflowY: 'scroll',
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
          <NavigationButton icon={<IoReceipt />} label={'Transações'} destination={'/transactions'} />
          <NavigationButton icon={<IoPricetags />} label={'Produtos'} destination={'/products'} />
          <NavigationButton icon={<IoPeople />} label={'Clientes'} destination={'/customers'} />
          <NavigationButton icon={<IoBookmarks />} label={'Contas Correntes'} destination={'/checking_accounts'} />
          <NavigationButton icon={<IoLocation />} label={'Locais'} destination={'/locations'} />
          <NavigationButton icon={<IoBalloon />} label={'Descontos'} destination={'/discounts'} />
          <NavigationButton icon={<IoShieldCheckmark />} label={'Colaboradores'} destination={'/users'} />
          <NavigationButton icon={<IoLayers />} label={'Layouts'} destination={'/layouts'} />
          <NavigationButton icon={<IoPrism />} label={'Equipamentos'} destination={'/devices'} />
          <NavigationButton disabled icon={<IoSettings />} label={'Definições'} destination={'/settings'} />
        </NavContainer>
      </Sidebar>
      <AppContainer>{children}</AppContainer>
    </Container>
  );
}
