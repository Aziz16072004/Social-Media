import axios from "../axios"
import * as React from 'react';

import { useState , useEffect, useRef } from "react"
import { useParams , Link } from "react-router-dom"
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import close from "../imgs/close.png"
import send from "../imgs/paper-plane-top.png"
import whiteLove from "../imgs/whiteLove.png"
import loveColored from "../imgs/loveColored.png"

import chat from "../imgs/chat.png"
import ribbon from "../imgs/ribbon.png"
import bookmark from "../imgs/bookmark.png"

export default function Post(){
    const [data,setData] = useState({})
    const [coloredLove , SetColoredLove] = useState(false)
    const [comment , setComment] = useState("")
    const [createdAt , setCreatedAt] = useState("");
    const [optionSelected ,setOptionSelected ]=useState("")
    const [showPostInformation , setShowPostInformation] = useState(false)
    const [showRatings , setShowRatings] = useState(false)
    const [showComments , setShowComments] = useState(false)
    const [ratingData , setRatingData] = useState({})
   

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClickButton = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = async(item) => {
      setOptionSelected(item);
      setAnchorEl(null);
    };
    const options = [
      'delete',
      'modify',
      'share'
    ];
    
    const ITEM_HEIGHT = 48;
    
    
    async function fetchData(postId){
      
        setShowPostInformation(true);
        try {
          const res = await axios.get(`/posts/showPost?postId=${postId}`,{ withCredentials: true });
          setRatingData(res.data || {});
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    }
    const { id } = useParams();
    const [post,setPost]= useState(null)
    function formatPostDate(createdAt) {
        const postDate = new Date(createdAt);
        const currentDate = new Date();
        const yearDiff = currentDate.getFullYear() - postDate.getFullYear();
        const monthDiff = currentDate.getMonth() - postDate.getMonth();
        const dayDiff = currentDate.getDate() - postDate.getDate();
        if (yearDiff > 0) {
          return `${yearDiff === 1 ? 'year' : 'years'} ago`;
        } else if (monthDiff > 0) {
          return `${monthDiff === 1 ? 'month' : 'months'} ago`;
        } else if (dayDiff > 0) {
          return `${dayDiff === 1 ? 'day' : 'days'} ago`;
        } else {
          return 'Today';
        }
      }
      useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
      if (userData) {
        setData(userData);
      }
        const fetchPost = async () => {
            try {
                const res = await axios.get(`/posts/showPost?postId=${id}`);
                console.log(res.data);
                if (res.data.peopleRated.some(rate => rate.user?._id === userData?._id)){
                  SetColoredLove(true) 
                }
                else{
                  SetColoredLove(false) 
                }
                if (res.data) {
                    setCreatedAt(formatPostDate(res.data.createdAt));
                    setPost(res.data);
                    console.log(res.data);
                    
                } else {
                    console.error('No data received from server');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchPost();
    }, [id]);
    async function hundleClickLike(post){
        try {
          let updatedRates;
          
          if (!post.peopleRated.some(rate => rate.user?._id === data._id)) {
            await axios.post("/posts/addRate", {
              postId: post && post._id,
              userId: data && data._id,
              withCredentials: true 
            });
            updatedRates = post.rates + 1;
          } else {
            await axios.delete("/posts/removeRate", {
              data: { postId: post && post._id, userId: data && data._id },
            });
            updatedRates = post.rates - 1;
          }
          
          
    setPost(prevPost => {
      const updatedPeopleRated = prevPost.peopleRated.some(rate => rate.user?._id === data._id)
        ? prevPost.peopleRated.filter(rate => rate.user?._id !== data._id)
        : [...prevPost.peopleRated, { user: { _id: data._id, profileImg: data.profileImg, username: data.username } }];
    
      return {
        ...prevPost,
        peopleRated: updatedPeopleRated,
        rates: updatedRates,
      };
    });
          SetColoredLove(!coloredLove);
        } catch (error) {
          console.log("Update Rating Error:", error);
        }
    }
    return(
       
          <main>
            <div className="container">
              <div className="row">

              
             {post? (
                
                 
                 <div className="posts col-12 col-md-8 col-lg-6 mx-auto"  key={post._id}>
                  <div className="optionsButton">
                  <IconButton
                  aria-label="more"
                  id="long-button"
                  aria-controls={open ? 'long-menu' : undefined}
                  aria-expanded={open ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleClickButton}
                  >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="long-menu"
                  MenuListProps={{
                      'aria-labelledby': 'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: '20ch',
                        },
                    }}
                    >
                  {options.map((option) => (
                      <MenuItem key={option} onClick={()=>handleClose(option)}>
                      {option}
                    </MenuItem>
                  ))}

                  
                </Menu>
                </div>
                    <div className="post-title">
                            <div className="profile-img img-post">
                              {console.log(post)}
                                <img src={"/"+post.userId?.profileImg || "/uploads/unknown.jpg"} alt=""/>
                            
                                </div>
                            <div className="post-name-utilisateur">
                                <h3><Link to={`/profile/${post.userId?._id}`}> {post.userId?.username}</Link> </h3>
                                <p>{createdAt} , post Created</p>
                            </div>
                        </div>
                        <div className="post-description ">{post.name}</div>
                        <div className="postes-images-post">
                            <img src={post.image} alt=""/>
                        </div>
                        <div className="icons-posts">
                            <div className="icons-posts-left">
                            <img
                              alt=""
                              src={coloredLove ? loveColored :whiteLove}
                              onClick={async ()=>{hundleClickLike(post)}}/>
                              <ion-icon name="chatbubble-ellipses-outline" onClick={()=>{fetchData(post._id) ; setShowPostInformation(true) ; setShowComments(true)}}></ion-icon>
                  
                              <ion-icon name="share-social-outline"></ion-icon>
                    </div>
                    <div className="icons-posts-right"><img  src={data.postMarkes.some(marke => marke.post === post._id) ? bookmark : ribbon} alt="" onClick={async ()=>{
                        try {
                            const res = await axios.post("/posts/postMarkes" , {
                                postId: post && post._id,
                                userId: data && data._id,
                                 
                                
                            })
                            localStorage.setItem("user", JSON.stringify(res.data));
                            setData(res.data);
                        } catch (error) {
                            console.log(error);
                        }
                    }}/></div>
                        </div>
                            <div className="vue">
                                <div className="line1-vue">
                                  <div>
                                  {post.peopleRated.map((rater, index) => (
                                      index < 3 ? <img src={rater.user?.profileImg || "/uploads/unknown.jpg"} alt="" className={`img${index+1}`} key={rater.user?._id} /> : ""
                                    ))}
              </div>
                                    <p onClick={()=>{fetchData(post._id) ;setShowRatings(true)}}>Like by <b>{post.peopleRated.length > 0 ? post.peopleRated[0].user?.username : ""}</b> and <b>{post.rates > 0 ? post.rates - 1 : 0} other</b></p>
</div>


{showPostInformation ? (
    showRatings ? (
        <div className="showRates">
      <div className="showRatesContent">
        <div className="topBarRates">
          <p><img src={loveColored} alt="Love Colored" /></p>
          <p><img src={close} alt="Close" onClick={() => { setShowPostInformation(false) ; setShowRatings(false) ; setShowComments(false) }} /></p>
        </div>
        <div className="ratesBody">
          
          {ratingData && ratingData.peopleRated ? (
              ratingData.peopleRated.map((rate) => (
                  <div className="personRateInformation" key={rate.user?._id}>
                <div>
                  <img src={rate.user?.profileImg || "/uploads/unknown.jpg"} alt="" />
                  <img src={loveColored} className="coloredHeartRate" alt="Love Colored" />
                </div>
                <p>{rate.user?.username}</p>
              </div>
            ))
        ) : (
            <p>No rating data available</p>
          )}
        </div>
      </div>
    </div>
  ) : (showComments ? (
      <div className="showRates">
      <div className="showRatesContent">
        <div className="topBarRates">
          <p><img src={chat} alt="Love Colored" /></p>
          <p><img src={close} alt="Close" onClick={() => { setShowPostInformation(false) ; setShowRatings(false) ; setShowComments(false) }} /></p>
        </div>
        <div className="ratesBody">
          {ratingData.comments && ratingData.comments.length>0 ?
          ratingData.comments.map((com)=>(
              <div className="comment" key={com._id}>
              
                  <img src={com.user?.profileImg || "/uploads/unknown.jpg"} alt=""/>
                  <div className="comment_description">
                    <p className="comment_title"><b>{com.user?.username}</b></p>
                    <p className="comment_writing"> {com.comment}</p>
                  </div>
                </div>
            ))
            :<h1>no comments</h1>}
            </div>
          </div>
        </div>
      ) : null)
    ) : null}
          </div>
          <div className="comments">
            <small onClick={()=>{
                
                fetchData(post._id)
                setShowPostInformation(true)
                setShowComments(true)}
                
            }>Vue all {post.comments.length} comments</small>
              {post.comments.length>0 ?
                <div className="comment">
                  
                  <img src={post.comments[0].user?.profileImg || "/uploads/unknown.jpg"} alt=""/>
                  <div className="comment_description">
                    <p className="comment_title"><b>{post.comments[0].user?.username}</b></p>
                    <p className="comment_writing"> {post.comments[0].comment}</p>
                  </div>
                </div>
            :null}
                <div className="addComment">
                <img src={data.profileImg} alt=""/>
                  <div className="comment_description">
                    <input type="text" placeholder="write a comment ...." value={comment} onChange={(e)=>setComment(e.target.value)} />
                    <img src={send} alt="addcomment" className="imageAddComment" onClick={async ()=>{
                        setComment("");
                        await axios.post("/posts/addComment", {
                            postId: post && post._id,
                            userId: data && data._id,
                            comment : comment,
                            
                        });
                        setPost(prevPost => {
                          const updatedComments = [
                            ...prevPost.comments, 
                            { comment: comment, user: { profileImg: data.profileImg, username: data.username } }
                          ];
                          
                          return {
                            ...prevPost,
                            comments: updatedComments
                          };
                        });
                        
                        
                    }}/>
                  </div>
                </div>
              </div>
            </div>
         
        ):<h1>post not found</h1>}
         </div>
            </div>
          </main>
        )
    }