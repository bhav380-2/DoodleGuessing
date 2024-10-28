// utils/mlModel.js
import * as tf from '@tensorflow/tfjs';

let model;
export const loadModel = async () => {
    model = await tf.loadLayersModel('path/to/your/model.json');
};

export const predictDoodle = async (drawingData) => {
    // Mock prediction function
    return [
        { label: 'Cat', probability: 0.9 },
        { label: 'Dog', probability: 0.05 },
        { label: 'House', probability: 0.03 },
    ];
};
