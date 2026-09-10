import data from './ieltsData.json';
import { IeltsDatabase } from '../types/ielts';

export const ieltsDatabase: IeltsDatabase = data as unknown as IeltsDatabase;
