import React, { Component } from "react";
import axios from 'axios';
import Webcam from "react-webcam";
import { browserHistory } from 'react-router';
import  { Redirect } from 'react-router-dom'


export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: '',
            email: '', 
            password: '',
            face: '',
            ErrMsg: '',
            image: '',
            webcamRef: '',
            redirect: null
        };
    }

    handleChange = (e) => {       
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value});
        console.log(e.target.name)
    }

    postData(formData) {
        return new Promise(function(resolve, reject) {
            axios({
                method: 'post',
                url: 'http://localhost:8000/register',
                data: formData
            })
            .then(function (response) {
                console.log(response);
                resolve(response); 
            })
            .catch(function (response) {
                console.log(response);
                reject(response);
            });
        });
    }
    handleSubmit= async (e) => {
        const formData= new FormData();

        formData.append('name',this.state.name);
        formData.append('email',this.state.email);
        formData.append('password',this.state.password);
        formData.append('image', this.state.image);
        
        console.log(JSON.stringify(formData));

        var data = await this.postData(formData);
        alert(data);
    }

    handleFace = async (e) => {
        e.preventDefault();
                
        if (this.state.name === '') {
            alert('Please enter your Name')
        }
        else if (this.state.email === '') {
            alert('Please enter your Email')
        }
        else if (this.state.password === '') {
            alert('Please enter your Password')
        }
        if (this.state.name !== '' && this.state.email !== '' && this.state.password !== '') {
            this.setState({ face: "yes" });
        }          
    }

    setRef = webcam => {
        this.webcam = webcam;
    };

    capture = () => {
        const imageSrc = this.webcam.getScreenshot();        
        this.setState({image: imageSrc});
    }

    dataURLtoBlob = (dataurl) => {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    }

    render() {
        const videoConstraints = {
            width: 1280,
            height: 720,
            facingMode: "user"
        };
        return (
            <span>
                {this.state.face ? <span>                    
                <div className="webcam-container">
                    <div className="webcam-img">
                        {this.state.image == '' ? <Webcam
                            audio={false}
                            height={720}
                            ref={this.setRef}
                            screenshotFormat="image/jpeg"
                            width={1280}
                            videoConstraints={videoConstraints}
                        /> : <img className="UserImage" src={this.state.image} />}
                    </div>
                    <div>
                        {this.state.image != '' ?
                        <div>
                            <span>
                                <button onClick={(e) => {
                                    e.preventDefault();
                                    this.setState({image: ''});
                                }}
                                    className="webcam-btn">
                                    Retake Image</button>  
                            </span>
                            <span>
                                <button onClick={(e) => {
                                    this.handleSubmit()
                                }}
                                    className="webcam-btn">
                                    Done</button>  
                            </span>
                        </div>                        
                            :

                            <button onClick={(e) => {
                                e.preventDefault();
                                this.capture()
                            }}
                                className="webcam-btn">Capture</button>
                        }
                    </div>
                </div>
            </span>
            :
            <div className="auth-wrapper">
                    <div className="auth-inner">
                        <form>
                            <h3>Sign Up</h3>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" name="name" onChange={this.handleChange}className="form-control" placeholder="First name" />
                            </div>
                            <div className="form-group">
                                <label>Email address</label>
                                <input type="email" name="email" onChange={this.handleChange} className="form-control" placeholder="Enter email" />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input type="text" name="password" onChange={this.handleChange} className="form-control" placeholder="Enter password" />
                            </div>
                            <button onClick={this.handleFace} type="submit" className="btn btn-secondary btn-block">Face Recognition</button>
                        </form>
                    </div>
                </div>}            
            </span>
        );
    }
}