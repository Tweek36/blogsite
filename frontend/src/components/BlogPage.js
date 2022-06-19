import React, { Component } from "react";
import {
    Divider,
    Typography,
    Chip,
    Paper,
    Grid,
    Pagination,
    Stack,
    Button } from "@mui/material";

export default class BlogPage extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            name: "abc",
            create_date: "",
            postSet: [],
            currentPage: 1
        }
        this.blogId = window.location.pathname.substr(window.location.pathname.lastIndexOf('/') + 1);
        this.getBlogDetails();
        this.getPostSet();
    }

    componentDidMount() {
        document.title = "Blog Site - Blog View"
    }

    getBlogDetails() {
        fetch('/api/getblog?id=' + this.blogId)
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    name: data.name,
                    create_date: data.create_date
                })
            });
    }

    getPostSet() {
        fetch('/api/post')
            .then((response) => response.json())
            .then((data) => this.setState({
                postSet: data.reverse().filter((object) => {
                    return object.blog_name == this.state.name
                })
            }))
    }

    render()
    {
        let postCount = this.state.postSet.length;
        let pagesCount = (postCount + 5) / 6;
        let firstId = 6 * (this.state.currentPage - 1);
        let lastId = 6 * (this.state.currentPage);
        return(
            <Paper elevation={2} style={{padding: "2%"}}>
                <Typography component="h4" variant="h4" align="center">
                    {this.state.name}
                </Typography>
                <Divider>
                    <Chip label={'From ' + this.state.create_date} />
                </Divider>
                <Grid container>
                    {this.state.postSet.slice(firstId, lastId).map((post, index) => {
                        return(
                            <Grid item xs={6}>
                                <Button color="primary" variant="text" size="small" onClick={() => {window.location.pathname = '/post/' + (post.id)}}>
                                <Grid container spacing={0}>
                                    <Grid item xs={12}>
                                        <img src={post.image_url} style={{height: 120, width: "100%", objectFit: "cover"}}></img>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" align="left" sx={{color: 'gray'}}>
                                            {post.upload_date} // {post.blog_name}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography component="h6" variant="h6" align="left" sx={{color: 'black'}}>
                                            {post.title}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                </Button>
                            </Grid>
                        )
                    })}
                    <Grid item xs={12}>
                        <Stack justifyContent="space-between" alignItems="center">
                            <Pagination
                                count={pagesCount}
                                page={this.state.currentPage}
                                size="large"
                                showFirstButton
                                showLastButton
                                disabled={postCount <= 6 ? true : false}
                                onChange={(event, value) => {this.setState({currentPage: value})}}
                            />
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}