import { Camera } from "./camera";
import { CameraRover } from "./camera";

export interface Photo {
    id: number;
    src: string;
    earth_date: string;
    sol: number;
}

export interface InitialPhoto {
    id: number;
    sol: number;
    camera: Camera;
    img_src: string;
    earth_date: string;
    rover: CameraRover;
}

function toSmallerPhoto (jsonPhoto: InitialPhoto): Photo {
    const photoObj: Photo = {
        id : jsonPhoto.id,
        src : jsonPhoto.img_src,
        earth_date: jsonPhoto.earth_date,
        sol: jsonPhoto.sol
    };
    return photoObj;
}

export function reduceInfo(photos: InitialPhoto[]): Photo[] {
    const result: Photo[] = [];
    for (let i = 0; i < photos.length; i++){
        const photo: Photo = toSmallerPhoto(photos[i]);
        result.push(photo);
    }
    return result;
}