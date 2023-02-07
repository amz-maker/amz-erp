import { AmzDataType } from '../../hook/useAmzForm';
import { createContext } from 'react';

const context = createContext<AmzDataType>([{}, (mode, source) => {}, (() => undefined) as any, () => {}, () => {}, () => {}]);
export default context;
