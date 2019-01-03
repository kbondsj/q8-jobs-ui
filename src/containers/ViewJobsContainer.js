import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import _ from 'lodash';

class ViewJobsContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
            loaded: 0,
            password: "",
            jobs: [],
            selectedJob: null
        };
    }

    componentDidMount() {
        this.loadJobs();
        // <Link to={`/viewjobs/job/${doc["Request Number"]}`}>{`${doc["Request Number"]} - ${doc["Labor Category"]}`}</Link>

    }

    showDetail(doc) {
        let reqNo = doc["Request Number"];
        let selected = _.find(this.state.jobs, { "Request Number": reqNo });

        this.setState({ selectedJob: selected });
    }
    render() {
        return (
            <Container>
                <FlexBox>
                    <JobList>
                        {this.state.jobs.map((doc, idx) => {
                            return (
                                <JobCard key={idx} onClick={() => this.showDetail(doc)}>
                                    {`${doc["Request Number"]} - ${doc["Labor Category"]}`}
                                </JobCard>
                            )
                        })}
                    </JobList>
                    <JobDetail>
                        <JobDetailComponent job={this.state.selectedJob}></JobDetailComponent>
                    </JobDetail>
                </FlexBox>
            </Container>
        )
    }

    loadJobs = () => {
        axios
            .get("http://localhost:8000/viewjobs", {
                onUploadProgress: ProgressEvent => {
                    /* this.setState({
                        loaded: (ProgressEvent.loaded / ProgressEvent.total * 100),
                    }) */
                },
            })
            .then(res => {
                this.setState({ jobs: res.data })
            })
    }


}

const JobDetailComponent = (props) => {
    console.log(props);
    let styles = { textAlign: "left",
        fontWeight: 100 };
    return <div style={{padding: '10px'}}>
        {_.isNull(props.job) &&
            <p>Select a job to view details</p>}

        {!_.isNull(props.job) &&
            <DescriptionPanel>
                <h1 style={{borderBottom:"1px solid #f1f1f1"}}>{props.job["Labor Category"]}</h1>
                <div style={styles}>
                    <div className="form-group">
                        <label>Job No.: </label><span>{props.job["Request Number"]}</span>
                    </div>
                    <div className="form-group">
                        <label>Job Title: </label><span>{props.job["Labor Category"]}</span>
                    </div>
                    <div className="form-group">
                        <label>Location: </label><span>{props.job["Work Location"]}</span>
                    </div>
                    <div className="form-group">
                        <label>Description: </label><span>{props.job["Work Description"]}</span>
                    </div>
                    <div className="form-group">
                        <label>Mandatory Skills: </label><span>{props.job["Mandatory Skills"]}</span>
                    </div>
                    <div className="form-group">
                        <label>Desired Skills: </label><span>{props.job["Desired Skills"]}</span>
                    </div>
                </div>
            </DescriptionPanel>
        }

    </div>

}

export default ViewJobsContainer;

const Container = styled.div`
    width: 980px;
    margin-top: 15px;
    margin-bottom: 15px;
    margin-left: auto;
    margin-right: auto;
    padding: 10px;

    & h1{
        font-weight: 100;
    }
`
const FlexBox = styled.div`
    display: flex;
    width: 100%;
    border: 1px solid #efefef;
    padding: 10px;
`

const JobList = styled.div`
    flex-basis: 20%;
    height: 700px;
    overflow-y: scroll;
`
const JobDetail = styled.div`
    flex-basis: 80%;
    background-color: #fff;
    border-left: 1px solid #efefef;
`
const JobCard = styled.div`
    background-color: #fff;
    padding: 12px 8px;
    font-size: 0.8em;
    border-bottom: 1px solid #f1f1f1;
    cursor: pointer

    &:hover{
        background-color: #72b8c9;
    }
`

const DescriptionPanel = styled.div`
    label{
        font-weight: bold;
    }

    .form-group{
        margin-bottom: 10px;
        font-size: 0.8em;
    }
`

