
import { useState , useEffect } from "react"
import axios from "../axios"
import close from "../imgs/close.png"
import send from "../imgs/paper-plane-top.png"
import love from "../imgs/love.png"
import loveColored from "../imgs/loveColored.png"

import chat from "../imgs/chat.png"
import share from "../imgs/share.png"
import ribbon from "../imgs/ribbon.png"
import { useParams } from 'react-router-dom';
export default function Bookmarks(){
    const [post, setPosts] = useState([]);
    const [data,setData] = useState({})
    const [coloredLove , SetColoredLove] = useState(false)
    const [comment , setComment] = useState("")
    const [showPostInformation , setShowPostInformation] = useState(false)
    const [showRatings , setShowRatings] = useState(false)
    const [showComments , setShowComments] = useState(false)
    const [ratingData , setRatingData] = useState({})
    const { id } = useParams();
    async function fetchData(postId){
        setShowPostInformation(true);
        try {
          const res = await axios.get(`/posts/showPost?postId=${postId}`,{withCredentials: true });
          setRatingData(res.data || {});
        } catch (error) {
          console.error('Error fetching data:', error);
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
          try {
            const response = await axios.get(`/user/postMarkes/${id}`);
            console.log(response.data);
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };
    fetchProducts();
 }, []);
    return(
      <main>
        <div className="container">
        {post.length > 0 ? (
  post.map((postItem) => {
    if (postItem.post != null) {
      const createdAt = formatPostDate(postItem.post.createdAt);
      return (
        <div className="row" key={postItem.post._id}>
          <div className="posts col-12 col-md-8 col-lg-6 mx-auto">
            <div className="post-title">
              <div className="profile-img img-post">
                <img
                  src={postItem.post.userId.profileImg}
                  alt=""
                />
              </div>
              <div className="post-name-utilisateur">
                <h3>{postItem.post.userId?.username}</h3>
                <p>{createdAt}, post Created</p>
              </div>
            </div>
            <div className="post-description">{postItem.post.description}</div>
            <div className="postes-images-post">
              <img
                src={postItem.post.image}
                alt=""
              />
            </div>
            <div className="icons-posts">
              <div className="icons-posts-right">
                <img
                  alt=""
                  src={postItem.post.peopleRated.some(
                    (rate) => rate.user?._id === data._id
                  ) ? loveColored : love}
                  onClick={async () => {
                    try {
                      let updatedRates;
                      if (!postItem.post.peopleRated.some(
                        (rate) => rate.user?._id === data._id
                      )) {
                        await axios.post("/posts/addRate", {
                          postId: postItem.post && postItem.post._id,
                          userId: data && data._id,
                          withCredentials: true,
                        });
                        updatedRates = postItem.post.rates + 1;
                      } else {
                        await axios.delete("/posts/removeRate", {
                          data: { postId: postItem.post && postItem.post._id, userId: data && data._id },
                          withCredentials: true,
                        });
                        updatedRates = postItem.post.rates - 1;
                      }
                      setPosts((prevPosts) => {
                        const updatedPosts = prevPosts.map((p) => {
                          if (p._id === postItem.post._id) {
                            return {
                              ...p,
                              peopleRated: postItem.post.peopleRated.some(
                                (rate) => rate.user?._id === data._id
                              )
                                ? p.peopleRated.filter(
                                    (rate) => rate.user?._id !== data._id
                                  )
                                : [
                                    ...p.peopleRated,
                                    { user: { _id: data._id } },
                                  ],
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
                  }}
                />
                <img
                  src={chat}
                  alt=""
                  onClick={() => {
                    fetchData(postItem.post._id);
                    setShowPostInformation(true);
                    setShowComments(true);
                  }}
                />
                <img src={share} alt="" />
              </div>
              <div className="icons-posts-right">
                <img src={ribbon} alt="" />
              </div>
            </div>
            <div className="vue">
              <div className="line1-vue">
                <div>
                  {postItem.post.peopleRated.map((rater, index) => (
                    index < 3 ? (
                      <img
                        key={rater.user?._id}
                        src={rater.user?.profileImg}
                        alt=""
                        className={`img${index + 1}`}
                      />
                    ) : null
                  ))}
                </div>
                <p
                  onClick={() => {
                    fetchData(postItem.post._id);
                    setShowRatings(true);
                  }}
                >
                  Like by <b>{postItem.post.peopleRated.length > 0 ? postItem.post.peopleRated[0].user?.username : ""}</b> and <b>{postItem.post.rates > 0 ? postItem.post.rates - 1 : 0} other</b>
                </p>
              </div>

              {showPostInformation && (
                showRatings ? (
                  <div className="showRates">
                    <div className="showRatesContent">
                      <div className="topBarRates">
                        <p>
                          <img src={loveColored} alt="Love Colored" />
                        </p>
                        <p>
                          <img
                            src={close}
                            alt="Close"
                            onClick={() => {
                              setShowPostInformation(false);
                              setShowRatings(false);
                              setShowComments(false);
                            }}
                          />
                        </p>
                      </div>
                      <div className="ratesBody">
                        {ratingData && ratingData.peopleRated ? (
                          ratingData.peopleRated.map((rate) => (
                            <div
                              className="personRateInformation"
                              key={rate.user?._id}
                            >
                              <div>
                                <img
                                  src={rate.user?.profileImg}
                                  alt=""
                                />
                                <img
                                  src={loveColored}
                                  className="coloredHeartRate"
                                  alt="Love Colored"
                                />
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
                ) : (
                  showComments && (
                    <div className="showRates">
                      <div className="showRatesContent">
                        <div className="topBarRates">
                          <p>
                            <img src={chat} alt="Comments" />
                          </p>
                          <p>
                            <img
                              src={close}
                              alt="Close"
                              onClick={() => {
                                setShowPostInformation(false);
                                setShowRatings(false);
                                setShowComments(false);
                              }}
                            />
                          </p>
                        </div>
                        <div className="ratesBody">
                          {ratingData.comments && ratingData.comments.length > 0 ? (
                            ratingData.comments.map((com) => (
                              <div className="comment" key={com._id}>
                                <img
                                  src={com.user?.profileImg}
                                  alt=""
                                />
                                <div className="comment_description">
                                  <p className="comment_title">
                                    <b>{com.user?.username}</b>
                                  </p>
                                  <p className="comment_writing">{com.comment}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <h1>No comments</h1>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                )
              )}

              <div className="line2-vue">
                <p>
                  <b>Lana Rose</b> Lorem ipsum dolor sit amet consectetur. #lifeStyle
                </p>
              </div>
            </div>
            <div className="comments">
              <small
                onClick={() => {
                  fetchData(postItem.post._id);
                  setShowPostInformation(true);
                  setShowComments(true);
                }}
              >
                View all {postItem.post.comments.length} comments
              </small>
              {postItem.post.comments.length > 0 && (
                <div className="comment">
                  <img
                    src={postItem.post.comments[0].user?.profileImg}
                    alt=""
                  />
                  <div className="comment_description">
                    <p className="comment_title">
                      <b>{postItem.post.comments[0].user?.username}</b>
                    </p>
                    <p className="comment_writing">
                      {postItem.post.comments[0].comment}
                    </p>
                  </div>
                </div>
              )}
              <div className="addComment">
                <img
                  src={data.profileImg}
                  alt=""
                />
                <div className="comment_description">
                  <input
                    type="text"
                    placeholder="write a comment ...."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <img
                    src={send}
                    alt="Send"
                    className="imggggggg"
                    onClick={async () => {
                      setComment("");
                      await axios.post("/posts/addComment", {
                        postId: postItem.post && postItem.post._id,
                        userId: data && data._id,
                        comment: comment,
                        withCredentials: true,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  })
) : (
  <h1>No Bookmarks</h1>
)}

        </div> 
        </main>
    )
}