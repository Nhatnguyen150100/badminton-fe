import BaseContainer from '../base/BaseContainer';
import TheHeader from './TheHeader';
import { Outlet } from 'react-router-dom';

export default function TheLayout() {
  return (
    <>
      <TheHeader />
      <BaseContainer>
        <Outlet />
      </BaseContainer>
    </>
  );
}
