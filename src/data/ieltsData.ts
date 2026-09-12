import data from './ieltsData.json';
import { IeltsDatabase } from '../types/ielts';
import { readingTests } from './readingTestsData';

export const ieltsDatabase: IeltsDatabase = {
  ...(data as unknown as IeltsDatabase),
  reading: readingTests,
};
