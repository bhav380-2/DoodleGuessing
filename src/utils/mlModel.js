// utils/mlModel.js
import * as tf from '@tensorflow/tfjs';

let model;
const loadModel = async () => {
    model = await tf.loadLayersModel('../model/model.json');
};

export const predictDoodle = async (drawingData) => {
    // Mock prediction function
    await loadModel();
    console.log("this is my model");
    console.log(model);

};



