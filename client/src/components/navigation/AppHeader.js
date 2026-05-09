import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import NavMenu from './NavMenu';
import useNavMenu from '../../hooks/useNavMenu';
import { useAuth } from '../../hooks/useAuth';
import globalContext from '../../context/global/globalContext';
import modalContext from '../../context/modal/modalContext';

const AppHeader = () => {
  const location = useLocation();
  const { userName, chipsAmount } = useContext(globalContext);
  const { openModal } = useContext(modalContext);
  const { logout } = useAuth();
  const [showNavMenu, openNavMenu, closeNavMenu] = useNavMenu();

  if (location.pathname === '/play') return null;

  const loggedIn = Boolean(userName);

  return (
    <>
      <Navbar
        loggedIn={loggedIn}
        chipsAmount={chipsAmount ?? 0}
        location={location}
        openModal={openModal}
        openNavMenu={openNavMenu}
      />
      {showNavMenu && (
        <NavMenu
          onClose={closeNavMenu}
          logout={logout}
          userName={userName}
          chipsAmount={chipsAmount ?? 0}
          openModal={openModal}
        />
      )}
    </>
  );
};

export default AppHeader;
