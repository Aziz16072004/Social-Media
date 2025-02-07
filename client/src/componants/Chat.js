import { useEffect, useState, useRef } from "react"
import { Link, useNavigate, useParams} from "react-router-dom"
import axios from "../axios"
import Cookies from 'js-cookie';

import { IoSearchSharp } from "react-icons/io5";
import { IoMdArrowBack } from "react-icons/io";
import { IoIosSend } from "react-icons/io";
import LoadingFriends from "./loading/loadingFriends";
export default function Chat({socket}){  
    const navigate = useNavigate();
    const [lastMessages, setLastMessages] = useState({});
    const [data,setData] = useState({})
    const [loadingFriends, setLoadingFriends] = useState(true);
    
    const {id1} = useParams()
    const {id2} = useParams()
    const [friends , setFriends] = useState([])
    const [message , setMessage] = useState("")
    const [messages , setMessages] = useState([])
    const [showUser , setShowUser] = useState(null)
    const [waitingMessage , setWaitingMessage] = useState(false)
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [users , setUsers] = useState([])
    const scrollRef = useRef()
    


   

    useEffect(() => {
        if (socket) {
            socket.emit('add-user', id1);
        }
    }, [socket]);
        useEffect(()=>{
            if (socket) {
                socket.on("getUsers", getUsers => {
                setUsers(getUsers);
            });
        }
        },[socket])
        useEffect(() => {
            if (socket) {
            socket.on("receive-message", (message) => {
                setArrivalMessage(message)
                setWaitingMessage(false)
            });}
        }, [showUser]);
        
        useEffect(() => {
            if (socket) {
            socket.on("receiving-message", (checking) => {
                setWaitingMessage(checking)
            });
        }
        }, [showUser]);
        
        
        useEffect(() => {

            scrollRef.current?.scrollIntoView({ behavior: "smooth"});
            
        }, [messages]);
    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);
    const hundleSendMessage = async () => {
        setMessage("")
        try {
            if (socket) {
            socket.emit("send-message", {
                to: showUser.user?._id,
                from: id1,
                message,
            });
            }
            await axios.post("/message/addmsg", {
                from: id1,
                to: showUser.user?._id,
                message: message,
                withCredentials: true 
            });
            setMessages((prevMessages) => [
                ...prevMessages,
                { fromSelf: true, message: message }
            ]);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (showUser) {
                    const response = await axios.post("/message/getmsg", {
                        from: id1,
                        to: showUser.user?._id,
                        withCredentials: true 
                    });
                    console.log(response);
                    
                    setMessages(response.data);
                }
            } catch (err) {
                console.error("Error fetching messages:", err);
            }
        };
        fetchData();
    }, [showUser]);

    useEffect(()=>{
        const fetchData = async()=>{
            const userData = localStorage.getItem("user");
            if (userData) {
              setData(JSON.parse(userData));
            }
            try {  
                setLoadingFriends(true)
                const res = await axios.get(`/user/getuser/${id1}`,{withCredentials: true })
                if (id2) {
                    const res2 = await axios.get(`/user/getuser/${id2}`,{withCredentials: true })
                    setShowUser({user : res2.data})
                }
                setFriends(res.data.friends)
                //here i should define the last messages 

                const fetchData = async() =>{
                    const newLastMessages = [];
                    await Promise.all(
                    res.data.friends.map(async (friend) => {
                        try {
                        const lastMsgResponse = await axios.get(
                            `/message/getLastMsg/?from=${id1}&to=${friend.user?._id}`,{withCredentials: true }
                        );
                        const lastMessage = lastMsgResponse.data;
                        newLastMessages[friend.user?._id] = lastMessage;
    
                        } catch (error) {
                        console.error(`Error fetching last message for ${friend.user?.username}:`, error);
                        }
                    })
                    );
                setLastMessages(newLastMessages);
    
                
            }
            fetchData()
            }catch(err){
                console.log(err);
            }
            finally{
                setLoadingFriends(false)
            }
        }
        fetchData()
    },[])
    return(
    <div className="messangerBody">

    <div className='messangerContainer'>
        
        <div className={!showUser?("messanger "):("messanger friendsBarHidden ")} >

            <div className="userContainer">
                <div>

                <img src={data.profileImg}/>
                <div>
                <h3>{data?.username}</h3>
                {users.some(user => user?.userId ===id1) ?(
                                  <p>Active now</p>
                             ): <p>offile</p>}
               
                </div>
                </div>
                <button onClick={()=>{
                    Cookies.remove('jwt');
                    localStorage.removeItem("user")
                    navigate("/");
                }
                }>Logout</button>
            </div>
            <hr/>
                    <div>
                       <input type="text" placeholder="Select a user to start chat"/>
                        <IoSearchSharp className="searchIcon"/>
                    </div>
                <div className="friendsContainer" >
                {loadingFriends?<LoadingFriends/>:
                friends.map((friend)=>(
                    
                    <div className="userContainer" onClick={()=>{setShowUser(friend)}}>
                        <div>
                            <img src={friend.user?.profileImg}/>
                            <div>
                            <h3>{friend.user?.username}</h3>
                            <p>{lastMessages[friend.user?._id]} </p>
                            </div>
                        </div>
                        {users.some(user => user?.userId ===friend.user?._id) ?(
                                 <span style={{"background":"green"}}></span>
                             ):<span></span>}
                   
                    </div>
                    
                ))}
                </div>
            </div>
            {showUser ? (
                <div className="selectedFriend">
                    <div className="selectedFriendHeader">   
                                    
                        <IoMdArrowBack className="backArrow" onClick={()=>setShowUser(false)}/>
                        <div className="userContainer">
                <div>
                    <img src={showUser.user?.profileImg}/>
                    <div>
                    <h3>{showUser.user?.username}</h3>
                    {users.some(user => user?.userId ===showUser.user?._id) ?(
                                  <p>Active now</p>
                             ): <p>Offline</p>}
                  
                    </div>
                </div>
                
            </div>
                    </div>
                    <div className="chatContent">
                       
                        {messages.map((msg)=>(
                            <div className={msg.fromSelf ? "reciever" : "sender"}>
                            { !msg.fromSelf  ?(<img src={showUser?.user?.profileImg}/>):null}
                            <div>
                                <span></span>
                                <div ref={scrollRef}>
                                    {msg.message.startsWith("http") || msg.message.startsWith("www.")?(
                                        <Link to={msg.message}>{msg.message}</Link>
                                    ):msg.message }
                                    
                                </div>
                            </div>
                        </div>
                        
                                 ))}
                         {waitingMessage ? (
                            <div className="loadingMessage">
                                <img src={showUser?.user?.profileImg}/>
                                <div>
                                <div id="loading-bubble">
                                    <div class="spinner">
                                        <div class="bounce1"></div>
                                        <div class="bounce2"></div>
                                        <div class="bounce3"></div>
                                    </div>
                                </div>
                                <span></span>
                                </div>
                            </div>
                            
                           

                            
                         ):null} 
                  
                    </div>
                    <div className="addChat">
                        <div>
                             <input type="text" value={message}onChange={(e)=>{
                                setMessage(e.target.value) 
                                if (socket) {
                                socket.emit("sending-message", {
                                    to: showUser.user?._id,
                                });
                            }
                            }}/>
                         

                            <IoIosSend className="sendIcon" onClick={hundleSendMessage} /> 

                        </div>
                        </div>
                    </div>
                ):<div className="selectingFriendChat">
                        <div>
                            <h1>Welcom to Social Media Chat</h1>
                            <h2>Select a conversation from the sidebar to start chatting</h2>
                        </div>
                    </div>
                    }
                
           </div>
                </div>
    )
}