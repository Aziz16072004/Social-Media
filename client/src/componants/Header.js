import searcheImg  from "../imgs/search-interface-symbol.png"
import axios from "../axios"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"
import { CiSearch } from "react-icons/ci";
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';


export default function Header({theme , color}){
    const navigate = useNavigate();
    const [showSearchingBar , setShowSearchingBar] = useState(false)
    const [searchItem, setSearchItem] = useState('')
    const [users , setUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])
    const [dataStoraged , setDataStoraged] = useState({})
    const hundleFocuse = async () => {
        setShowSearchingBar(true);
    }
    function deconnection(){
        Cookies.remove('jwt');
        localStorage.removeItem("user")
        navigate("/");
    }
    useEffect(()=>{
        const fetchData=async()=>{
            try {
                const res = await axios.get("/home/getAllUsers",{
                    withCredentials: true,
                });
                setUsers(res.data)
                setFilteredUsers(res.data)
            } catch (error) {
                navigate("/");
            }
        }
        fetchData()
    },[])
    const handleInputChange = (e) => { 
        const searchTerm = e.target.value;
        setSearchItem(searchTerm)
        const filteredItems = users.filter((user) =>
        user?.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filteredItems)
        
      }
    useEffect(()=>{
        setDataStoraged(JSON.parse(localStorage.getItem('user')))
},[])
return(
    <nav className={`${theme} ${color}`}>
    <div className="container" >
        <header className="d-flex  justify-content-between" >
            <div className="logo  text-center ">
                <h2>Social Media</h2>
                <img src="uploads/logo.svg" alt="logo" />
            </div>
            <div className="searche  text-center" >
            <CiSearch className="searcheImg"/>
                <input type="text"  onChange={handleInputChange} onFocus={()=>{hundleFocuse() }}  placeholder="searche for creator , inspiration and projects"/>
                    <div className={showSearchingBar ? "searchingBarActive searchingBar" : "searchingBarHidden searchingBar"}>
                    <ion-icon name="close-outline" onClick={(e) => { e.stopPropagation(); setShowSearchingBar(false); }}></ion-icon>
                   
                   {filteredUsers.map((user)=>{
                       const isFriend = user?.friends.find((friend) => friend?.user === dataStoraged?._id )
                       return(
                           <div  className="serachePerson container align-items-center" key={user?._id}>
                        <img src={user?.profileImg || "/uploads/unknown.jpg" || "/uploads/unknown.jpg"} alt="" className=""/>
                        <Link to={`/profile/${user?._id}`} className="serachePersonInformation ">
                            <p>{user?.username}</p>
                           <small className="status">{isFriend ? "Ami(e)" : "Non ami(e)"}</small>
                        </Link>
                        
                    </div>)
                })}
            </div>
                   
                
            </div>
            <div className="header-rigth   text-center">{/*col-5 col-sm-3*/} 
                <button onClick={()=>{deconnection()}} className="Logoutbutton">Log Out</button>
            </div>
        </header>
        </div>
    </nav>
    )
}