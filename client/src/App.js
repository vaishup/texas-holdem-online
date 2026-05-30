import React from 'react';
import AppRoutes from './components/routing/Routes';
import AppHeader from './components/navigation/AppHeader';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

const App = () => {
  return (
    <>
      <AppHeader />
      <AppRoutes />
    </>
  );
};

export default App;
