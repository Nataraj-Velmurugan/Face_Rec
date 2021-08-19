import React, { Component, Fragment  } from "react";
import Webcam from "react-webcam";
import { WebcamCapture} from './WebCam'

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            email: '', 
            password: '',
            face: '',
            image: '',
            setImage: ''
        };
    }

    handleChange = (e) => {        
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value});        
        console.log(e.target.name)
    }

    handleFace = (event) => {
        if(this.state.email === '') {
            alert("Please enter your email and click face recognition.")
        }
        else {          
            this.setState({ face: "yes" });
            console.log(JSON.stringify(this.state))
            alert(JSON.stringify(this.state))
        }
    }

    handleSubmit = (event) => {
        alert('A form was submitted: ' + JSON.stringify(this.state));

        // fetch('http://localhost:8080/', {
        //     method: 'POST',         
        //     body: JSON.stringify(this.state)
        // }).then(function(response) {
        //     console.log(response)
        //     return response.json();
        // });

        // event.preventDefault();
    }

    handleData = (event) => {
        alert(JSON.stringify(this.state))
    }

    render() {

        return (
            <div name="main">                                
                    {this.state.face ?  <WebcamCapture/> : <div class="getData"> <form>
                    <h3>Login</h3>
                    <div className="form-group">
                        <label>Email address</label>
                        <input type="email" onChange={this.handleChange} className="form-control" name="email"  placeholder="Enter email" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" onChange={this.handleChange} className="form-control" name="password"  placeholder="Enter password" />
                    </div>
                    <div className="text-center">
                        <p>OR</p>
                    </div>
                    <div className="form-group">
                        <div className="text-center">
                            <button onClick={this.handleFace} className="btn btn-secondary btn-block">Face Recognition</button>
                        </div>
                    </div>                
                    <button onClick={this.handleSubmit}type="submit" className="btn btn-primary btn-block">Submit</button>            
                </form></div>}
            </div>
        );
    }
}
