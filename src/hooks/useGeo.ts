import {useContext} from 'react';
import {GeoContext} from '../contexts/GeoContext';

const useGeo = () => {
  const geoData = useContext(GeoContext);
  return geoData;
};

export default useGeo;
