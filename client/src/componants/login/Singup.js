import axios from '../../axios'; 
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";

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
    <div className="signup">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Sign Up</h1>
        <fieldset>
          <legend><span className="number">1</span> Your basic info</legend>
          <label>Name:</label>
          <p className="errorMessage">{errors.username?.message}</p>
          <input type="text" {...register("username", { required: "Name required" })} />
          <label>Email:</label>
          <p className="errorMessage">{errors.email?.message}</p>
          <input type="email" {...register("email", { required: "Email required", pattern: { value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, message: "Email invalid" } })} />
          <label>Password:</label>
          <p className="errorMessage">{errors.password?.message}</p>
          <input type="password" {...register("password", { required: "Password required" })} />
        </fieldset>
        <input type="submit" value="SignUp" />
        Or <Link to="/">Login page</Link>
      </form>
    </div>
  );
}

export default Signup;
