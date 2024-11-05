import React, { useState, useEffect, useRef } from 'react';
import { Redirect } from "react-router-dom";

import CanvasDraw from 'react-canvas-draw';
import axios from 'axios';
import jimp from 'jimp';
import '../css/drawingCanvas.css';
import * as tf from '@tensorflow/tfjs';

const DrawingCanvas = ({ speak, voice1, voice2, nextRound, doodle, timer, setShowScoreCard, setScore, setTotalRounds, round }) => {
    const [prevResult, setPrevResult] = useState("");
    const [result, setResult] = useState('');
    const [prediction, setPrediction] = useState([]);
    const myCanvas = useRef();

    // Use a ref to track already seen predictions
    const seenPredictions = useRef(new Set());
    useEffect(() => {
        // console.log(window.speechSynthesis.getVoices());
        if (timer % 4 === 0 &&  timer !== 40 && timer > 0 && !isCanvasEmpty()) {
            console.log("Predicting at time remaining: ", timer);
            getAnswer();
        }
    }, [timer]);

    const handlePredictions = async () => {
        for (let pred of prediction) {
            pred = pred.replaceAll('_', ' ');
            if (!seenPredictions.current.has(pred)) {
                setPrevResult(prev => `${prev} a ${pred}, `);
                seenPredictions.current.add(pred);
                setResult(pred);
                if(pred==doodle){
                    await speak("oh! its "+pred,voice1);
                    break;

                }else{
                    await speak("a " + pred, voice1);
                }
            }
        }
    };

    useEffect(() => {
        if (prediction.length > 0 && result != doodle) {
            handlePredictions()

        }
    }, [prediction]);

    useEffect(() => {
        if (result === doodle && result !== '') {
            setTimeout(async () => {
                // await speak('Hurrah !!!, guessed correctly.', voice2);
                setScore(prev => prev + 1);
                alert('press ok to continue')
                nextRound();
            }, 800);
        }
    }, [result]);

    const convertURIToImageData = (URI) => {
        return new Promise((resolve, reject) => {
            if (URI == null) return reject();
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const image = new Image();
            image.addEventListener('load', () => {
                canvas.width = image.width;
                canvas.height = image.height;
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
                resolve(context.getImageData(0, 0, canvas.width, canvas.height));
            }, false);
            image.src = URI;
        });
    };

    const getAnswer = async () => {
        const sketch = myCanvas.current.canvasContainer.children[1].toDataURL("image/png");
        try {
            const sketchData = await convertURIToImageData(sketch);
            const jimpImage = await jimp.read(sketchData);
            jimpImage.resize(64, 64, jimp.RESIZE_BEZIER);
            const buffer = await jimpImage.getBufferAsync(jimp.MIME_PNG);
            const base64 = buffer.toString('base64');
            const sketchDataURL = `data:image/png;base64,${base64}`;
            const sketch28RGBAdata = await convertURIToImageData(sketchDataURL);
            const data = Array.from(sketch28RGBAdata.data).filter((_, i) => i % 4 !== 3); // Keep only R, G, B channels
            const grayData = data.reduce((acc, _, i) => {
                if (i % 3 === 0) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    acc.push(Math.round(b / 255)); // Normalize to [0, 1]
                }
                return acc;
            }, []);

            // const tensor = tf.tensor(grayData).reshape([1, 64, 64, 1]);

            // const reshapedGrayData = tensor.arraySync();

            // console.log(reshapedGrayData); 

            // const url = 'https://doodlebackend-fast-api.onrender.com/predict'
            // const url = 'http://127.0.0.1:5000/predict';
         
            const url = 'http://127.0.0.1:8000/predict';
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({data : grayData})
            };
            const response = fetch(url, requestOptions).then(response=>response.json())
                            .then(data=>{
                                console.log("gotcha")
                                console.log(data);
                                setPrediction(data)
                })
            // const data = await response.json();
            // this.setState({ postId: data.id });
            // const response = await axios.post(url, JSON.stringify(grayData), {
            //     headers: { 'Content-Type': 'application/json' }
            // });

            // console.log(response);
            // console.log(response.data);

            // setPrediction(response.data);

            // console.log("Predictions received: ", response.data);
        } catch (error) {
            console.error("Error in getAnswer:", error);
        }
    };

    const isCanvasEmpty = () => {
        const saveData = myCanvas.current.getSaveData();
        return saveData.slice(1, 11) == `"lines":[]`;

    };

    const clearCanvas = () => {
        myCanvas.current.clear();
    };

    const canvasStyle = {
        // borderColor: 'aliceblue',
        // borderStyle: 'inset',
        width: '65vh',
        height: "65vh",
        backgroundColor: 'white',
        borderLeft:'2px solid lightgrey',
        // border: '1px solid black',
        // boxShadow: '0.5px 0.5px 0.5px 0.5px',
    };


    const stopPlay = () => {
        setShowScoreCard(true);
        setTotalRounds((prev) => round);
        setTimeout(() => {
            nextRound();
        }, 3000)
    }

    return (
        <div className='drawing'>
            <div className="canvas-box">

                <div className='button-container'>
                    <button className="btn btn-outline-primary btn-md eraser" onClick={clearCanvas}>
                        <i class="fa-solid fa-trash"></i> <span> clear</span>
                    </button>

                    <button onClick={() => stopPlay()}><i class="fa-solid fa-stop"></i> <span> Stop</span> </button>
                </div>

                <CanvasDraw
                    resize="false"
                    lazyRadius={0}
                    brushRadius={0.8}
                    brushColor={"rgb(0,0,255)"}
                    hideGrid={true}
                    style={canvasStyle}
                    ref={myCanvas}
                />


            </div>
            <div className="result">
                <h3>AI : Let me guess... </h3>
                <span>This is&nbsp;</span>
                <span>{prevResult.lastIndexOf(" a ") != -1 ? prevResult.substring(0, prevResult.lastIndexOf(" a ")).trim() : ""}</span>
                <span>{" a " + result}</span>
            </div>
        </div>
    );
};

export default DrawingCanvas;
