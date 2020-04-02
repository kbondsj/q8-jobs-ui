import React from 'react';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';

const styles = theme => ({
    title : {
        fontWeight: '100',
    }
});

class LoginContainer extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            username: '',
            password: '',
            validUsers: {
                    'admin': 'quadrant',
                    'EMConsultants': 'ink2match4!jr'
            },
            error: ''
        }

        this.updateUserNameField = this.updateUserNameField.bind(this);
        this.updatePasswordField = this.updatePasswordField.bind(this);
    }

    login = ()=>{
        if(this.state.validUsers[this.state.username] && this.state.validUsers[this.state.username] == this.state.password){
            this.props.history.push("/viewjobs");
        }else{
            this.setState({error: "Incorrect Login Credentials. Please try again."})
        }
    }

    updateUserNameField(event){
        this.setState({username: event.target.value})
    }

    updatePasswordField(event){
        this.setState({password: event.target.value})
    }

    render() {
        const { classes } = this.props;
        return (
            <Container>
                <h1 className={classes.title} >Login</h1>
                <div style={{marginBottom: '8px'}}>
                    <TextField 
                        label="Username"
                        variant="outlined"
                        value={this.state.username}
                        onChange={this.updateUserNameField}                       
                        />
                </div>
                <div>
                <TextField 
                        label="Password"
                        variant="outlined"
                        type="password"
                        value={this.state.password}
                        onChange={this.updatePasswordField}            
                        />
                </div>
                <Toolbar>
                    <Button onClick={this.login} color="primary" variant="contained">Login</Button>
                { this.state.error && <div style={{color: 'red', marginLeft: '20px'}}>{this.state.error}</div>}
                </Toolbar>
            </Container>

        )
    }
}

export default withStyles(styles)(LoginContainer);

const Container = styled.div`
    width: 650px;
    min-height: 250px;
    border: 1px solid #ccc;
    background-color: #fff;
    margin: 150px auto 0px;
    border-radius: 5px;

`