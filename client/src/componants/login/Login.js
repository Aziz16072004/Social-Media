import axios from 'axios'; 
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import { useForm } from "react-hook-form";
import Cookies from 'js-cookie';

function Login() {
  const navigate = useNavigate();

  const { register, handleSubmit, setError, formState: { errors } } = useForm();

  async function onSubmit(data) {
    // Basic validation
    if (!data.email) {
      setError("email", { type: "manual", message: "Email is required" });
      return;
    }
    if (!data.password) {
      setError("password", { type: "manual", message: "Password is required" });
      return;
    }
    
    
    try {
      const res = await axios.post("https://social-media-2-o8uj.onrender.com/api/auth/signin", {
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
    <div className="login">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Login</h1>
        <p>
          email:
          <input type="email" {...register("email")} />
        </p>
        {errors.email && <p className="errorMessage">{errors.email.message}</p>}
        <p>
          password:
          <input type="password" {...register("password")} />
        </p>
        {errors.password && <p className="errorMessage">{errors.password.message}</p>}
        <input type="submit" value="login" />
        Or <Link to="/signup">SignUp</Link>
      </form>
    </div>
  );
}

export default Login;
