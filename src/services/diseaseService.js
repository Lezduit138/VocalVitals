import { functions } from '../lib/firebase';
import { httpsCallable } from 'firebase/functions';

const getDiseaseInfoFn = httpsCallable(functions, 'getDiseaseInfo');
const getAllDiseasesFn = httpsCallable(functions, 'getAllDiseases');

export const getDiseaseInfo = async (diseaseId) => {
  const { data } = await getDiseaseInfoFn({ diseaseId });
  return data.disease;
};

export const getAllDiseases = async () => {
  const { data } = await getAllDiseasesFn({});
  return data.diseases;
};
