export interface Camera {
    id: number;
    name: string;
    rover_id: number;
    full_name: string;
}

export interface CameraRover {
    id: number;
    name: string;
    landing_date: string;
    launch_date: string;
    status: string;
}

export function checkCameraType (cameraType: string): void {
    if (!(cameraType.toLowerCase() in Cameras)){
        throw "Invalid camera type.";
    }
}

// Part 3 - 1
export enum Cameras {
    fhaz = 0,
    rhaz,
    mast,
    chemcam,
    mahli,
    mardi,
    navcam,
    pancam,
    minites,
}