
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useRef, useState } from 'react';
import axios from "../axios"
import { Link, useParams } from 'react-router-dom';
const StoriesCreate = () => {
    const [loading , setLoading] = useState(false);
    const [storyImage, setStoryImage] = useState(null);
    const [stories , setStories] = useState(null)
    const [userData , setUserData] = useState({})
    const id = useParams().id
    const fileInputRef = useRef()


    function formatPostDate(createdAt) {
        const postDate = new Date(createdAt);
        const currentDate = new Date();
        const timeDifference = currentDate - postDate;
        const minutesDifference = Math.floor(timeDifference / (1000 * 60));
        const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
        if (minutesDifference < 1) {
            return 'Just now';
        } else if (minutesDifference < 60) {
            return `${minutesDifference} minute${minutesDifference === 1 ? '' : 's'} ago`;
        } else if (hoursDifference < 24) {
            return `${hoursDifference} hour${hoursDifference === 1 ? '' : 's'} ago`;
        } else {
            return `${Math.floor(hoursDifference / 24)} day${Math.floor(hoursDifference / 24) === 1 ? '' : 's'} ago`;
        }
    }
    useEffect(()=>{
        setUserData(JSON.parse(localStorage.getItem("user")));
        const fetchStories = async ()=>{
            try {
                const res = await axios.get(`/story/getStories?userId=${id}`)
                setStories(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchStories()
    },[])
    const handleClick = () => {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
      };
    const handleImageChange = (e) => {
        setStoryImage(e.target.files[0]);
        
    };
    const uploadStorie = async () =>{
        setLoading(true);        
        const formData = new FormData();
        formData.append('userId', id);
        formData.append('image', storyImage);
        
        try {
            const res = await axios.post("/story/addStory" , formData,{withCredentials: true })
            console.log(res.data);
            
            setStories(prevStories => [res.data , ...prevStories]);
        } catch (error) {
            console.log(error);
        }
        finally{
            setLoading(false);
        }
    }
  return (
    <div className='row creatingStoryContainer'>
        <div className='leftBar col-4'>
            <div className='Storyheader'>
                <Link to="/home">
                    <div className='icon'>
                        <ion-icon name="arrow-back-outline"></ion-icon>
                    </div>
                </Link>
                <span>Social media</span>
            </div>
            <div className='storiesCreated'>
                <h3>Votre Stories</h3>
                

                {stories && stories.map((story)=>(

                    <div className="profile-bar" key={story._id}>
                    <div className="profile-bar-content"  >
                        <div className="profile-img">
                            <img src={story.image}alt=""/>
                        </div>
                        <div className="info">
                            <b id="name-of-profile">{userData?.username}</b> <br/>
                            <small id="tag-of-profile">{formatPostDate(story.createdAt)}</small>
                        </div>
                    </div>  
                </div>
                    ))}
            </div>

            {storyImage ? (
                loading?(

                    <button className='btn-addStory'><CircularProgress size="2rem"/></button>
                ):
                (  <button className='btn-addStory' onClick={()=>uploadStorie()}>Save</button>)
                
            ) : null}
        </div>
        <div className='RightBar col-8 row'>
            {!storyImage ? (
            <div className='storyCreating storyCreating-Banner col-11 my-4 mx-auto'>
            
                <div className='addingStorieBanner' onClick={()=>{handleClick()}}>
                    <div >
                        <ion-icon name="albums-outline"></ion-icon>
                        <p>add story</p>
                    </div>
                </div>
            </div>
            ):(

            <div className='storyCreating col-11 my-4 mx-auto'>
                <p>story </p>
                <div className='storyImg '>
                    <img src={URL.createObjectURL(storyImage)} onClick={()=>{handleClick()}} alt='' className=' mx-auto'/>
                </div>
            </div>
            )}

        <input type='file' ref={fileInputRef}  onChange={handleImageChange }/>
        </div>
    </div>
  );
};

export default StoriesCreate;
