import React, { Component } from "react";
import {
    Divider,
    Typography,
    Chip,
    Paper, 
    Button} from "@mui/material";
import { Box } from "@mui/system";

export default class PostPage extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            blog_name: "",
            title: "",
            upload_date: "",
            image_url: "https://www.ndca.org/co/images/stock/no-image.png",
            content: "",
            author_id: 0,
            user_id: -1,
            is_author: false
        }
        this.state.postId = window.location.pathname.substr(window.location.pathname.lastIndexOf('/') + 1);
        this.getPostDetails();
        this.getCurrentUserId();
    }

    componentDidMount() {
        document.title = "Blog Site - Post View"
    }

    getPostDetails() {
        fetch('/api/getpost?id=' + this.state.postId)
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    blog_name: data.blog_name,
                    title: data.title,
                    upload_date: data.upload_date,
                    image_url: data.image_url,
                    content: data.content,
                    author_id: data.authorId
                })
            });
    }
    
    getCurrentUserId() {
        fetch('/api/currentuser')
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    user_id: data.id,
                    is_author: data.id == this.state.author_id
                })
            });
    }

    render()
    {
        return (
            <Paper elevation={2} style={{padding: "2%"}}>
                <img src={this.state.image_url} style={{height: 360, width: "100%", objectFit: "cover"}}></img>
                <Typography component="h4" variant="h4" align="center">
                    {this.state.title}
                </Typography>
                <Divider>
                    <Chip label={this.state.blog_name + ' (' + this.state.upload_date + ')'} />
                </Divider>
                    {this.state.content.split('\n').map((textline, index) =>{
                        return(
                            <Typography variant="body1" style={{textAlign: 'justify', textIndent: '30px'}}>
                                    {textline}
                            </Typography>
                        )
                    })}
                {this.state.is_author && (
                    <Box style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                        <Button onClick={() => window.location.pathname = ("editpost/" + this.state.postId)} variant="contained">
                            Edit
                        </Button>
                    </Box>
                    
                )}
            </Paper>
        );
    }
}