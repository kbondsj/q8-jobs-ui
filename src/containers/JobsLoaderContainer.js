import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import api from '../api';

class JobsLoaderContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
            loaded: 0,
            password: ""
        };
    }
    render() {
        return (
            <Container>
                <h1>Upload Jobs</h1>
                <p>Select a file and provide the password to upload new jobs to the system</p>
                <div>
                    <label>Upload File: </label>
                    <input type="file" onChange={(evt) => this.uploadFile(evt)} />
                    <button onClick={evt => this.handleFile(evt)}>Upload</button>
                    <div> {Math.round(this.state.loaded, 2)} %</div>
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" onChange={(evt) => this.updatePass} />
                </div>
            </Container>
        )
    }

    updatePass(evt) {
        this.setState({ password: evt.target.value });
    }

    readFile(evt) {
        axios
            .get(api["server-side"] + "/upload/read", {
                onUploadProgress: ProgressEvent => {
                    this.setState({
                        loaded: (ProgressEvent.loaded / ProgressEvent.total * 100),
                    })
                },
            })
            .then(res => {
                console.log(res.statusText)
            })
    }

    uploadFile(evt) {
        this.setState({
            selectedFile: evt.target.files[0],
            loaded: 0,
        })
    }

    handleFile() {
        const data = new FormData()
        data.append('file', this.state.selectedFile, this.state.selectedFile.name)
        //console.log(this.state.selectedFile, this.state.selectedFile.name);
        axios
            .post(api["server-side"] + "/upload", data, {
                onUploadProgress: ProgressEvent => {
                    this.setState({
                        loaded: (ProgressEvent.loaded / ProgressEvent.total * 100),
                    })
                },
            })
            .then(res => {
                console.log(res.statusText)
            })

    }
}

export default JobsLoaderContainer;

const Container = styled.div`
    width: 980px;
    margin-top: calc(50vh / 2);
    box-shadow: 0 0 3px 3px #eee;
    margin-left: auto;
    margin-right: auto;
    padding: 10px;
    background-color: #fff;

    & h1{
        font-weight: 100;
    }
`
