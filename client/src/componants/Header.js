import searcheImg  from "../imgs/search-interface-symbol.png"
import axios from "../axios"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"
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
        <header className="row d-sm-flex justify-content-between" >
            <div className="logo col-6 col-md-4 text-center ">
                <h2>Social Media</h2>
            </div>
            <div className="searche   col-md-5 d-md-flex col-1 text-center" >
                <img src={searcheImg} alt="" className="searcheImg"/>
                <input type="text" className="d-none d-md-block"  onChange={handleInputChange} onFocus={()=>{hundleFocuse() }}  placeholder="searche for creator , inspiration and projects"/>
                {showSearchingBar ? (
                    <div className="searchingBar">
                    <ion-icon name="close-outline" onClick={(e) => { e.stopPropagation(); setShowSearchingBar(false); }}></ion-icon>
                   
                   {filteredUsers.map((user)=>{
                       const isFriend = user?.friends.find((friend) => friend.user === dataStoraged._id )
                       return(
                           <div  className="serachePerson container align-items-center" key={user?._id}>
                        <img src={`/${user?.profileImg}`} alt="" className=""/>
                        <Link to={`/profile/${user?._id}`} className="serachePersonInformation ">
                            <p>{user?.username}</p>
                           <small className="status">{isFriend ? "Ami(e)" : "Non ami(e)"}</small>
                        </Link>
                        
                    </div>)
                })}
                   
                </div>):null}
            </div>
            <div className="header-rigth col-5 col-sm-3  text-center">
                <button onClick={()=>{deconnection()}} className="Logoutbutton">Log Out</button>
            </div>
        </header>
        </div>
    </nav>
    )
}