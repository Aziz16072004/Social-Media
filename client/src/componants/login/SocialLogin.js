import { useGoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

const clientID = "1016069592264-cubb8p9j5su3826i0pfd6b5ksko18bl5.apps.googleusercontent.com";

const SocialLogin = () => {
  const navigate = useNavigate();

  const handleSuccess = async (tokenResponse) => {
    console.log("Token received: ", tokenResponse);
    try {
      // const userInfo = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      //   headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      // });
      const res = await axios.post("http://localhost:8000/api/auth/google", {
        access_token: tokenResponse.access_token,
      });
      if (res.data.user) {
              localStorage.setItem("user", JSON.stringify(res.data.user));
              Cookies.set('jwt', res.data.token, { expires: 7 });
              navigate("/home");
            }
      
      
      // console.log("User Info:", userInfo.data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleSuccess,
    onError: () => console.log("LOGIN failed!"),
  });

  return (
    <div className="social-login">
      {/* Custom Button for Google Login */}
      <button className="social-button" onClick={() => login()}>
        <img src="google.svg" alt="Google" className="social-icon" />
        Google
      </button>
      
      {/* Custom Button for Apple */}
      <button className="social-button">
        <img src="apple.svg" alt="Apple" className="social-icon" />
        Apple
      </button>
    </div>
  );
};

const App = () => (
  <GoogleOAuthProvider clientId={clientID}>
    <SocialLogin />
  </GoogleOAuthProvider>
);

export default App;
