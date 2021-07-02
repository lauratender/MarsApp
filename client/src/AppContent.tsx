import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Select, {ValueType} from 'react-select';
import { Rover } from './models/rovers';
import { extractDataFromRovers, extractCamerasFromRovers } from './models/rovers'

interface Option {
    value: string,
    label: string,
    isdisabled: boolean
}

interface AppContextType {
    setRovers: (rovers: Map<string, Rover>) => void;
    rovers: Map<string, Rover>;
}

export const AppContext = React.createContext<AppContextType>({
    rovers: new Map(),
    setRovers: () => {},
})

function AppContent() {
    const [rovers, setRovers] = useState<Map<string, Rover>>(new Map()); 
    const [selectedRoverOption, setSelectedRoverOption] = useState<ValueType<Option, false>>(null);
    const [selectedOption, setSelectedOption] = useState<ValueType<Option, false>>(null);
    const [cameras, setCameras] = useState<string[]>([]);
    let test: string = "null";

    useEffect(() => {
        axios.get("/rovers")
            .then((response) => {
                const roversResp = response.data.rovers
                setRovers(extractDataFromRovers(roversResp));
                setCameras(extractCamerasFromRovers(roversResp));
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    function getRoverOptions(): Option[]{
        const options: Option[] = [];
        rovers.forEach((value: Rover, key: string) => {
            const option: Option = {
                value: key,
                label: key,
                isdisabled: false
            }
            options.push(option);
        });
        return options;
    }

    function getCameraOptions(): Option[]{
        const options: Option[] = [];
        
        let selectedRover = null;
        if (selectedRoverOption)
            selectedRover = rovers.get(selectedRoverOption.value)
            

        for (let i = 0; i < cameras.length; i++){

            let isDisabled: boolean = true;
            if (selectedRover && (selectedRover.cameras.includes(cameras[i])))
                isDisabled = false;

            const option: Option = {
                value: cameras[i],
                label: cameras[i],
                isdisabled: isDisabled
            }
            options.push(option);
        }
        return options;
    }

    function handleChange(option: ValueType<Option, false>): void {
        setSelectedRoverOption(option);
        getCameraOptions();
    }

    return (
        <AppContext.Provider value = {{rovers, setRovers}}>
            <Select 
                placeholder="Select Rover" 
                options={getRoverOptions()} 
                value = {selectedRoverOption} 
                onChange={handleChange}
            />
            <Select 
                placeholder="Select Camera" 
                options={getCameraOptions()}
                value = {selectedOption} 
                onChange={setSelectedOption}
                isOptionDisabled={(option) => option.isdisabled}
            />
        </AppContext.Provider>
    );
}

export default AppContent;