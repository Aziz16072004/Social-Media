import axios from "axios";
import { useEffect } from "react";

export default function SharePopUp(props){
    const close=()=>{
        props.setTrigger(false)
    }
    
    const generateLink =()=>{
        return `http://localhost:3000/Social_Media_Project/post/${props.postId}`
    }
    return (props.trigger)?(
        <div className="popUp">
            <div className="sharePopUp container">
                {console.log("aaaa")}
                <div className="sharePopUpHeader">
                    <h2>Envoyer dans Messenger</h2>
                    <ion-icon name="close-circle-outline" onClick={()=>close()}></ion-icon>
                </div>
                <div className="shareLink">
                    <h3>link :</h3>
                    <div>{generateLink()}</div>
                </div>
                <div className="sharePopUpBody">
                    {props.data.friends.map((friend) => {
                    return (
                        <div className="sharePopUpBodyUser" key={friend.user._id}>
                        <div>
                            <img src={`http://localhost:8000/${friend.user.profileImg}`} alt={friend.user.username} />
                            <p>{friend.user.username}</p>
                        </div>
                        <button onClick={async ()=>{
                            try {
                                await axios.post("http://localhost:8000/message/addmsgLink",{from:props.data._id ,to:friend.user._id,message:generateLink(),postId:props.postId})
                            } catch (error) {
                                console.log(error);
                            }
                            
                            
                            close()}}>Envoyer</button>
                        </div>
                    );
                    })}

                </div>
                

            </div>
        </div>
    ):""
}