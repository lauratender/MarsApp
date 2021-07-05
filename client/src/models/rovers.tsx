import React from 'react';

import { Camera } from "./camera"

interface FullRover {
    id: number;
    name: string;
    landing_date: string;
    launch_date: string;
    status: string;
    max_sol: number;
    max_date: string;
    total_photos: number;
    cameras: Camera[];
}

export interface Rover{
    id: number;
    name: string;
    cameras: string[]
}

export function extractDataFromRovers(rovers: FullRover[]): Map<string, Rover>{
    let resRoverMap = new Map();
    for (let i = 0; i < rovers.length; i++){
        const roverName = rovers[i].name;

        const cameras: string[] = [];
        for (let camera of rovers[i].cameras){
            cameras.push(camera.name);
        }

        const rover: Rover = {
            id: rovers[i].id,
            name: rovers[i].name,
            cameras: cameras
        }
        resRoverMap.set(roverName, rover);
    }
    return resRoverMap;
}

export function extractCamerasFromRovers(rovers: FullRover[]): string[] {
    const cameras = new Set<string>();
    for (let i = 0; i < rovers.length; i++){
        for (let camera of rovers[i].cameras){
            cameras.add(camera.name);
        }
    }
    const resCameras: string[] = Array.from(cameras);
    return resCameras;
}