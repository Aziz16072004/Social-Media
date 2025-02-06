import axios from '../../axios'; 
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import SocialLogin from './SocialLogin';
import InputField from './InputField';

function Signup() {
  const navigate = useNavigate();
  const { register, handleSubmit, setError, formState: { errors } } = useForm();

  async function onSubmit(data) {
    try {
      const res = await axios.post("/auth/signup", {
        username: data.username,
        email: data.email,
        password: data.password
      }, { withCredentials: true });

      if (res.data === "existe") {
        setError("email", { type: "manual", message: "User already exists" });
        return;
      }

      if (res.data === "nonexiste") {
        alert("Registering successfully");
        navigate("/");
      }

      if (res.status !== 200) {
        alert("Error: " + res.statusText);
      }
    } catch (error) {
      alert("Error");
      console.log(error);
    }
  }

  return (
    <div className='loginPage'>
    <div className="login-container">
    <h2 className="form-title">Sign up with</h2>
    <SocialLogin />
    <p className="separator"><span>or</span></p>
    <form action="#" className="login-form" onSubmit={handleSubmit(onSubmit)}>
    <InputField type="text" placeholder="Username" icon="person"  register={{...register("username", { required: "Name required" })}}  />
    { errors.username && <p className="errorMessage">{errors.username?.message}</p>}

    <InputField type="email" placeholder="Email address" icon="mail"  register={ {...register("email", { required: "Email required", pattern: { value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, message: "Email invalid" } })}}  />
    { errors.email && <p className="errorMessage">{errors.email?.message}</p>}


    <InputField type="password" placeholder="Password" icon="lock"   register={register("password")}  />
      {errors.password && <p className="errorMessage">{errors.password.message}</p>}

      <a href="#" className="forgot-password-link">Forgot password?</a>
      <input type="submit" className="login-button" value="Log In"/>
    </form>
    <p className="signup-prompt">
    
 
      Do you have an account? <Link to="/">Sign in</Link>
    </p>
  </div>
  </div>
    // <div className="signup">
    //   <form onSubmit={handleSubmit(onSubmit)}>
    //     <h1>Sign Up</h1>
    //     <fieldset>
    //       <legend><span className="number">1</span> Your basic info</legend>
    //       <label>Name:</label>
    //       <p className="errorMessage">{errors.username?.message}</p>
    //       <input type="text" {...register("username", { required: "Name required" })} />
    //       <label>Email:</label>
    //       <p className="errorMessage">{errors.email?.message}</p>
    //       <input type="email" {...register("email", { required: "Email required", pattern: { value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, message: "Email invalid" } })} />
    //       <label>Password:</label>
    //       <p className="errorMessage">{errors.password?.message}</p>
    //       <input type="password" {...register("password", { required: "Password required" })} />
    //     </fieldset>
    //     <input type="submit" value="SignUp" />
    //     Or <Link to="/">Login page</Link>
    //   </form>
    // </div>
  );
}

export default Signup;
