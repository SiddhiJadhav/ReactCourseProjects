import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
// import { useState, useEffect } from 'react';
import Homepage from './pages/HomePage';
import Product from './pages/product';
import Pricing from './pages/pricing';
import PageNotFound from './pages/PageNotFound';
import Login from './pages/Login';
import AppLayout from './pages/AppLayout';
import CityList from './Components/CityList';
import CountryList from './Components/CountryList';
import City from './Components/City';
import Form from './Components/Form';
import { CitiesContextProvider } from './contexts/CitiesContext';
import { AuthContextProvider } from './contexts/authContext';
import ProtectedRoute from './pages/ProtectedRoute';

export default function App() {
  return (
    <>
      <AuthContextProvider>
        <CitiesContextProvider>
          <BrowserRouter>
            <Routes>
              <Route index element={<Homepage />} />
              <Route
                path="app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate replace to="cities" />} />
                <Route path="cities" element={<CityList />} />
                <Route path="cities/:id" element={<City />} />
                <Route path="countries" element={<CountryList />} />
                <Route path="form" element={<Form />} />
              </Route>
              <Route path="products" element={<Product />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="login" element={<Login />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </BrowserRouter>
        </CitiesContextProvider>
      </AuthContextProvider>
    </>
  );
}
