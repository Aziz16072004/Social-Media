import { useState } from "react";
import { Link } from "react-router-dom";
import LongMenu from "./LongMenu";

const FriendButton = ({ userData, dataStoraged, acceptFriend, rejectFriend, addFriend }) => {
  const [friendStatus, setFriendStatus] = useState(() => {
    if (userData._id === dataStoraged._id) return "self";
    if (userData.friends.some(friend => friend.user._id === dataStoraged._id)) return "friend";
    if (userData.pending.some(req => req.user === dataStoraged._id)) return "pending";
    if (userData.requests.some(req => req.user === dataStoraged._id)) return "sent";
    return "none";
  });
  const deleteFriend = async (req)=>{
    try {
        console.log(dataStoraged._id);
        console.log(userData._id);
        
        // await axios.delete("/user/rejectfriend", {
        //     data: { user1: dataStoraged._id, user2: userData._id },withCredentials: true 
        //   })
        
    } catch (error) {
        console.log(error);
    }
}
  const handleAccept = () => {
    acceptFriend(userData);
    setFriendStatus("friend");
  };

  // Handle Reject Friend
  const handleReject = () => {
    rejectFriend(userData);
    setFriendStatus("none");
  };

  // Handle Add Friend
  const handleAddFriend = () => {
    addFriend();
    setFriendStatus("sent");
  };

  return (
    <>
      {friendStatus === "self" ? (
        <Link to={`/setting/${userData._id}`} className="btn">Modify Profile</Link>
      ) : friendStatus === "friend" ? (
        <div className="friendUser">
            <button className="btn button w-100 w-md-50 text-left btn-friend">Friend</button>
            <LongMenu dataStoraged={dataStoraged} userData={userData} />
        </div>
        
      ) : friendStatus === "pending" ? (
        <div className="request-btn">
          <button className="btn-rquests-accept" onClick={handleAccept}>Accept</button>
          <button className="btn-rquests-reject" onClick={handleReject}>Reject</button>
        </div>
      ) : friendStatus === "sent" ? (
        <button className="btn button w-100 w-md-50 text-left btn-friend">Sent</button>
      ) : (
        <button className="btn button w-100 w-md-50 text-left" onClick={handleAddFriend}>Add Friend</button>
      )}
    </>
  );
};

export default FriendButton;
