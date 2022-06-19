import React, { Component } from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";
import BlogPage from "./BlogPage";
import PostPage from "./PostPage";
import CreatePostPage from "./CreatePostPage";
import CreateBlogPage from "./CreateBlogPage";
import EditPostPage from "./EditPostPage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import {
    AppBar,
    Container,
    Button, 
    ButtonGroup,
    Grid,
    Toolbar,
    Typography } from "@mui/material";

export default class App extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            username: "",
            isLogged: false,
            isAdmin: false
        }
        this.getUserDetails();
        this.handleUserLogout = this.handleUserLogout.bind(this);
    }

    getUserDetails() {
        fetch('/api/currentuser')
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    username: data?.username,
                    isLogged: data?.username ? true : false,
                    isAdmin: data?.isAdmin
                })
            });
    }

    handleUserLogout() {
        fetch(`api/userlogout`)
            .then((response) => response.json())
            .then((data)     => { window.location.pathname = '/' });
    }

    render()
    {
        return(
        <div>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <AppBar position="static">
                        <Container maxWidth="xl" style={{display: 'flex', justifyContent: 'space-between'}}>
                            <ButtonGroup variant="text" aria-label="medium text button group">
                                <Button href="/" style={{color: 'white'}}>
                                    Main page
                                </Button>
                                { this.state.isLogged && this.state.isAdmin && (<>
                                        <Button href="/createpost" style={{color: 'white'}}>
                                            Create post
                                        </Button>
                                        <Button href="/createblog" style={{color: 'white'}}>
                                            Create blog
                                        </Button>
                                    </>)
                                }
                            </ButtonGroup>
                            <ButtonGroup variant="text" aria-lable="medium text button group" style={{alignItems: 'center'}}>
                                { this.state.isLogged ? (<>
                                    <Button onClick={this.handleUserLogout} style={{color: 'white'}}>
                                        Quit
                                    </Button>
                                </>) : (<>
                                    <Button href="/login" style={{color: 'white'}}>
                                        Login
                                    </Button>
                                    <Button href="/register" style={{color: 'white'}}>
                                        Register
                                    </Button>
                                </>)}
                                { this.state.isLogged ? (<>{
                                    this.state.isAdmin ? (
                                        <Typography style={{color: '#FF9999'}}>
                                            {this.state.username}
                                        </Typography>
                                    ) : (
                                        <Typography style={{color: '#FFFF99'}}>
                                            {this.state.username}
                                        </Typography>
                                    )
                                }</>) : (<>
                                    <Typography style={{color: '#99FF99'}}>
                                        Guest
                                    </Typography>
                                </>)}
                            </ButtonGroup>
                        </Container>
                    </AppBar>
                </Grid>
                <Grid item xs={12}>
                    <Router>
                        <Routes>
                            <Route exact path="/" element={<HomePage />} />
                            <Route path="/blog/:blogId" element={<BlogPage />} />
                            <Route path="/post/:postId" element={<PostPage />} />
                            { this.state.isAdmin ? (<>
                                    <Route path="/createblog" element={<CreateBlogPage />} />
                                    <Route path="/createpost" element={<CreatePostPage />} />
                                    <Route path="/editpost/:postId" element={<EditPostPage />} />
                                </>) :(<>
                                    <Route path="/createblog" element={<HomePage />} />
                                    <Route path="/createpost" element={<HomePage />} />
                                    <Route path="/editpost/:postId" element={<HomePage />} />
                                </>)
                            }
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                        </Routes>
                    </Router>
                </Grid>
            </Grid>
        </div>);
    }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);