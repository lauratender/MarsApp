import express, { Express } from "express";
import axios from "axios";
import { API_KEY } from "./info";
import { checkCameraType } from "./models/camera";
import { Photo, reduceInfo } from "./models/photo";

export const router = express.Router();

router.get("/rovers", function (req, res) {

   const URL = `https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=${API_KEY}`;

   axios.get(URL)
      .then((response) => {
         const result = response.data;
         res.send(result);
      })
      .catch(error => {
         console.log(error) 
      });
});

router.get("/rovers/:rover/photos/:camera", function (req, res) {

   const roverName: string = req.params.rover;
   const cameraType: string = req.params.camera;

   checkCameraType(cameraType);

   const MAX_REQUESTS_NR = 30; 
   const requests = [];

    for (let i = 1; i <= MAX_REQUESTS_NR; i++){
        const URL = `https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}/photos?sol=${i}&camera=${cameraType}&api_key=${API_KEY}`;
        const request = axios.get(URL);
        requests.push(request);
    }

   axios.all(requests)
         .then(axios.spread((...responses) => {

            const result: Photo[] = [];
            let numberOfResults = 0;

            for (let response of responses){
               if (numberOfResults >= 5)
                     break;

               const resPhotos = reduceInfo(response.data.photos);
               numberOfResults += resPhotos.length;

               Array.prototype.push.apply(result, resPhotos);
               console.log(numberOfResults);
            }
            res.send(result.slice(0, 5));
         }))
         .catch(error => {
            console.log(error)
         });
});