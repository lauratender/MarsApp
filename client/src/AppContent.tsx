import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Select, {ValueType} from 'react-select';
import { Rover } from './models/rovers';
import { extractDataFromRovers, extractCamerasFromRovers } from './models/rovers'
import { Photo } from './models/photo';

interface Option {
    value: string,
    label: string,
    isdisabled: boolean
}

interface AppContextType {
    setRovers: (rovers: Map<string, Rover>) => void;
    rovers: Map<string, Rover>;
    setCameras: (cameras: string[]) => void;
    cameras: string[];
}

export const AppContext = React.createContext<AppContextType>({
    rovers: new Map(),
    setRovers: () => {},
    cameras: [],
    setCameras: () => {}
})

function AppContent() {
    const [rovers, setRovers] = useState<Map<string, Rover>>(new Map()); 
    const [selectedRoverOption, setSelectedRoverOption] = useState<ValueType<Option, false>>(null);
    const [selectedCameraOption, setSelectedCameraOption] = useState<ValueType<Option, false>>(null);
    const [cameras, setCameras] = useState<string[]>([]);
    const [photos, setPhotos] = useState<Photo[]>([]);
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

    function makePhotosRequest(roverName: string, cameraType: string): void {
        axios.get(`/rovers/${roverName}/photos/${cameraType}`)
            .then((response) => {
                const photosResp: Photo[] = response.data;
                setPhotos(photosResp);
            })
            .catch(error => {
                console.log(error);
            });
    }

    function addPhotoInHtml(photo: Photo): void {
        const photosContainer = document.getElementById("PhotosContainer");
        const photoHtml = `<div> <img src = "${photo.src}"> <p>Photo with id ${photo.id} made on ${photo.earth_date}.</p> </div>`
        if (photosContainer)
            photosContainer.innerHTML += photoHtml;
    }

    function renderPhotos(): void {
        for (let photo of photos){
            addPhotoInHtml(photo);
        }
    }

    function getMarsPhotos(){
        let roverName: string = "";
        let cameraType: string = "";

        if (selectedRoverOption)
            roverName = selectedRoverOption.value;
        if (selectedCameraOption)
            cameraType = selectedCameraOption.value;

        setSelectedRoverOption(null);
        setSelectedCameraOption(null);
    
        makePhotosRequest(roverName, cameraType);
        const photosContainer = document.getElementById("PhotosContainer");
        const message =  `<p> Photos made with rover ${roverName} and camera ${cameraType}, displaying ${photos.length} results: </p>`;
       
        if (photosContainer)
            photosContainer.innerHTML = message;

        renderPhotos();
    }

    return (
        <AppContext.Provider value = {{rovers, setRovers, cameras, setCameras}}>
            <Select 
                placeholder="Select Rover" 
                options={getRoverOptions()} 
                value = {selectedRoverOption} 
                onChange={handleChange}
            />
            <Select 
                placeholder="Select Camera" 
                options={getCameraOptions()}
                value = {selectedCameraOption} 
                onChange={setSelectedCameraOption}
                isOptionDisabled={(option) => option.isdisabled}
            />
            <button onClick={() => getMarsPhotos()}>
                Submit
            </button> 
            <div id = "PhotosContainer"></div>
        </AppContext.Provider>
    );
}

export default AppContent;