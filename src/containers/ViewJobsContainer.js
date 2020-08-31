import React, { Component } from "react";
import axios from "axios";
import styled from "styled-components";
import _ from "lodash";
import api from "../api";
import dateformat from "dateformat";
import Checkbox from "@material-ui/core/Checkbox";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { CSSTransition } from "react-transition-group";
import history from "../utils/history";
import { Typography } from "@material-ui/core";
import { red } from "@material-ui/core/colors";

const styles = (theme) => ({
  textFieldPadding: {
    padding: "12px 14px",
  },
  filtersContainer: {
    borderTop: "1px solid #ccc",
    borderBottom: "1px solid #ccc",
    paddingTop: "8px",
  },
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  //console.log(value, index);
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div p="3">{children}</div>}
    </Typography>
  );
}

// TabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.any.isRequired,
//   value: PropTypes.any.isRequired
// };

class ViewJobsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      loaded: 0,
      password: "",
      jobs: [],
      selectedJob: null,
      tabIndex: 0,
    };

    console.log(props);
  }

  componentDidMount() {
    this.loadJobs();
  }

  showDetail(doc) {
    let reqNo = doc["Id"];
    let selected = _.find(this.state.jobs, { Id: reqNo });

    this.setState({ selectedJob: selected });
  }

  updateSearch = (evt) => {
    let searchVal = evt.target.value;
    this.setState({ searchText: searchVal });
  };

  deselectJob = () => {
    this.setState({ selectedJob: null });
  };

  getCardStyle = (date) => {
    if (_.isEqual(date, 0)) {
      return "rgba(0,255,0,.1)";
    }
    return new Date(parseInt(date)) > new Date()
      ? "rgba(0,255,0,.1)"
      : "rgba(255,0,0,.1";
  };

  filterJobs = (event, value) => {
    console.log(event.target.value, value);
    this.setState({ [event.target.value]: value });
  };

  render() {
    let { classes } = this.props;

    let orderedJobs = [];
    if (this.state.jobs.length > 0) {
      orderedJobs = _(this.state.jobs)
        .sortBy((d) => d["Date"])
        .reverse()
        .value();
      //orderedJobs = _.sortBy(this.state.jobs, (d)=> d["Date Vendor Submissions Stop"]);
      if (!_.isEmpty(this.state.searchText)) {
        orderedJobs = _.filter(orderedJobs, (job) =>
          job["Request Number"].includes(this.state.searchText)
        );
      }
    }

    //const value = 0;
    let tabIndex = this.state.tabIndex;

    //style={{ backgroundColor: new Date(parseInt(doc["Date"])) > new Date() ? 'rgba(0,255,0,.1)' : 'rgba(255,0,0,.1' }}>
    return (
      <Container>
        {
          //<div>
          //   <button className="btn btn-success" onClick={ ()=> history.push("/addjob") }><span><Add/></span>Add New Job</button>
          //</div>
        }
        <div
          className="filters-container"
          style={{
            borderTop: "1px solid #ccc",
            borderBottom: "1px solid #ccc",
            paddingTop: "8px",
          }}
        >
          <div className="input-group">
            <label>All:</label>
            <Checkbox defaultChecked value="All" onChange={this.filterJobs} />
          </div>
          <div className="input-group">
            <label>Raytheon:</label>
            <Checkbox value="Raytheon" onChange={this.filterJobs} />
          </div>
          <div className="input-group">
            <label>CACI:</label>
            <Checkbox value="CACI" onChange={this.filterJobs} />
          </div>
          <div className="input-group">
            <label>NCI:</label>
            <Checkbox value="NCI" onChange={this.filterJobs} />
          </div>
          <div className="input-group">
            <label>DoED:</label>
            <Checkbox value="DoED" onChange={this.filterJobs} />
          </div>
        </div>

        <Toolbar>
          {/* TODO Fix filtering
            <TextField
            label="ID:"
            variant="outlined"
            onChange={this.updateSearch}
          />*/}
          <DisplayingDiv>
            {`Displaying ${orderedJobs.length} of ${this.state.jobs.length}`}
          </DisplayingDiv>
        </Toolbar>
        <FlexBox>
          <JobList>
            {orderedJobs.map((doc, idx) => {
              return (
                <JobCard
                  key={idx}
                  onClick={() => this.showDetail(doc)}
                  style={{
                    backgroundColor: this.getCardStyle(parseInt(doc["Date"])),
                  }}
                >
                  {`${doc["Job_Type"]}`}
                  {//check for 0 which means no end date
                  parseInt(doc["Date"]) === 0 && <div>Final Submit: None</div>}
                  {parseInt(doc["Date"]) !== 0 &&
                    (new Date(parseInt(doc["Date"])) > new Date() ? (
                      <div>
                        Final Submit:{" "}
                        {dateformat(parseInt(doc["Date"]), "mm-dd-yyyy")}
                      </div>
                    ) : (
                      <div style={{ textDecoration: "line-through" }}>
                        Final Submit:{" "}
                        {dateformat(
                          new Date(parseInt(doc["Date"])),
                          "mm-dd-yyyy"
                        )}
                      </div>
                    ))}
                </JobCard>
              );
            })}
          </JobList>
          <CSSTransition
            in={this.state.selectedJob != null}
            timeout={10}
            classNames="sliding"
          >
            <JobDetail id="job-detail-panel">
              <JobDetailComponent
                job={this.state.selectedJob}
                deselectJob={this.deselectJob}
              />
            </JobDetail>
          </CSSTransition>
        </FlexBox>
      </Container>
    );
  }

  loadJobs = () => {
    axios
      .get(api["get-jobs-api"], {
        onUploadProgress: (ProgressEvent) => {
          /* this.setState({
                        loaded: (ProgressEvent.loaded / ProgressEvent.total * 100),
                    }) */
        },
      })
      .then((res) => {
        this.setState({ jobs: res.data.Items });
      });
  };
}

