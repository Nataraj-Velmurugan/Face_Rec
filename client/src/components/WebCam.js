import React, { Component } from "react";
import Webcam from "react-webcam";


//const WebcamComponent = () => <Webcam />;



export default class WebcamCapture extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            image: '',
            webcamRef: ''
        };
    }
    
    setRef = webcam => {
        this.webcam = webcam;
    };

    capture = () => {
        const imageSrc = this.webcam.getScreenshot();
        this.setState({image: imageSrc});
    };

    render() {
        const videoConstraints = {
            width: 1280,
            height: 720,
            facingMode: "user"
        };
        return (
            <span>                    
                <div className="webcam-container">
                    <div className="webcam-img">
                        {this.state.image == '' ? <Webcam
                            audio={false}
                            height={720}
                            ref={this.setRef}
                            screenshotFormat="image/jpeg"
                            width={1280}
                            videoConstraints={videoConstraints}
                        /> : <img class="UserImage" src={this.state.image} />}
                    </div>
                    <div>
                        {this.state.image != '' ?
                            <button onClick={(e) => {
                                e.preventDefault();
                                this.setState({image: ''});
                            }}
                                className="webcam-btn">
                                Retake Image</button> :

                            <button onClick={(e) => {
                                e.preventDefault();
                                this.capture()
                            }}
                                className="webcam-btn">Capture</button>
                        }
                    </div>
                </div>
            </span>
        );
    }
    
};
