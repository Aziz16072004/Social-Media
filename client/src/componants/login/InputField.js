import { useState } from "react";
const InputField = ({ type, placeholder, icon, register }) => {
    // State to toggle password visibility
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    console.log(register); // Log to inspect the received props
  
    return (
      <div className="input-wrapper">
        <input
          type={isPasswordShown ? 'text' : type}
          placeholder={placeholder}
          className="input-field"
          required
          {...register} // Spread the received props onto the input element
        />
        <i className="material-symbols-rounded">{icon}</i>
        {type === 'password' && (
          <i onClick={() => setIsPasswordShown(prevState => !prevState)} className="material-symbols-rounded eye-icon">
            {isPasswordShown ? 'visibility' : 'visibility_off'}
          </i>
        )}
      </div>
    );
  };
export default InputField;