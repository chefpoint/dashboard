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
          <NavigationButton disabled icon={<IoCalendar />} label={'Planning'} destination={'/planning'} />
          <NavigationButton disabled icon={<IoBarChart />} label={'Reports'} destination={'/reports'} />
          <NavigationButton icon={<IoReceipt />} label={'Transactions'} destination={'/transactions'} />
          <NavigationButton icon={<IoPricetags />} label={'Products'} destination={'/products'} />
          <NavigationButton icon={<IoPeople />} label={'Clients'} destination={'/customers'} />
          <NavigationButton icon={<IoBookmarks />} label={'Checking Accounts'} destination={'/checking_accounts'} />
          <NavigationButton icon={<IoLocation />} label={'Locations'} destination={'/locations'} />
          <NavigationButton icon={<IoBalloon />} label={'Discounts'} destination={'/discounts'} />
          <NavigationButton icon={<IoShieldCheckmark />} label={'Users'} destination={'/users'} />
          <NavigationButton icon={<IoLayers />} label={'Layouts'} destination={'/layouts'} />
          <NavigationButton icon={<IoPrism />} label={'Devices'} destination={'/devices'} />
          <NavigationButton disabled icon={<IoSettings />} label={'Settings'} destination={'/settings'} />
        </NavContainer>
      </Sidebar>
      <AppContainer>{children}</AppContainer>
    </Container>
  );
}
