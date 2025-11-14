import { useContext } from "react";
import { DataContext, DataContextType } from "../data";


export const useData = (): DataContextType => {
    const context = useContext(DataContext);

    if(!context) {
        throw new Error('useData must be used in a provider')
    }

    return context;
}