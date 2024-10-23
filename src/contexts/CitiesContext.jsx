/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
};

function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: action.payload };
    case 'cities/loaded':
      return { ...state, isLoading: false, cities: action.payload };
    case 'city/created':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
      };
    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter(city => city.id != action.payload),
      };
    case 'city/currentCity':
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };

    default:
      throw new Error('Unknown action type');
  }
}

const CityContext = createContext();

function CitiesContextProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCity() {
      try {
        dispatch({ type: 'loading', payload: true });
        const res = await fetch('http://localhost:8000/cities');
        const data = await res.json();
        dispatch({ type: 'cities/loaded', payload: data });
      } catch (error) {
        alert('Error while loading cities data');
      }
    }
    fetchCity();
  }, []);

  async function createCity(newCity) {
    try {
      dispatch({ type: 'loading', payload: true });
      const res = await fetch('http://localhost:8000/cities', {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      dispatch({ type: 'city/created', payload: data });
    } catch (error) {
      console.log(error);

      alert('Error while Adding city data');
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: 'loading', payload: true });
      await fetch(`http://localhost:8000/cities/${id}`, {
        method: 'DELETE',
      });

      dispatch({ type: 'city/deleted', payload: id });
    } catch (error) {
      console.log(error);

      alert('Error while deleting city data');
    }
  }

  async function setCurrentCity(data) {
    dispatch({ type: 'loading', payload: true });

    try {
      dispatch({ type: 'city/currentCity', payload: data });
    } catch {
      alert('Error while loading city data');
    }
  }
  return (
    <CityContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        createCity,
        deleteCity,
        setCurrentCity,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

function useCities() {
  const context = useContext(CityContext);
  if (context == undefined)
    throw new Error('CityContext cannot be used outside of CityProvider');
  return context;
}

export { CitiesContextProvider, useCities };
