import React, { useState, useEffect, useRef } from 'react';
import { Redirect } from "react-router-dom";

import CanvasDraw from 'react-canvas-draw';
import axios from 'axios';
import jimp from 'jimp';
import '../css/drawingCanvas.css';

const DrawingCanvas = ({ speak, voice1, voice2, nextRound, doodle, timer, setShowScoreCard, setScore, setTotalRounds, round }) => {
    const [prevResult, setPrevResult] = useState("");
    const [result, setResult] = useState('');
    const [prediction, setPrediction] = useState([]);
    const myCanvas = useRef();

    // Use a ref to track already seen predictions
    const seenPredictions = useRef(new Set());
    useEffect(() => {
        console.log(window.speechSynthesis.getVoices());
        if (timer % 4 === 0 && timer !== 40 && timer > 0 && !isCanvasEmpty()) {
            console.log("Predicting at time remaining: ", timer);
            getAnswer();
        }
    }, [timer]); // Effect depends on timer

    const handlePredictions = async () => {
        for (let pred of prediction) {
            pred = pred.replace('_', ' ');
            if (!seenPredictions.current.has(pred)) {
                setPrevResult(prev => `${prev} a ${pred}, `);
                seenPredictions.current.add(pred);
                setResult(pred);
                await speak("a " + pred, voice1);
                if (pred == doodle) {
                    break;
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
                await speak('Hurrah !!!, guessed correctly.', voice2);
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

            const url = 'http://127.0.0.1:5000/predict';
            const response = await axios.post(url, JSON.stringify(grayData), {
                headers: { 'Content-Type': 'application/json' }
            });

            setPrediction(response.data);

            console.log("Predictions received: ", response.data);
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
        width: '70vh',
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



// export default DrawingCanvas;
// import React, { useState, useEffect, useRef } from 'react';
// import { Redirect } from "react-router-dom";
// import CanvasDraw from 'react-canvas-draw';
// import axios from 'axios';
// import jimp from 'jimp';
// import '../css/drawingCanvas.css';
// import trollComments from '../files/trollComments.json';

// const DrawingCanvas = ({ speak, voice1, voice2,voice3, isSpeaking, nextRound, doodle, timer, setShowScoreCard, setScore, setTotalRounds, round }) => {
//     const [prevResult, setPrevResult] = useState("");
//     const [result, setResult] = useState('');
//     const [prediction, setPrediction] = useState([]);
//     const myCanvas = useRef();
//     const [flag, setFlag] = useState(0);
//     const [canTroll, setCanTroll] = useState(true);
//     const seenPredictions = useRef(new Set());

//     // Effects
//     useEffect(() => {
//         console.log(window.speechSynthesis.getVoices());
//         if (timer % 4 === 0 && timer !== 40) {
//             console.log("Predicting at time remaining: ", timer);
//             getAnswer();
//         }
//     }, [timer]);

//     useEffect(() => {
//         if (prediction.length > 0 && result !== doodle) {
//             handlePredictions();
//         }
//     }, [prediction]);

//     useEffect(() => {
//         if (result === doodle && result !== '') {
//             handleCorrectGuess();
//         } else if (canTroll) {
//             handleTrolling();
//         }
//     }, [result]);

//     // Prediction Handling
//     const handlePredictions = async () => {
//         const modelPredicted = await processPredictions();
//         if (!modelPredicted) {
//             updateTrollFlag();
//         } else {
//             if (flag !== 0) setFlag((prev) => prev - 1);
//         }

//         handleTrolling();
//     };

//     const processPredictions = async () => {
//         let modelPredicted = false;
//         for (let pred of prediction) {
//             pred = pred.replace('_', ' ');
//             if (!seenPredictions.current.has(pred)) {
//                 modelPredicted = true;
//                 setPrevResult(prev => `${prev} a ${pred}, `);
//                 seenPredictions.current.add(pred);
//                 setResult(pred);
//                 await speak("a " + pred, voice1);
//                 if (pred === doodle) break;
//             }
//         }
//         return modelPredicted;
//     };

//     const handleCorrectGuess = async () => {
//         setTimeout(async () => {
//             await speak('Hurrah !!!, guessed correctly.', voice2);
//             setScore(prev => prev + 1);
//             alert('press ok to continue');
//             nextRound();
//         }, 800);
//     };

//     const trollSpeak = async (text, voice) => {
//         const arr = [[voice1,1,0.2],[voice2,1.1,0.1],[voice3,0.2,0.1]];
//         const x = arr[Math.floor(Math.random() * arr.length)];
//         return new Promise((resolve) => {
//             const utterance = new SpeechSynthesisUtterance(text);
//             utterance.voice = x[0];
//             utterance.onend = () => {
//                 isSpeaking.current = false;
//                 resolve();
//             };
//             utterance.pitch = x[2]; // Higher pitch for a more sarcastic tone
//             utterance.rate = x[1]; // Slightly faster to emphasize sarcasm
//             window.speechSynthesis.speak(utterance);
//             isSpeaking.current = true;
//         });
//     };

//     const handleTrolling = async () => {

//         console.log(canTroll+"**************************")
//         if (result === 'marker' || result === 'toothbrush') {
//             const comment = trollComments.slang[Math.floor(Math.random() * trollComments.slang.length)];
//             await trollSpeak(comment, voice2); // Use the second voice for trolling messages
//             setCanTroll(false);
//         } else if ((result === 'blueberry' || result === 'blackberry') && (timer < 25)) {
//             const comment = trollComments.random[Math.floor(Math.random() * trollComments.random.length)];
//             await trollSpeak(comment, voice2); // Use the second voice for trolling messages
//             setCanTroll(false);

//         }else if (flag == 1) {
//             const comment = trollComments.random[Math.floor(Math.random() * trollComments.random.length)];
//             await trollSpeak(comment, voice2); // Use the second voice for trolling messages
//             setFlag(0);
//             setCanTroll(false);

//         }else if(flag>=2){
//             const comment = trollComments.slang[Math.floor(Math.random() * trollComments.slang.length)];
//             await trollSpeak(comment, voice2); // Use the second voice for trolling messages
//             setFlag(0);
//             setCanTroll(false);
//         }
//         setTimeout(() => {
//             setCanTroll(true);
//         }, 4000);
//     };

//     // Utility Functions
//     const convertURIToImageData = (URI) => {
//         return new Promise((resolve, reject) => {
//             if (URI == null) return reject();
//             const canvas = document.createElement('canvas');
//             const context = canvas.getContext('2d');
//             const image = new Image();
//             image.addEventListener('load', () => {
//                 canvas.width = image.width;
//                 canvas.height = image.height;
//                 context.drawImage(image, 0, 0, canvas.width, canvas.height);
//                 resolve(context.getImageData(0, 0, canvas.width, canvas.height));
//             }, false);
//             image.src = URI;
//         });
//     };

//     const getAnswer = async () => {
//         const sketch = myCanvas.current.canvasContainer.children[1].toDataURL("image/png");
//         try {
//             const sketchData = await convertURIToImageData(sketch);
//             const jimpImage = await jimp.read(sketchData);
//             jimpImage.resize(64, 64, jimp.RESIZE_BEZIER);
//             const buffer = await jimpImage.getBufferAsync(jimp.MIME_PNG);
//             const base64 = buffer.toString('base64');
//             const sketchDataURL = `data:image/png;base64,${base64}`;
//             const sketch28RGBAdata = await convertURIToImageData(sketchDataURL);
//             const grayData = prepareGrayData(sketch28RGBAdata);
//             await fetchPrediction(grayData);
//         } catch (error) {
//             console.error("Error in getAnswer:", error);
//         }
//     };

//     const prepareGrayData = (sketch28RGBAdata) => {
//         const data = Array.from(sketch28RGBAdata.data).filter((_, i) => i % 4 !== 3);
//         return data.reduce((acc, _, i) => {
//             if (i % 3 === 0) {
//                 const r = data[i];
//                 const g = data[i + 1];
//                 const b = data[i + 2];
//                 acc.push(Math.round(b / 255)); // Normalize to [0, 1]
//             }
//             return acc;
//         }, []);
//     };

//     const fetchPrediction = async (grayData) => {
//         const url = 'http://127.0.0.1:5000/predict';
//         const response = await axios.post(url, JSON.stringify(grayData), {
//             headers: { 'Content-Type': 'application/json' }
//         });
//         setPrediction(response.data);
//         console.log("Predictions received: ", response.data);
//     };

//     const updateTrollFlag = () => {
//         setFlag((prev) => prev + 1);
//         // if (flag === 2) {
//         //     setCanTroll(false);
//         //     setTimeout(() => {
//         //         setCanTroll(true);
//         //     }, 5000);
//         // }
//     };

//     // Clear Canvas Function
//     const clearCanvas = () => {
//         myCanvas.current.clear();
//         setPrevResult(""); // Clear previous results
//         seenPredictions.current.clear(); // Reset seen predictions
//     };

//     const stopPlay = () => {
//         setShowScoreCard(true);
//         setTotalRounds(round);
//         setTimeout(() => {
//             nextRound();
//         }, 3000);
//     };

//     // Render UI
//     const renderCanvas = () => {
//         const canvasStyle = {
//             borderColor: 'aliceblue',
//             borderStyle: 'inset',
//             width: '70vh',
//             height: "65vh",
//             backgroundColor: 'whiteSmoke',
//             border: '1px solid black',
//             boxShadow: '0.5px 0.5px 0.5px 0.5px',
//         };

//         return (
//             <CanvasDraw
//                 resize="false"
//                 lazyRadius={0}
//                 brushRadius={0.8}
//                 brushColor={"rgb(0,0,255)"}
//                 hideGrid={true}
//                 style={canvasStyle}
//                 ref={myCanvas}
//             />
//         );
//     };

//     const renderResults = () => {
//         return (
//             <div className="result">
//                 <h3>AI : Let me guess... </h3>
//                 <span>This is&nbsp;</span>
//                 <span>{prevResult.lastIndexOf(" a ") !== -1 ? prevResult.substring(0, prevResult.lastIndexOf(" a ")).trim() : ""}</span>
//                 <span>{" a " + result}</span>
//             </div>
//         );
//     };

//     return (
//         <div>
//             <div className="canvas-box">
//                 <div className='button-container'>
//                     <button className="btn btn-outline-primary btn-md eraser" onClick={clearCanvas}>
//                         <i className="fa-solid fa-trash"></i> clear
//                     </button>
//                     <button className="btn btn-outline-primary btn-md eraser" onClick={clearCanvas}>
//                         <i className="fa-solid fa-eraser"></i> Erase
//                     </button>
//                     <button onClick={stopPlay}><i className="fa-solid fa-stop"></i> Stop Play </button>
//                 </div>
//                 {renderCanvas()}
//                 {renderResults()}
//             </div>
//         </div>
//     );
// };

export default DrawingCanvas;
