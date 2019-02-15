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

    login = ()=>{
        this.props.history.push("/viewjobs");
    }

    
    render() {
        const { classes } = this.props;
        return (
            <Container>
                <h1 className={classes.title} >Login</h1>
                <div>
                    <TextField 
                        label="Username"
                        variant="outlined"
                        
                        />
                </div>
                <div>
                <TextField 
                        label="Password"
                        variant="outlined"
                        type="password"
                        
                        />
                </div>
                <Toolbar>
                    <Button onClick={this.login}>Login</Button>
                </Toolbar>
            </Container>

        )
    }
}

export default withStyles(styles)(LoginContainer);

const Container = styled.div`
    width: 650px;
    height: 250px;
    border: 1px solid #ccc;
    background-color: #fff;
    margin: 150px auto 0px;
    border-radius: 5px;

`