const JobDetailComponent = (props) => {
  let styles = {
    container: {
      textAlign: "left",
      fontWeight: 300,
    },
    closer: {
      position: "absolute",
      top: "3px",
      right: "10px",
      fontSize: "0.8em",
      color: "blue",
      cursor: "pointer",
    },
  };

  const viewFullPage = (event, id) => {
    //console.log(history, id);
    history.push("/viewjobs/job/" + id);
  };

  let details = [];
  let reqs = [];
  console.log("JOB", props.job);
  // if (!_.isNull(props.job)) {
  //   reqs = _.split(props.job.Requirements, "\n");
  //   let job = _.cloneDeep(props.job);
  //   job.IsTS = !!job.IsTS ? "Yes" : "No";
  //   details = Object.entries(job);
  // }

  return (
    <div style={{ padding: "10px", position: "relative", overflow: "hidden" }}>
      {_.isNull(props.job) && (
        <div>
          <p style={{ color: "#6f6f6f" }}>Select a job to view details</p>
          <IconButton
            className="selectIcon"
            aria-label="Select a job on the left"
          >
            <ArrowBack fontSize="large" />
          </IconButton>
        </div>
      )}

      {!_.isNull(props.job) && (
        <DescriptionPanel>
          <div style={styles.closer}>
            <IconButton
              id="close-icon"
              aria-label="Close Description"
              onClick={() => props.deselectJob()}
            >
              <ExpandLess fontSize="small" />
            </IconButton>
          </div>
          <h1>{props.job["Job_Type"]}</h1>
          <div style={styles.container}>
            {props.job.IsTS === true && (
              <strong style={{ color: "red", fontWeight: "bold" }}>
                {" "}
                **TS/SCI with Full Scope Required**
              </strong>
            )}
            <div
              className="form-group"
              key="key"
              style={{ marginBottom: "30px" }}
            >
              {/* --------Description--------- */}
              <div>
                <h3
                  style={{
                    borderBottom: "1px solid #e1e1e1",
                    paddingBottom: "5px",
                    color: "#369bd1",
                  }}
                >
                  Description
                </h3>
              </div>
              <div
                style={{
                  paddingLeft: "10px",
                  marginTop: "3px",
                  fontSize: "14px",
                }}
              >
                <span>{props.job.Description}</span>
              </div>

              {/* --------Location--------- */}
              <div>
                <h3
                  style={{
                    borderBottom: "1px solid #e1e1e1",
                    paddingBottom: "5px",
                    color: "#369bd1",
                  }}
                >
                  Location
                </h3>
              </div>
              <div
                style={{
                  paddingLeft: "10px",
                  marginTop: "3px",
                  fontSize: "14px",
                }}
              >
                <span>{props.job.Location}</span>
              </div>

              {/* --------Date--------- */}
              <div>
                <h3
                  style={{
                    borderBottom: "1px solid #e1e1e1",
                    paddingBottom: "5px",
                    color: "#369bd1",
                  }}
                >
                  Response due:
                </h3>
              </div>
              <div
                style={{
                  paddingLeft: "10px",
                  marginTop: "3px",
                  fontSize: "14px",
                }}
              >
                <span>
                  {new Date(parseInt(props.job.Date)).toLocaleString()}
                </span>
              </div>

              {/* --------Requirements--------- */}
              <div>
                <h3
                  style={{
                    borderBottom: "1px solid #e1e1e1",
                    paddingBottom: "5px",
                    color: "#369bd1",
                  }}
                >
                  Requirements
                </h3>
              </div>
              <div
                style={{
                  paddingLeft: "10px",
                  marginTop: "3px",
                  fontSize: "14px",
                }}
              >
                <span>
                  {_.map(_.split(props.job.Requirements, "\n"), (req, i) => {
                    if (req.charCodeAt(0) === 8226) {
                      return (
                        <p key={i} style={{ marginLeft: "16px" }}>
                          {req}
                        </p>
                      );
                    } else if (req.charCodeAt(0) === 111) {
                      return (
                        <p key={i} style={{ marginLeft: "32px" }}>
                          {req}
                        </p>
                      );
                    } else {
                      return (
                        <p key={i} style={{ fontWeight: 400 }}>
                          {req}
                        </p>
                      );
                    }
                  })}
                </span>
              </div>

              {/* --------Rate--------- */}
              <div>
                <h3
                  style={{
                    borderBottom: "1px solid #e1e1e1",
                    paddingBottom: "5px",
                    color: "#369bd1",
                  }}
                >
                  Rate:
                </h3>
              </div>
              <div
                style={{
                  paddingLeft: "10px",
                  marginTop: "3px",
                  fontSize: "14px",
                }}
              >
                <span>
                  ${props.job.Min_Rate} - ${props.job.Max_Rate}{" "}
                  <span>(Note: Rate varies upon experience and skill set)</span>
                </span>
              </div>
            </div>

            {details.map((detail, idx) => {
              //console.log(detail);

              // don't want to display Id
              /* if (detail[0] === "Id") {
                return null;
              } */

              return (
                <div
                  className="form-group"
                  key={idx}
                  style={{ marginBottom: "30px" }}
                >
                  <div>
                    <h3
                      style={{
                        borderBottom: "1px solid #e1e1e1",
                        paddingBottom: "5px",
                        color: "#369bd1",
                      }}
                    >
                      {_.split(detail[0], "_").join(" ")}:
                    </h3>
                  </div>
                  <div
                    style={{
                      paddingLeft: "10px",
                      marginTop: "3px",
                      fontSize: "14px",
                    }}
                  >
                    <span>
                      {_.isEqual(detail[0], "Requirements")
                        ? _.map(reqs, (req, i) => <p key={i}>{req}</p>)
                        : _.isEqual(detail[0], "Date")
                        ? new Date(parseInt(detail[1])).toLocaleString()
                        : detail[1]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </DescriptionPanel>
      )}
    </div>
  );
};

export default withStyles(styles)(ViewJobsContainer);

const Container = styled.div`
  width: 980px;
  margin-top: 15px;
  margin-bottom: 15px;
  margin-left: auto;
  margin-right: auto;
  padding: 10px;

  & h1 {
    font-weight: 100;
  }

  @media (max-width: 750px) {
    width: 100%;
  }
`;
const FlexBox = styled.div`
  display: flex;
  width: 100%;
  border: 1px solid #efefef;
  padding: 10px;
  flex-wrap: wrap-reverse;

  @media (max-width: 750px) {
    padding: 10px 0px 0px;
  }
`;

const JobList = styled.div`
  flex-basis: 20%;
  height: 700px;
  overflow-y: scroll;
  align-self: flex-end;

  @media (max-width: 750px) {
    flex-basis: 100%;
  }
`;
const JobDetail = styled.div`
  flex-basis: 80%;
  background-color: #fff;
  border-left: 1px solid #efefef;
  overflow: hidden;

  @media (max-width: 750px) {
    flex-basis: 100%;
  }
`;
const JobCard = styled.div`
  background-color: #fff;
  padding: 12px 8px;
  font-size: 0.8em;
  border-bottom: 1px solid #f1f1f1;
  cursor: pointer

    &:hover {
    background-color: #72b8c9;
  }
`;

const DescriptionPanel = styled.div`
  label {
    font-weight: bold;
  }

  .form-group {
    margin-bottom: 10px;
    font-size: 1em;
  }
`;

const Toolbar = styled.div`
  margin-top: 10px;
  text-align: left;
  padding: 10px 10px 0px;
  display: flex;
  justify-content: space-between;
`;

const DisplayingDiv = styled.div`
  display: inline-block;
  font-size: 1em;
  align-self: flex-end;
`;
