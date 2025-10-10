import { useContext } from 'react';
import MisRequisicionesContext from '../context/MisRequisicionesProvider';
const useMisRequisiciones = () => {
  return useContext(MisRequisicionesContext);
};
export default useMisRequisiciones;