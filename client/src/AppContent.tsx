import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { FullRover } from './models/rovers';

interface Option {
    value: string,
    label: string
}

interface AppContextType {
    setRovers: (rovers: FullRover[]) => void;
    rovers: FullRover[];
}

export const AppContext = React.createContext<AppContextType>({
    rovers: [],
    setRovers: () => {},
})

function AppContent() {
    const [rovers, setRovers] = useState<FullRover[]>([]); 

    useEffect(() => {
        axios.get("/rovers")
            .then((response) => {
                setRovers(response.data.rovers);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    function getOptions(): Option[]{
        const options: Option[] = [];
        for (let i = 0; i < rovers.length; i++){
            const option: Option = {
                value: rovers[i].name,
                label: rovers[i].name
            }
            options.push(option);
        }
        return options;
    }

    return (
        <AppContext.Provider value = {{rovers, setRovers}}>
            <Select options={getOptions()} />
        </AppContext.Provider>
    );
}

export default AppContent;