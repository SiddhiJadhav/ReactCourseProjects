/* eslint-disable react/prop-types */
import Spinner from './Spinner';
import Message from './Message';
import CityItem from './CityItem';
import { useCities } from '../contexts/CitiesContext';
import styles from './CityList.module.css';
export default function CityList() {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;

  if (!cities.length)
    return <Message message={'Add your first city by clicking on Map'} />;
  return (
    <ul className={styles.cityList}>
      {cities.map(function (city) {
        return <CityItem city={city} key={city.id} />;
      })}
    </ul>
  );
}
