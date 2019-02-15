import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import api from '../api';
import _ from 'lodash';
import history from '../utils/history';


class JobDetailView extends React.Component {

    ListOfDetails = ["Open to All Skill Levels", "Full or Part Time", "Clearance Level Required", "Work Location", 
    "Work Description", "Mandatory Skills", "Desired Skills", "Certifications", "Date Vendor Submissions Stop", "Holiday Work Required"]

    componentDidMount() {
        //console.log('load'+this.props.jobId);
        this.loadJob(this.props.jobId);
    }

    goToJobsList(){
        history.push("/viewjobs/");
    }

    render() {
        if (_.get(this.state, "job") !== undefined) {
            const job = this.state.job[0];
            let details = [];
            _.forIn(job, (val, key, obj) => {
                if(_.findIndex(this.ListOfDetails, (item) => item === key) !== -1){
                    details.push(<p key={key}> {key} : {val} </p>)
                }
            });

            return (
                <Container>
                    <div className="styleAsAnchor" style={{float:'right', padding: "10px 20px"}} onClick={ this.goToJobsList.bind(this)}>Back</div>
                    <h1>Details for {job["Labor Category"]} - ({this.props.jobId}) </h1>
                    <DetailsDiv>
                        {details}
                    </DetailsDiv>

                </Container>
            )
        }
        return null;
    }

    loadJob = (jobId) => {
        axios
            .get(api["server-side"] + "/viewjobs/job/" + this.props.jobId, {
                onUploadProgress: ProgressEvent => {
                    /* this.setState({
                        loaded: (ProgressEvent.loaded / ProgressEvent.total * 100),
                    }) */
                },
            })
            .then(res => {
                this.setState({ job: res.data })
            })
    }
}

export default JobDetailView;

const Container = styled.div`
    width: 980px;
    background: white;
    margin: 20px auto;
    border: 1px solid #ddd

    h1{
        font-weight: 200;
    }

    @media (max-width: 750px) {
        width: 100%;
    }
`

const DetailsDiv = styled.div`
    padding: 20px;
    text-align: left;
`