import React from 'react';
import axios from 'axios';
import api from '../api';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/styles';

class AddJobContainer extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            title: '',
            desc: '',
            location: ''
        }
        this.updateTitle = this.updateTitle.bind(this);
        this.updateDesc = this.updateDesc.bind(this);
        this.updateLocation = this.updateLocation.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
    }

    updateTitle(event){
        this.setState({title: event.target.value});
    }
    updateDesc(event){
        this.setState({desc: event.target.value});
    }
    updateLocation(event){
        this.setState({location: event.target.value});
    }

    formSubmit(event){
        console.log(this.state);
        axios.post(api["post-jobs-api"], {
                id: this.state.title,
                desc: this.state.desc,
                location: this.state.location
            }).then((result)=> {
                console.log("RESULTS: ", result);
            })
        event.preventDefault();
    }
    
    render(){
        return (
        <div>
            <h1>Add a new job</h1>
            <button onClick={ this.testApiGateway }>Test API Gateway</button>
            <FormContainer>

            <form onSubmit={this.formSubmit}>
                <TextField  
                    label="Title"
                    variant="outlined"
                    onChange={this.updateTitle} 
                    value={this.state.title}       
                    />
                <TextField 
                    label="Description"
                    variant="outlined"
                    onChange={this.updateDesc} 
                    value={this.state.desc}          
                    />
                <TextField 
                    label="Location"
                    variant="outlined"
                    onChange={this.updateLocation} 
                    value={this.state.location}              
                    />
                <Button variant="contained" color="primary" type="submit">Add</Button>
            </form>
                    </FormContainer>
            <span id="results"></span>
            </div>);
    }

    testApiGateway(){
        axios.get(api["get-jobs-api"]).then((response)=>{
            console.log(response);
            document.getElementById('results').innerHTML = response.data.Count;
        })
    }
}

export default AddJobContainer;

const FormContainer = styled.div`
    background-color: white;
    max-width: 980px;
    padding: 20px;
    margin: 0 auto;
    border: 1px solid #eaeaea
    border-radius: 5px;
    align-items: center;
    display: flex;
    justify-content: center;

    form{
        display: flex;
        flex-direction: column;
        min-width: 400px;

        >div{
            margin: 0 0 5px 0;
        }
    }
`
