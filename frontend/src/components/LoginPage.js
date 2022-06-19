import React, { Component } from "react";
import {
    Button,
    Grid,
    Typography,
    TextField,
    FormControl,
    Paper } from "@mui/material";
import { Link } from "react-router-dom";


export default class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: "",
            errorLogin: "",
            password: "",
            errorPassword: ""
        }
        
        this.handleLoginChange = this.handleLoginChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleCreateButtonPressed = this.handleCreateButtonPressed.bind(this);
    }

    componentDidMount() {
        document.title = "Blog Site - Login"
    }

    handleLoginChange(e) {
        console.log("changed")
        this.setState({
            login: e.target.value,
        });
        this.setState({errorLogin: ""});
    }
    handlePasswordChange(e) {
        console.log("changed")
        this.setState({
            password: e.target.value,
        });
        this.setState({errorPassword: ""});
    }
    hasErrors() {
        if (this.state.login == "") {
            this.setState({errorLogin: "Undefined login"});
            return true;
        }
        if (this.state.password == "") {
            this.setState({errorPassword: "Undefined password"});
            return true;
        }
        return false;
    }
    handleCreateButtonPressed() {
        if (this.hasErrors()) {
            return;
        }
        fetch(`api/userlogin?username=${this.state.login}&password=${this.state.password}`)
            .then((response) => response.json())
            .then((data)     => { window.location.pathname = '/' });
    }

    render() {
        return(
            <Paper elevation={2} style={{padding: "2%", maxWidth: "400px", margin: "auto"}}>
                <Grid container spacing={1}>
                    <Grid item xs={12} align="center">
                        <Typography component="h4" variant="h4">
                            Login
                        </Typography>
                    </Grid>
                    <Grid item xs={12} align="center">
                        <FormControl fullWidth>
                            <TextField
                                variant="outlined"
                                required={true}
                                fullWidth
                                type="text"
                                onChange={this.handleLoginChange}
                                error={this.state.errorLogin}
                                helperText={this.state.errorLogin || "Username"} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} align="center">
                        <FormControl fullWidth>
                            <TextField
                                variant="outlined"
                                required={true}
                                fullWidth
                                type="password"
                                onChange={this.handlePasswordChange}
                                error={this.state.errorPassword}
                                helperText={this.state.errorPassword || "Password"} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} align="center">
                        <Button color="primary" variant="contained" onClick={this.handleCreateButtonPressed}>
                            Login
                        </Button>
                    </Grid>
                    <Grid item xs={6} align="center">
                        <Button color="secondary" variant="contained" to="/register" component={Link}>
                            Register
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}