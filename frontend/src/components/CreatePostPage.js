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
            blog_name: "",
            title: "",
            image_url: "",
            content: "",
            errorBlogName: "",
            errorPostTitle: "",
            errorImageUrl: "",
            errorContent: ""
        }
        
        this.handleBlogNameChange = this.handleBlogNameChange.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleImageUrlChange = this.handleImageUrlChange.bind(this);
        this.handleContentChange = this.handleContentChange.bind(this);
        this.handlePublishButtonPressed = this.handlePublishButtonPressed.bind(this);
    }

    componentDidMount() {
        document.title = "Blog Site - Post Creating"
    }

    handleBlogNameChange(e) {
        this.setState({
            blog_name: e.target.value,
        });
        this.setState({errorBlogName: ""});
    }
    handleTitleChange(e) {
        this.setState({
            title: e.target.value,
        });
        this.setState({errorPostTitle: ""});
    }
    handleImageUrlChange(e) {
        this.setState({
            image_url: e.target.value,
        });
        this.setState({errorImageUrl: ""});
    }
    handleContentChange(e) {
        this.setState({
            content: e.target.value,
        });
        this.setState({errorContent: ""});
    }
    hasErrors() {
        if (this.state.blog_name == "") {
            this.setState({errorBlogName: "Blog name required"});
            return true;
        }
        if (this.state.title == "") {
            this.setState({errorPostTitle: "Post title required"});
            return true;
        }
        if (this.state.image_url == "") {
            this.setState({errorImageUrl: "Image url required"});
            return true;
        }
        if (this.state.content == "") {
            this.setState({errorContent: "Post content required"});
            return true;
        }
        return false;
    }
    handlePublishButtonPressed() {
        if (this.hasErrors()) {
            return;
        }
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                blog_name: this.state.blog_name,
                title: this.state.title,
                image_url: this.state.image_url,
                content: this.state.content
            })
        };
        fetch("api/createpost", requestOptions)
            .then((response) => response.json())
            .then((data)     => window.location.pathname = '/');
    }

    render() {
        return(
            <Paper elevation={2} style={{padding: "2%"}}>
                <Grid container spacing={1}>
                    <Grid item xs={12} align="center">
                        <Typography component="h4" variant="h4">
                            Post creation
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
                    <Grid item xs={12} align="center">
                        <FormControl fullWidth>
                            <TextField
                                variant="standard"
                                required={true}
                                fullWidth
                                type="text"
                                onChange={this.handleTitleChange}
                                error={this.state.errorPostTitle}
                                helperText={this.state.errorPostTitle || "Post title"} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} align="center">
                        <FormControl fullWidth>
                            <TextField
                                variant="standard"
                                required={true}
                                fullWidth
                                type="text"
                                onChange={this.handleImageUrlChange}
                                error={this.state.errorImageUrl}
                                helperText={this.state.errorImageUrl || "Image url"} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} align="center">
                        <FormControl fullWidth>
                            <TextField
                                required={true}
                                fullWidth
                                multiline
                                variant="outlined"
                                type="text"
                                onChange={this.handleContentChange}
                                error={this.state.errorContent}
                                helperText={this.state.errorContent || "Content"} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} align="center">
                        <Button color="primary" variant="contained" onClick={this.handlePublishButtonPressed}>
                            Publish
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