import React from 'react';
import styled from 'styled-components';

class LoginContainer extends React.Component {

    login = ()=>{
        this.props.history.push("/viewjobs");
    }
    render() {
        return (
            <Container>
                <h1>Login</h1>
                <div>
                    <label>Username</label>
                    <input type="text" />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" />
                </div>
                <button onClick={this.login}>Login</button>
            </Container>

        )
    }
}
export default LoginContainer;

const Container = styled.div`
    width: 450px;
    height: 250px;
    border: 1px solid #ccc;
    background-color: #fff;
    margin: 150px auto 0px;
    border-radius: 5px;

`