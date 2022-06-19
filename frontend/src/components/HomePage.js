import React, { Component } from "react";
import {
    Grid,
    Button,
    Typography,
    Pagination,
    Stack,
    Paper } from "@mui/material";

export default class HomePage extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            postSet: [],
            blogSet: [],
            currentPage: 1
        };
        this.getPostSet();
        this.getBlogSet();
    }

    componentDidMount() {
        document.title = "Blog Site - Main Page"
    }

    getPostSet() {
        fetch('/api/post')
            .then((response) => response.json())
            .then((data) => this.setState({postSet: data.reverse()}))
    }

    getBlogSet() {
        fetch('/api/blog')
            .then((response) => response.json())
            .then((data) => this.setState({blogSet: data.reverse()}))
    }

    render()
    {
        let postCount = this.state.postSet.length;
        let pagesCount = Math.ceil(postCount / 6);
        let firstId = 6 * (this.state.currentPage - 1);
        let lastId = 6 * (this.state.currentPage);
        return(
            <Grid container spacing={2}>
                <Grid item xs={10}>
                    <Paper elevation={2} style={{padding: "2%"}}>
                        <Grid container spacing={4}>
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
                </Grid>
                <Grid item xs={2}>
                    <Paper elevation={2} style={{padding: "8px"}}>
                        <Grid container spacing={2}>
                            {this.state.blogSet.slice(0, 8).map((blog, index) => {
                                return(
                                    <Grid item xs={12}>
                                        <Button color="primary" variant="contained" style={{width:'100%'}} onClick={() => {window.location.pathname = '/blog/' + (blog.id)}}>
                                            {blog.name}
                                        </Button>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}