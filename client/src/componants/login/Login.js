import axios from 'axios'; 
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import { useForm } from "react-hook-form";
import Cookies from 'js-cookie';
import SocialLogin from './SocialLogin';
import InputField from './InputField';

function Login() {
  const navigate = useNavigate();

  const { register, handleSubmit, setError, formState: { errors } } = useForm();

  async function onSubmit(data) {
    console.log(data);
    if (!data.email) {
      setError("email", { type: "manual", message: "Email is required" });
      return;
    }
    if (!data.password) {
      setError("password", { type: "manual", message: "Password is required" });
      return;
    }
    
    
    try {
      const res = await axios.post("/auth/signin", {
        email: data.email,
        password: data.password
      });
      if (res.data === "Incorrect password") {
        setError("password", { type: "manual", message: "Password is invalide" });
        return;
      }
    if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        Cookies.set('jwt', res.data.token, { expires: 7 });
        navigate("/home");
      } else {
        setError("email", { type: "manual", message: "User not found" });
      }
    } catch (error) {
      alert("Error");
      console.log(error);
    }
  }

  return (
    <div className='loginPage'>
      <div className="login-container">
      <h2 className="form-title">Log in with</h2>
      <SocialLogin />
      <p className="separator"><span>or</span></p>
      <form action="#" className="login-form" onSubmit={handleSubmit(onSubmit)}>
      <InputField type="email" placeholder="Email address" icon="mail"  register={register("email")}  />
          {errors.email && <p className="errorMessage">{errors.email.message}</p>}
      <InputField type="password" placeholder="Password" icon="lock"   register={register("password")}  />
        {errors.password && <p className="errorMessage">{errors.password.message}</p>}

        {errors.password && <p className="errorMessage">{errors.password.message}</p>}

        <a href="#" className="forgot-password-link">Forgot password?</a>
        <input type="submit" className="login-button" value="Log In"/>
      </form>
      <p className="signup-prompt">
      
   
        Don&apos;t have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
    </div>
  );
}

export default Login;
