/* eslint-disable react/prop-types */
import CountryItem from './CountryItem';
import Spinner from './Spinner';
import Message from './Message';
import styles from './CountryList.module.css';
import { useCities } from '../contexts/CitiesContext';

export default function CountryList() {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;

  if (!cities.length)
    return <Message message={'Add your first city by clicking on Map'} />;

  let countries = [];

  countries = cities.reduce((arr, city) => {
    if (!arr.map(el => el.country).includes(city.country)) {
      return [...arr, { country: city.country, emoji: city.emoji }];
    } else {
      return arr;
    }
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map(function (country) {
        return <CountryItem country={country} key={country.country} />;
      })}
    </ul>
  );
}
