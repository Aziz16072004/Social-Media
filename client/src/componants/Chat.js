import { useEffect, useState, useRef } from "react"
import { useParams ,Link} from "react-router-dom"
import axios from "../axios"
import send from "../imgs/paper-plane-top.png"
export default function Chat({socket}){  
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
            try {  
                const res = await axios.get(`/user/getuser/${id1}`,{withCredentials: true })
                if (id2) {
                    const res2 = await axios.get(`/user/getuser/${id2}`,{withCredentials: true })
                    setShowUser({user : res2.data})
                }
                setFriends(res.data.friends)
            }catch(err){
                console.log(err);
            }
        }
        fetchData()
    },[])
    return(
        <div className='row messanger'>
         
            <div className="chat col-12 col-md-9 row mx-auto align-items-center ">   
                
                <div className={!showUser?("friendsBar col-12 col-md-4"):("friendsBar friendsBarHidden col-12 col-md-4")}>    
                {friends.map((friend)=>(
                    
                    <div className="message-person" onClick={()=>{setShowUser(friend)}}>
                        <div className="profile-img-friends ">
                            <img src={`/${friend.user?.profileImg}`} alt=""/>
                            {users.some(user => user?.userId ===friend.user?._id) ?(
                                <span className="activePerson"></span>
                            ):null}
                        </div>
                        <div className="message-info"> 
                            <b>{friend.user?.username}</b> <br/> <small> wake up brooo !!!!</small>
                        </div>
                    </div>
                    ))}
                </div>
               
                {showUser ? (
                    <div className="chatBar col-12 col-md-8 ">                    
                    <div className={showUser? "chatNavBar" :"chatNavBar chatNavBarHidden" }>
                            <ion-icon name="arrow-back-outline" onClick={()=>setShowUser(false)}></ion-icon>
                            
                        <div className="message-person ">
                            <div className="profile-img-friends ">
                                    <img src={`/${showUser.user?.profileImg}`} alt=""/>
                            </div>
                            <div className="message-info"> 
                                <b>{showUser.user?.username}</b> <br/> <small> wake up brooo !!!!</small>
                            </div>
                        </div>
                    </div>
                    <div className="chatBar-content">
                            <div className="discussion">

                                {messages.map((msg)=>(
                                    <div className={msg.fromSelf ? "reciever" : "sender"} ref={scrollRef}>
                                        {/* <img src={`/${showUser.user?.profileImg}`}/> */}
                                        
                                        
                                        <div>{msg.message}</div>
                                        
                                    </div>
                                ))}
                                {waitingMessage ? (
                                    <div className= "sender">
                                        <p>...</p>
                                    </div>
                                    ):null}
                            </div>
                    </div>
                        <div className="addChat">
                            <input type="text" value={message}onChange={(e)=>{
                                setMessage(e.target.value) 
                                if (socket) {
                                socket.emit("sending-message", {
                                    to: showUser.user?._id,
                                });
                            }
                            }}/>
                            <img src={send} alt="addcomment" className="imgSendMessage" onClick={hundleSendMessage}/>
                            
                        </div>
                </div>
                ):null}
                
            </div>
        </div>
    )
}