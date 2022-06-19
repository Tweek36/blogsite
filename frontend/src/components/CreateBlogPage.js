import React, { Component } from "react";
import {
    Button,
    Grid,
    Typography,
    TextField,
    FormControl,
    Paper } from "@mui/material";
import { Link } from "react-router-dom";


export default class CreatePostPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            errorName: ""
        }
        
        this.handleBlogNameChange = this.handleBlogNameChange.bind(this);
        this.handleCreateButtonPressed = this.handleCreateButtonPressed.bind(this);
    }

    componentDidMount() {
        document.title = "Blog Site - Blog Creating"
    }

    handleBlogNameChange(e) {
        console.log("changed")
        this.setState({
            name: e.target.value,
        });
        this.setState({errorName: ""});
    }
    hasErrors() {
        if (this.state.name == "") {
            this.setState({errorName: "Name can not be empty"});
            return true;
        }
        return false;
    }
    handleCreateButtonPressed() {
        if (this.hasErrors()) {
            return;
        }
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                name: this.state.name,
            })
        };
        fetch("api/createblog", requestOptions)
            .then((response) => response.json())
            .then((data)     => { window.location.pathname = '/' });
    }

    render() {
        return(
            <Paper elevation={2} style={{padding: "2%", maxWidth: "400px", margin: "auto"}}>
                <Grid container spacing={1}>
                    <Grid item xs={12} align="center">
                        <Typography component="h4" variant="h4">
                            Blog creation
                        </Typography>
                    </Grid>
                    <Grid item xs={12} align="center">
                        <FormControl fullWidth>
                            <TextField
                                variant="standard"
                                required={true}
                                fullWidth
                                type="text"
                                onChange={this.handleBlogNameChange}
                                error={this.state.errorBlogName}
                                helperText={this.state.errorBlogName || "Blog name"} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} align="center">
                        <Button color="primary" variant="contained" onClick={this.handleCreateButtonPressed}>
                            Create
                        </Button>
                    </Grid>
                    <Grid item xs={6} align="center">
                        <Button color="secondary" variant="contained" to="/" component={Link}>
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}