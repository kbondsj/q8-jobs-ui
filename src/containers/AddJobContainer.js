import React from 'react';
import axios from 'axios';
import api from '../api';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox'
import styled from 'styled-components';
import * as moment from 'moment';
import * as uniqid from 'uniqid';
import history from '../utils/history';


import { makeStyles } from '@material-ui/styles';

class AddJobContainer extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            title: '',
            desc: '',
            location: '',
            minRate: '',
            maxRate: '',
            closeDate: '',
            requirements: '',
            isTS: false,
            open: false
        }
        this.updateTitle = this.updateTitle.bind(this);
        this.updateDesc = this.updateDesc.bind(this);
        this.updateLocation = this.updateLocation.bind(this);
        this.updateRequirements = this.updateRequirements.bind(this);
        this.updateCloseDate = this.updateCloseDate.bind(this);
        this.updateMinRate = this.updateMinRate.bind(this);
        this.updateMaxRate = this.updateMaxRate.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
        this.updateIsTS = this.updateIsTS.bind(this);
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
    updateRequirements(event){
        this.setState({requirements: event.target.value})
    }
    updateCloseDate(event){
        this.setState({closeDate: event.target.value})
    }
    updateMinRate(event){
        this.setState({minRate: event.target.value})
    }
    updateMaxRate(event){
        this.setState({maxRate: event.target.value})
    }

    updateIsTS(event){
        this.setState({isTS: event.target.checked});
    }

    navigateViewJobs(){
        history.push("/viewjobs");
    }

    formSubmit(event){
        const params = {
            id: uniqid('q8'),
            title: this.state.title,
            desc: this.state.desc,
            location: this.state.location,
            requirements: this.state.requirements,
            minRate: this.state.minRate,
            maxRate: this.state.maxRate,
            closeDate: this.state.closeDate,
            isTS: this.state.isTS,
        }
        console.log("Params: ", params);
        axios.post(api["post-jobs-api"], params).then((result)=> {
                console.log("RESULTS: ", result);
                this.setState({ open: true });
            })
        event.preventDefault();
    }

    render(){
        return (
        <div>
            <h1>Add a new job</h1>
            <Button variant="contained" color="primary" type="button" onClick={this.navigateViewJobs}>Back</Button>
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
                    multiline
                    rows="4"         
                    />
                <TextField 
                    label="Location"
                    variant="outlined"
                    onChange={this.updateLocation} 
                    value={this.state.location}              
                    />

                <TextField 
                    label="Requirements"
                    variant="outlined"
                    onChange={this.updateRequirements} 
                    value={this.state.requirements}
                    multiline
                    rows="4"
                    />

                <TextField 
                    label="Close Date"
                    variant="outlined"
                    onChange={this.updateCloseDate} 
                    value={this.state.closeDate}
                    placeholder="eg 02/03/2022"              
                    />

                <TextField 
                    label="Min Rate"
                    variant="outlined"
                    onChange={this.updateMinRate} 
                    value={this.state.minRate}              
                    />
                <TextField 
                    label="Max Rate"
                    variant="outlined"
                    onChange={this.updateMaxRate} 
                    value={this.state.maxRate}              
                    />
                <FormControlLabel
                    control={
                    <Checkbox
                        checked={this.state.checkedB}
                        onChange={this.updateIsTS}
                        value="true"
                        color="primary"
                    />
                    }
                    label="Clearance Required"
                />
                
                <Button variant="contained" color="primary" type="submit">Add</Button>
            </form>
                    </FormContainer>
            <span id="results"></span>
            <Snackbar anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={this.state.open}
                autoHideDuration={6000}
                onClose={this.handleClose}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">Job Saved Successfully</span>}>
                
            </Snackbar>
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
