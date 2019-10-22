import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import _ from 'lodash';
import api from '../api';
import dateformat from 'dateformat';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Add from '@material-ui/icons/Add';
import {CSSTransition} from 'react-transition-group';
import history from '../utils/history';

const styles = theme => ({
    textFieldPadding: {
        padding: '12px 14px',
    },
});

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

        console.log(props);
    }

    componentDidMount() {
        this.loadJobs();
    }

    showDetail(doc) {
        let reqNo = doc["Request Number"];
        let selected = _.find(this.state.jobs, { "Request Number": reqNo });

        this.setState({ selectedJob: selected });
    }

    updateSearch = (evt) => {
        let searchVal = evt.target.value;
        this.setState({ searchText: searchVal });

    }

    deselectJob = () => {
        this.setState({selectedJob: null})
    }

    render() {
        let { classes } = this.props
        let orderedJobs = [];
        if (this.state.jobs.length > 0) {
            orderedJobs = _(this.state.jobs).sortBy((d) => d["Date Vendor Submissions Stop"]).reverse().value();
            //orderedJobs = _.sortBy(this.state.jobs, (d)=> d["Date Vendor Submissions Stop"]);
            if (!_.isEmpty(this.state.searchText)) {
                orderedJobs = _.filter(orderedJobs, (job) => job["Request Number"].includes(this.state.searchText));
            }
        }


        return (
            <Container>
                <div>
                    <button className="btn btn-success" onClick={ ()=> history.push("/addjob") }><span><Add/></span>Add New Job</button>
                </div>
                <Toolbar>
                    <TextField
                        label="ID:"
                        variant="outlined"
                        onChange={this.updateSearch}
                    />
                    <DisplayingDiv>
                        {`Displaying ${orderedJobs.length} of ${this.state.jobs.length}`}
                    </DisplayingDiv>

                </Toolbar>
                <FlexBox>
                    <JobList>
                        {orderedJobs.map((doc, idx) => {
                            return (
                                <JobCard key={idx}
                                    onClick={() => this.showDetail(doc)}
                                    style={{ backgroundColor: new Date(doc["Date Vendor Submissions Stop"]) > new Date() ? 'rgba(0,255,0,.1)' : 'rgba(255,0,0,.1' }}>
                                    {`${doc["Request Number"]} - ${doc["Labor Category"]}`}
                                    {new Date(doc["Date Vendor Submissions Stop"]) > new Date() ?
                                        <div>Final Submit: {dateformat(doc["Date Vendor Submissions Stop"], "mm-dd-yyyy")}</div> :
                                        <div style={{ textDecoration: 'line-through' }}>Final Submit: {dateformat(doc["Date Vendor Submissions Stop"], "mm-dd-yyyy")}</div>
                                    }
                                </JobCard>
                            )
                        })}
                    </JobList>
                    <CSSTransition
                        in={this.state.selectedJob != null}
                        timeout={10}
                        classNames="sliding"
                        >
                        <JobDetail id="job-detail-panel">
                            <JobDetailComponent job={this.state.selectedJob} deselectJob={ this.deselectJob}></JobDetailComponent>
                        </JobDetail>
                    </CSSTransition>
                </FlexBox>
            </Container>
        )
    }

    loadJobs = () => {
        axios
            .get(api["server-side"] + "/viewjobs", {
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
    let styles = {
        container: {
            textAlign: "left",
            fontWeight: 100
        },
        closer: {
            position: 'absolute',
            top: '3px',
            right: '10px',
            fontSize: '0.8em',
            color: 'blue',
            cursor: 'pointer'
        }
    };

    const viewFullPage = (event, id) => {
        console.log(history, id);
        history.push("/viewjobs/job/"+id);
    }


    return (
        <div style={{ padding: '10px', position: 'relative', "overflow": "hidden"}}>
            {_.isNull(props.job) && 
                <div>
                <p style={{"color":'#6f6f6f'}}>Select a job to view details</p>
                <IconButton className="selectIcon" aria-label="Select a job on the left">
                    <ArrowBack fontSize="large"/>
                </IconButton>
                </div>
            }

            {!_.isNull(props.job) &&
                <DescriptionPanel>
                    <div style={styles.closer}>
                        <IconButton id="close-icon" aria-label="Close Description" onClick={ () => props.deselectJob() }>
                            <ExpandLess fontSize="small"/>
                        </IconButton>
                    </div>
                    <h1 style={{ borderBottom: "1px solid #f1f1f1" }}>{props.job["Labor Category"]}</h1>
                    <div style={styles.container}>
                        <div className="styleAsAnchor" style={{padding: "10px 0"}} onClick={(e) => viewFullPage(e, props.job["Request Number"])}>View Full Details</div>
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

        </div>)

}

export default withStyles(styles)(ViewJobsContainer);

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



  @media (max-width: 750px) {
    width: 100%;
  }
`
const FlexBox = styled.div`
    display: flex;
    width: 100%;
    border: 1px solid #efefef;
    padding: 10px;
    flex-wrap: wrap-reverse;

    @media (max-width: 750px) {
        padding: 10px 0px 0px;
      }
    
`

const JobList = styled.div`
    flex-basis: 20%;
    height: 700px;
    overflow-y: scroll;
    align-self: flex-end;

    @media (max-width: 750px) {
        flex-basis: 100%;
      }
`
const JobDetail = styled.div`
    flex-basis: 80%;
    background-color: #fff;
    border-left: 1px solid #efefef;
    overflow: hidden;

    @media (max-width: 750px) {
        flex-basis: 100%;
      }
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

const Toolbar = styled.div`
    margin-top: 10px;
    text-align: left;
    padding: 10px 10px 0px;
    display: flex;
    justify-content: space-between;
`

const DisplayingDiv = styled.div`
    display: inline-block;
    font-size: 0.8em;
    align-self: flex-end;

`


