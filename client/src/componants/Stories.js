import React, { useEffect, useState,useRef } from 'react';
import {useNavigate,Link} from "react-router-dom"

import axios from '../axios';
import Storiet from "stories-react";
import "stories-react/dist/index.css";
function Stories({user}) {
    const navigate = useNavigate();
    const [stories , setStories] = useState([])
    const [showStories , setShowStories] = useState(false)
    const [ storiesContent, setStoriesContent] = useState([])
    const hundleStorie = async (user) =>{
        setShowStories(true)
        try{
            const res = await axios.get(`/story/getStoriesForSwipper?userId=${user}`,{withCredentials: true })
            setStoriesContent(res.data);
        }catch(error){
            navigate("/");
        }
    }
    useEffect(()=>{
        const fetchStories = async ()=>{
            try {
                const res = await axios.get('/story/getAllStories', { withCredentials: true });
                setStories(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchStories()
    },[])

    return (
        <div className="allStories">
            <div className="storys">
                <Link to={`/stories/create/${user?._id}`} className="block_story story createStory">
                    <img src={user?.profileImg} className='storyImg'/>
                    <div className='addStory'>
                        <ion-icon name="add-outline"></ion-icon>
                    </div>
                    <p className="story_info story_info_create ">create Story</p>
                </Link>
                    {stories.length>0 && stories.map((ele , index)=>(
                        <div className="block_story story" key={index} onClick={()=>{hundleStorie(ele.lastStory.user?._id)}}>
                            <img src={ele.lastStory.image} className='storyImg'/>
                            <div className="img-profile-story">
                                <img src={ele.lastStory.user?.profileImg} alt=""/>
                            </div>
                            <p className="story_info">{ele.lastStory.user?.username}</p>
                        </div>
                    ))}
            </div>
            {showStories ?
                (<div className='swipperStories'>
                    <div className='swipperStoriesContent'>

                        {console.log(storiesContent)}
                    {storiesContent.length>0 ?
                    
                    (<div className='swipperStoriesHeader'>
                        <div className='swipperStoriesHeaderContent profile-img'>
                            <img src={storiesContent[0].user?.profileImg} />
                            <div>{storiesContent[0].user?.username}</div>
                        </div>
                        <ion-icon name="close-outline" onClick={()=>{setShowStories(false)}}></ion-icon>
                    </div>
                    ):null}
                        <Storiet  width="400px" height="600px" stories={storiesContent} className="swipperContent"/> 
                    </div>
                </div>)
                    :null
            }  
        </div>
  );
}
export default Stories;