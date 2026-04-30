import { functions } from '../lib/firebase';
import { httpsCallable } from 'firebase/functions';

const shareReportFn = httpsCallable(functions, 'shareReport');
const generatePDFFn = httpsCallable(functions, 'generatePDF');

export const shareReport = async (resultId) => {
  const { data } = await shareReportFn({ resultId });
  return data; // { shareUrl, expiresAt }
};

export const generatePDF = async (resultId) => {
  const { data } = await generatePDFFn({ resultId });
  return data.pdfUrl;
};
