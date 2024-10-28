import React, { Component } from 'react';
import CanvasDraw from 'react-canvas-draw';
import axios from 'axios';
import jimp from 'jimp';
import Speech from 'speak-tts';
import UIfx from 'uifx';

import { Buffer } from 'buffer';

export default class DrawingCanvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playerChoice: "",
            modelGuess: "",
            seconds: 20
        };
        this.myCanvas = React.createRef();
    }



    componentDidUpdate() {
        if (this.props.timer % 5 == 0) {
            console.log("predicting at time remainging : ", this.props.timer);
            this.getAnswer();
        }
    }

    // Convert URI to ImageData
    convertURIToImageData = (URI) => {
        return new Promise(function (resolve, reject) {
            if (URI == null) return reject();
            var canvas = document.createElement('canvas'),
                context = canvas.getContext('2d'),
                image = new Image();
            image.addEventListener('load', function () {
                canvas.width = image.width;
                canvas.height = image.height;
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
                resolve(context.getImageData(0, 0, canvas.width, canvas.height));
            }, false);
            image.src = URI;
        });
    }

    // Get the model's answer by processing the sketch
    getAnswer = async () => {

        console.log("Hi")
        const sketch = this.myCanvas.current.canvasContainer.children[1].toDataURL("image/png"); // Ensure MIME type is set
        this.convertURIToImageData(sketch)
            .then((sketchData) => {
                console.log(sketchData)
                jimp.read(sketchData, (err, sketchConvert) => {
                    console.log(sketchConvert, "converted")
                    if (err) throw err;
                    sketchConvert
                        .resize(64, 64)
                        .getBase64(jimp.AUTO, (err, sketch28RGBA) => {
                            this.convertURIToImageData(sketch28RGBA)
                                .then(sketch28RGBAdata => {
                                    console.log(sketch28RGBAdata, "********************");
                                    let data = Object.values(sketch28RGBAdata['data']).map(value => value);
                                    let inputToModel = [];
                                    for (let i = 2; i < 16384; i += 4) {
                                        inputToModel.push(data[i] / 255);
                                        if (data[i] / 255 == 1) {
                                            console.log("location : ", inputToModel.length)
                                        }
                                    }

                                    console.log(inputToModel)

                                    console.log(inputToModel.length)
                                    console.log(inputToModel[0].length)
                                    console.log("******************")
                                });
                        });
                });
            });
    }
    clearCanvas = () => {
        this.myCanvas.current.clear();
    }

    render() {
        const canvasStyle = {
            borderColor: 'aliceblue',
            borderStyle: 'inset',
            width: 'auto',
            height: "420px",
            backgroundColor:'whiteSmoke',
            // margin: 'auto'
            border:'1px solid black',
            boxShadow:'0.5px 0.5px 0.5px 0.5px'
        };

        // setTimeout(() => {
        //     this.getAnswer();
        // }, 4000)



        return (
            <div>
                <div className="canvas-box d-flex justify-content-center align-items-center" >
                    <CanvasDraw
                        resize="false"
                        lazyRadius={0}
                        brushRadius={2}
                        brushColor={"rgb(0,0,255)"}
                        hideGrid={true}
                        style={canvasStyle}
                        ref={this.myCanvas}
                    />
                    <button className="btn btn-outline-primary btn-md eraser" onClick={this.clearCanvas}>
                        <img width="40" height="40" alt="X" /> clear
                    </button>



                </div>


                <div className="result">

                    <span>
                        This is&nbsp;
                    </span>

                    <span>
                         a cat, a dog , bat..,
                    </span>

                    <span>
                        a car
                    </span>

                </div>

            </div>
        );
    }
}
