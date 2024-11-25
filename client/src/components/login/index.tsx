import './index.css';
import { useState } from 'react';
import starImage from '../../images/image.png';
import useLogin from '../../hooks/useLogin';

/**
 * Login Component contains a form for Firebase email/password authentication.
 */
const Login = ({
  showLogIn,
  setShowLogIn,
}: {
  showLogIn: boolean;
  setShowLogIn: (showLogIn: boolean) => void;
}) => {
  const {
    email,
    password,
    handleSubmit,
    handleInputChange,
    error,
    handleGoogleLogin,
    handlePlanetClick,
    handleAnimationEnd,
    wobble,
  } = useLogin();
  const [isSpinning, setIsSpinning] = useState(false);

  const handleToggle = () => {
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 500); // Remove class after animation
    setShowLogIn(!showLogIn);
  };

  return (
    <div className='container'>
      <div className='left-content'>
        <img
          src={starImage}
          alt='Planet'
          className={`spinning-star ${isSpinning ? 'spin' : ''} ${wobble === 1 ? 'wobble' : ''}`}
          onClick={handlePlanetClick}
          onAnimationEnd={handleAnimationEnd}
        />
      </div>
      <div className='right-content'>
        <h2>Welcome to North Star!</h2>
        <h4>Please log in with your email and password.</h4>
        <form onSubmit={handleSubmit}>
          <div className='input-group'>
            <input
              type='email'
              value={email}
              onChange={handleInputChange}
              placeholder='Enter your email'
              required
              className='input-text'
              id='emailInput'
            />
            <input
              type='password'
              value={password}
              onChange={handleInputChange}
              placeholder='Enter your password'
              required
              className='input-text'
              id='passwordInput'
            />
          </div>
          <div className='button-group'>
            <button type='submit' className='login-button'>
              Log In
            </button>
            <button type='button' onClick={handleToggle} className='login-button'>
              Sign Up
            </button>
          </div>
        </form>
        <button onClick={handleGoogleLogin}>Sign in with Google</button>
      {error && <p className='error-text'>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
