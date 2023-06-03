import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Home.css"

const Home = () => {

  const [posts, setPosts] = useState([])

  const getPosts = async() => {
    try {
      const response = await axios.get("http://localhost:3000/post")
      const data = response.data;
      console.log(data)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() =>{
    getPosts()
  }, [])


  return (
    <div>Home</div>
  )
}

export default Home;