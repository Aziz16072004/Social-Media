import { useEffect, useState } from "react";
import axios from "../../axios";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SharePopUp from "../SharePopUp";
import FriendButton from "./FriendButton";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaRegHeart } from "react-icons/fa6";
import { AiOutlineComment } from "react-icons/ai";
import { CiMenuKebab } from "react-icons/ci";

export default function Profile({ socket }) {
    const [userData, setUserData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [sharePopUp , setSharePopUp] = useState(false)

    const [dataStoraged, setDataStoraged] = useState({});
    const { id } = useParams();
    const [anchorEl, setAnchorEl] = useState(null);
    const [optionSelected, setOptionSelected] = useState("");
    const open = Boolean(anchorEl);
    const [selectedItem, setSelectedItem] = useState("");
    const [postWidget, setPostWidget] = useState(false);
    const [postName, setPostName] = useState("");
    const handleSubmit = async (e) => {
      e.preventDefault(); 
      try {
          const response = await axios.put("/posts/updatePost/", {
            postId:selectedItem._id,
            name: postName
          });
          console.log('Post updated successfully:', response.data);
          setPostWidget(false);
      } catch (error) {
          console.error('Error updating post:', error);
      }
  };
  
  const acceptFriend = async (req)=>{
    try {
        
        const res = await axios.post("/user/acceptfriend", {recipient : dataStoraged._id, sender :req._id,withCredentials: true })
        console.log(res.data);
    } catch (error) {
        console.log(error);
    }
}
const rejectFriend = async (req)=>{
    try {
        await axios.delete("/user/rejectfriend", {
            data: { recipient: userData._id, sender: req.user?._id },withCredentials: true 
          })
        
    } catch (error) {
        console.log(error);
    }
}
    const handleClose = async (item) => {
        setOptionSelected(item);
        try {
            if (item === "delete") {
                await axios.delete("/posts/deletePost", { data: { postId: selectedItem._id } });
                setPosts((prevPosts) => prevPosts.filter((post) => post._id !== selectedItem._id));
              }
              if(item ==="share"){
                setSharePopUp(true)
              }
              if (item === "modify") {
              setPostName(selectedItem.name)
              setPostWidget(true)
            }
        } catch (error) {
            console.log(error);
        }
        setAnchorEl(null);
    };

    const options1 = ['delete', 'modify', 'share'];
    const options2 = ['modify', 'share'];

    const ITEM_HEIGHT = 48;

    const navigate = useNavigate();

    const addFriend = async () => {
        try {
            if (socket) {
                socket.emit("addFriend", {
                    to: userData._id,
                    from: dataStoraged._id,
                    img: dataStoraged.profileImg,
                    username: dataStoraged.username,
                });
                socket.emit("send-notification", {
                    to: userData._id,
                    message: "send an invitation",
                    img: dataStoraged.profileImg,
                    username: dataStoraged.username,
                    createdAt: Date.now()
                });
            }
            await axios.post("/user/addFriend/", { sender: dataStoraged._id, recipient: userData._id }, { withCredentials: true });

            userData.requests = [{ user: dataStoraged._id }, ...userData.requests];
            setUserData((prevUserData) => {
                const newRequests = [{ user: dataStoraged._id }, ...prevUserData.requests];
                return { ...prevUserData, requests: newRequests };
            });
        } catch (error) {
            navigate("/");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/home/getOneUser/${id}`, { withCredentials: true });
                const res2 = await axios.get(`/posts/showPostJustForProfile?userId=${id}`, { withCredentials: true });
                setUserData(res.data);
                // console.log("this is user Profile",res.data);
                setPosts(res2.data);
            } catch (error) {
                navigate("/");
            }
        };
        setDataStoraged(JSON.parse(localStorage.getItem('user')));        
        fetchData();
    }, []);

    return (
        <>
        <ToastContainer /> 
            {userData ? (
                <>
                    {postWidget ? (
                      
          <div className="change row">
          <div className="container col-10 col-md-8 my-auto col-lg-6">
            <div className="createdPostHeader w-100">
              <div className="createdPostHeaderName text-align-center">
                <h3>Modify Post </h3>
              </div>
              <div className="exite-btn">
                <ion-icon name="close-outline" onClick={()=>{setPostWidget(false)}}></ion-icon>
              </div>
            </div>
            <div className="userPost row"> 
              <img src={userData.profileImg} className="col-2" alt=""/>
              <div className="col-10">
                <h4>{userData.username}</h4>
                <p>{userData.email}</p>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="formContent ">
                <div className="w-100">  
                  <input type="text" value={postName} onChange={(e)=>setPostName(e.target.value)}/> 
                </div>
                
            <div className="addPostImage">
              <div className="w-100 albums" >
              {selectedItem ? 
              
              (<img src={selectedItem.image} alt=""/>)
              : (<div>
                <ion-icon name="albums-outline"></ion-icon>
                <p>Add pictures or videos</p>      
                </div>)}
            </div>
            </div>

            
            <div>
              {selectedItem && selectedItem.name !== postName ?(

                <input type="submit" className="submit-btn" value="Save Post" /> 
                ):  <input type="submit" className="submit-btn dontsubmit" value="Save Post"/> }
              
            
            </div>
              </div>
              </form>
            </div>
          </div>
          ):null
        } 
                    <div className="row profileContent">
        <SharePopUp data={userData} postId={selectedItem} trigger={sharePopUp} setTrigger={setSharePopUp}/>
                        <div className="profileItem row col-10 col-md-8 mx-auto align-items-center">
                            <img src={userData.profileImg} alt="" className="col-lg-4 col-12 mx-auto" />
                            <div className="col-12 col-lg-8">
                                <div className="profileInfo row my-3 mx-auto justify-content-center align-items-center">
                                    <p className="col-md-5 col-4 mx-auto">{userData.username}</p>
                                    <div className="col-md-5 col-5">
                                    <FriendButton userData={userData} 
                                    dataStoraged={dataStoraged} 
                                    acceptFriend={acceptFriend} 
                                    rejectFriend={rejectFriend} 
                                    addFriend={addFriend}  />
                                    </div>
                                </div>
                                <div className="row postInfo">
                                    <p className="col-4">{posts.length} publications</p>
                                    <p className="col-4">127 amie</p>
                                    <p className="col-4">169 suivie</p>
                                </div>
                            </div>
                        </div>
                        {posts.length > 0 && (
                            <div className="posts col-10 col-md-9 col-lg-8 mx-auto align-items-center">
                                <div className="row">
                                    {posts.map((post) => (
                                        <div className="post col-12 col-md-6 col-lg-4" key={post._id}>
                                            <img src={post.image} alt="" />
                                            <div className="postpic__content">
                                                <div className='row'>
                                                    <div className="col-4">
                                                        <FaRegHeart className="ProfileIcon"/>
                                                        <p>{post.rates} </p>
                                                    </div>
                                                    <div className="col-4">
                                                        <AiOutlineComment className="ProfileIcon"/>
                                                        <p>{post.comments.length} </p>
                                                    </div>
                                                    <div className="col-4">
                                                        <button  onClick={(e) => {
                                                            setAnchorEl(e.currentTarget);
                                                            setSelectedItem(post);
                                                        }}>
                                                            <CiMenuKebab className="ProfileIcon" />
                                                           

                                                        </button>
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
                                                            {dataStoraged._id === userData._id ? (
                                                                options1.map((option) => (
                                                                    <MenuItem key={option} onClick={() => { handleClose(option); }}>
                                                                        {option}
                                                                    </MenuItem>
                                                                ))
                                                            ) : (
                                                                options2.map((option) => (
                                                                    <MenuItem key={option} onClick={() => { handleClose(option); }}>
                                                                        {option}
                                                                    </MenuItem>
                                                                ))
                                                            )}
                                                        </Menu>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            ) : null}
        </>
    );
}
