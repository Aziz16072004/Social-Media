import axios from '../../axios'; 
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import SocialLogin from './SocialLogin';
import InputField from './InputField';
import { FaCameraRetro } from "react-icons/fa";
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

function Signup() {
  const navigate = useNavigate();
  const { register, handleSubmit, setError, formState: { errors } } = useForm();
  const fileInputRef = useRef(null);
  const [useIsValid , setUseIsValid]= useState(false)
  const [profileImg, setProfileImg] = useState("/uploads/Unknown.jpg");
  const [showProfileImg, setShowProfileImg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(data) {
    setLoading(true)
    try {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("password", data.password);
      if (profileImg) {
        formData.append("image", profileImg); // Append the selected image file
      }
      else{
        formData.append("image", "/uploads/Unknown.jpg")
      }

      const res = await axios.post("/auth/signup", formData, { 
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data === "existe") {
        setError("email", { type: "manual", message: "User already exists" });
        return;
      }

      if (res.data === "nonexiste") {
        setUseIsValid(true)
        toast.success('Register successfully!');
        navigate("/");
      }

      if (res.status !== 200) {
        alert("Error: " + res.statusText);
      }
      console.log(data);
      
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      } 
    } catch (error) {
      toast.error('An error occurred. Please try again!');
      console.log(error);
    }
    finally {
      setLoading(false);
    }
  }

  const handleClick = () => {
    if (fileInputRef.current) {
      console.log("File input clicked");
      fileInputRef.current.click();        
    }
  };
  
  // const handleImageChange = (e) => {
  //   console.log("File changed:", e.target.files[0]);
  //   setPostImage(e.target.files[0]);
  // };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
      console.log("File changed:", e.target.files[0]);
    setProfileImg(e.target.files[0]);
    setShowProfileImg(URL.createObjectURL(file)); // Preview the image
  };

  return (
    <>
      <div className='ToastContainer'>
        <ToastContainer /> 
      </div>

      <div className="loginPage">
        <div className="login-container">
          {loading ? (
            <h1>loading</h1>
          ) : (
            <>
              <h2 className="form-title">Sign up with</h2>
              <SocialLogin />
              <p className="separator"><span>or</span></p>

              <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                <div className="profileImg" onClick={handleClick}>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    style={{ display: 'none' }} 
                  />
                  <img 
                    src={showProfileImg || "/uploads/Unknown.jpg"} 
                    alt="profileImg" 
                    style={{ width: '150px', height: '150px', borderRadius: '50%' }} 
                  />
                  <div>
                    <FaCameraRetro />
                  </div>
                </div>

                <InputField
                  type="text"
                  placeholder="Username"
                  icon="person"
                  register={register("username", { required: "Name required" })}
                />
                {errors.username && <p className="errorMessage">{errors.username?.message}</p>}

                <InputField
                  type="email"
                  placeholder="Email address"
                  icon="mail"
                  register={{
                    ...register("email", {
                      required: "Email required",
                      pattern: {
                        value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                        message: "Email invalid",
                      },
                    }),
                  }}
                />
                {errors.email && <p className="errorMessage">{errors.email?.message}</p>}

                <InputField
                  type="password"
                  placeholder="Password"
                  icon="lock"
                  register={register("password")}
                />
                {errors.password && <p className="errorMessage">{errors.password?.message}</p>}

                <a href="#" className="forgot-password-link">Forgot password?</a>
                <input type="submit" className="login-button" value="Sign Up" />
              </form>

              <p className="signup-prompt">
                Do you have an account? <Link to="/">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Signup;
