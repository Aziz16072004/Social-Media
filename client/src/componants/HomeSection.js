import { useState , useEffect, useRef } from "react"
import * as React from 'react';
import {Link} from "react-router-dom"
import axios from "../axios"
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { CiShare2 } from "react-icons/ci";
import { AiOutlineComment } from "react-icons/ai";

import close from "../imgs/close.png"
import send from "../imgs/paper-plane-top.png"
import whiteLove from "../imgs/whiteLove.png"
import blackLove from "../imgs/blackLove.png"
import loveColored from "../imgs/loveColored.png"

import chat from "../imgs/chat.png"
import ribbon from "../imgs/ribbon.png"
import bookmark from "../imgs/bookmark.png"
import Stories from "./Stories"
import SharePopUp from "./SharePopUp";
import LoadingPost from "./LoadingPost";
export default function HomeSection({theme}) {
  const [loading, setLoading] = useState(true);
    const [postWidget, setPostWidget] = useState(false);
    const [loadAddingPost, setLoadAddingPost] = useState(false);

    const [postName, setPostName] = useState("");
    const [postImage, setPostImage] = useState(null);
    const [posts, setPosts] = useState([]);
    const [data,setData] = useState({})
    const [coloredLove , SetColoredLove] = useState(false)
    const [comment , setComment] = useState("")
    const [optionSelected ,setOptionSelected ]=useState("")
    const [sharePopUp , setSharePopUp] = useState(false)

    const [showPostInformation , setShowPostInformation] = useState(false)
    const [showRatings , setShowRatings] = useState(false)
    const [showComments , setShowComments] = useState(false)
    const [ratingData , setRatingData] = useState({})
    const fileInputRef = useRef(null);
    const [selectedItem,setSelectedItem] = useState("")

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    
    const handleClose = async(item) => {
     
      if(item ==="share"){
        setSharePopUp(true)
      }
      setAnchorEl(null);
    };
    const options = [
      'share'
    ];
    
    
    
    const ITEM_HEIGHT = 48;
    
    const handleClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();        
      }
    };
    async function fetchData(postId){
      
        setShowPostInformation(true);
        try {
          const res = await axios.get(`/posts/showPost?postId=${postId}`,{ withCredentials: true });
          setRatingData(res.data || {});
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    }
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
              withCredentials: true 
            });
            updatedRates = post.rates - 1;
          }
    
          setPosts(prevPosts => {
            const updatedPosts = prevPosts.map(p => {
              if (p._id === post._id) {
                return {
                  ...p,
                  peopleRated: post.peopleRated.some(rate => rate.user?._id === data._id)
                    ? p.peopleRated.filter(rate => rate.user?._id !== data._id)
                    
                    : [...p.peopleRated, { user: { _id: data._id ,profileImg : data.profileImg , username : data.username} }],
                  rates: updatedRates,
                };
              }
              return p;
            });
            return updatedPosts;
          });
          SetColoredLove(!coloredLove);
        } catch (error) {
          console.log("Update Rating Error:", error);
        }
    }
    const handleImageChange = (e) => {
      setPostImage(e.target.files[0]);
    };
    const handleSubmit = async (e) => {
      setLoadAddingPost(true)
      e.preventDefault();
      const formData = new FormData();
      formData.append('name', postName);
      formData.append('image', postImage);
      formData.append('userId', data._id);
      try {
        const response = await axios.post("/posts/upload", formData,{withCredentials: true });
        console.log(response.data);
        
        setPosts(prevPosts => [response.data.post,...prevPosts]);
      } catch (error) {
        console.error('Error uploading Post:', error);
      }
      finally{
        
        setLoadAddingPost(false);
        setPostWidget(false)
      }
    }
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
      const userData = localStorage.getItem("user");
      if (userData) {
        setData(JSON.parse(userData));
      }
      const fetchProducts = async () => {
        setLoading(true);
        try {
          const response = await axios.get("/posts",{ withCredentials: true });
          setPosts(response.data);
      } catch (error) {
          console.error('Error fetching posts:', error);
      }
      finally {
        setLoading(false); 
      }
  };
  fetchProducts();
 }, []);
    
    return (
        <>
{postWidget && (
  <div className="change row">
    <div className="container col-10 col-md-8 my-auto col-lg-6">
      {loadAddingPost ? (
        <div className="loadingaAddingPost">
                <CircularProgress size="3rem" />
                <p>Uploading your post...</p>


        </div>
      ) : (
        <>
          <div className="createdPostHeader w-100">
            <div className="createdPostHeaderName text-align-center">
              <h3>Create Post</h3>
            </div>
            <div className="exite-btn">
              <ion-icon name="close-outline" onClick={() => setPostWidget(false)}></ion-icon>
            </div>
          </div>

          <div className="userPost row">
            <img src={`/${data.profileImg}`} className="col-2" alt="" />
            <div className="col-10">
              <h4>{data.username}</h4>
              <p>{data.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="formContent">
              <div className="w-100">
                <input type="text" placeholder="Quoi de neuf Aziz ?" onChange={(e) => setPostName(e.target.value)} />
              </div>

              <div className="addPostImage">
                <div className="w-100 albums" onClick={handleClick}>
                  {postImage ? (
                    <img src={URL.createObjectURL(postImage)} alt="" />
                  ) : (
                    <div>
                      <ion-icon name="albums-outline"></ion-icon>
                      <p>Add pictures or videos</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Hidden File Input */}
              <input type="file" accept="image/*" ref={fileInputRef} className="d-none" onChange={handleImageChange} />

              <div>
                {postImage && postName !== "" ? (
                  <input type="submit" className="submit-btn" value="Save Post" />
                ) : (
                  <input type="reset" className="submit-btn dontsubmit" value="Save Post" disabled />
                )}
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  </div>
)}

        <div className="acceuil col-12 col-md-9 col-lg-6">
         

           <Stories user={data}/>
        
            
        <div className="post-bar" >
                    <div className="profile-img profile-img-post">
                    {data && data.profileImg && (
                        <img src={`/${data.profileImg}`} alt=""/>
                    )}
                    </div>
                    <div className="input-post-bar">
                        <input type="text" placeholder="what's on your mind , Diana?"/>
                    </div>
                    <button href="#post" className="button btn-post"  onClick={()=>{setPostWidget(true)}}>Post</button>
        </div>
        <div className="section2">
          <SharePopUp data={data} postId={selectedItem} trigger={sharePopUp} setTrigger={setSharePopUp}/>
          {loading ? (
            <LoadingPost/>
    ) : (
         posts.map((post)=>{
             const createdAt = formatPostDate(post.createdAt)
            return(
                <div className="posts" key={post._id}>
                  <div className="optionsButton">
                  <IconButton
                  aria-label="more"
                  id="long-button"
                  aria-controls={open ? 'long-menu' : undefined}
                  aria-expanded={open ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={(e)=>{
                    setAnchorEl(e.currentTarget);
                    setSelectedItem(post._id)
                    
                  }}
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
                    <MenuItem key={option} onClick={()=>{handleClose(option)}}>
                      {option}
                    </MenuItem>
                  ))
                   
                  }

                  
                </Menu>
                </div>
                    <div className="post-title">
                            <div className="profile-img img-post">
                           
                                <img src={`/${post.userId?.profileImg}`} alt=""/>
                            
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
                            <button
                              onClick={async ()=>{hundleClickLike(post)}}>{post?.peopleRated?.some(rate => rate.user?._id === data?._id) ? <FaHeart style={{ fill: 'red',color:'red' }}/>: (theme === "blackMode" || theme === "darkMode" ? <FaRegHeart />
                                : <FaRegHeart />) } </button>
                              <button><AiOutlineComment name="chatbubble-ellipses-outline" onClick={()=>{fetchData(post._id) ; setShowPostInformation(true) ; setShowComments(true)}}/></button>
                  
                              <button><CiShare2 name="share-social-outline" onClick={()=>{setSharePopUp(true) ;setSelectedItem(post._id); }}/></button>
                    </div>
                    <div className="icons-posts-right">
                      <button  onClick={async ()=>{
                      try {
                        const res = await axios.post("/posts/postMarkes" , {
                          postId: post && post._id,
                          userId: data && data._id,
                           withCredentials: true ,
                           
                        })
                        localStorage.setItem("user", JSON.stringify(res.data));
                        setData(res.data);
                      } catch (error) {
                        console.log(error);
                      }
                    }}> {data.postMarkes.some(marke => marke.post === post._id) ? <FaBookmark style={{fill:'gold'}}/>
                      : <FaRegBookmark  />
} </button></div>
                        </div>
                            <div className="vue">
                                <div className="line1-vue">
                                  <div>
                                  {post?.peopleRated?.map((rater, index) => (
  index < 3 ? <img src={`/${rater.user?.profileImg}`} alt="" className={`img${index+1}`} key={rater.user?._id} /> : ""
))}
              </div>
                                    <p onClick={()=>{fetchData(post._id) ;setShowRatings(true)}}>Like by <b>{post?.peopleRated?.length > 0 ? post?.peopleRated[0]?.user?.username : ""}</b> and <b>{post?.rates > 0 ? post?.rates - 1 : 0} other</b></p>
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
                  <img src={`/${rate.user?.profileImg}`} alt="" />
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
              
                  <img src={`/${com.user?.profileImg}`} alt=""/>
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
              
              }>Vue all {post?.comments?.length} comments</small>
              {post?.comments?.length>0 ?
                <div className="comment">
                  
                  <img src={`/${post?.comments[0]?.user?.profileImg}`} alt=""/>
                  <div className="comment_description">
                    <p className="comment_title"><b>{post?.comments[0]?.user?.username}</b></p>
                    <p className="comment_writing"> {post?.comments[0]?.comment}</p>
                  </div>
                </div>
            :null}
                <div className="addComment">
                <img src={`/${data.profileImg}`} alt=""/>
                  <div className="comment_description">
                    <input type="text" placeholder="write a comment ...." value={comment} onChange={(e)=>setComment(e.target.value)} />
                    <img src={send} alt="addcomment" className="imageAddComment" onClick={async ()=>{
                      setComment("");
                      await axios.post("/posts/addComment", {
                        postId: post && post._id,
                        userId: data && data._id,
                        comment : comment,
                        withCredentials: true 
                      });
                      setPosts(prevPosts => {
                        const updatedPosts = prevPosts.map(p => {
                          if (p._id === post._id) {
                            const updatedComments = [...p.comments, {comment: comment , user: {profileImg : data.profileImg,username :data.username}}];
                            return {
                              ...p,
                              comments: updatedComments
                            };
                          }
                          return p;
                        });
                        
                        return updatedPosts;
                      });
                     
                    }}/>
                  </div>
                </div>
              </div>
            </div>)
         }))}
         <div>
            
        </div>
        </div>

        </div>
        
         </>
    )
}