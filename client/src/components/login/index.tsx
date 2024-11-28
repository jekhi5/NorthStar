import './index.css';
import { useEffect, useState } from 'react';
import starImage from '../../images/image.png';
import googleIcon from '../../images/google.png';
import githubIcon from '../../images/github.png';

import useLogin from '../../hooks/useLogin';

import alienShipImage from '../../images/alien-ship.png';

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
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isPopping, setIsPopping] = useState(true);
  const [showAlienShip, setShowAlienShip] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);

  const {
    email,
    password,
    handleSubmit,
    handleInputChange,
    error,
    setError,
    handleGoogleLogin,
    handleGithubLogin,
    handlePlanetClick,
    handleAnimationEnd,
    handleForgotPassword,
    wobble,
  } = useLogin();

  const handleToggle = () => {
    setIsSpinning(true);
    setIsPopping(false);
    setTimeout(() => {
      setIsSpinning(false);
      setShowLogIn(!showLogIn);
    }, 1000);
  };

  useEffect(() => {
    if (error) {
      setShowAlienShip(true);
      const timer = setTimeout(() => {
        setShowAlienShip(false);
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className='container'>
      <div className='left-content'>
        {showAlienShip && (
          <div className='alien-ship-container'>
            <img src={alienShipImage} alt='Alien Spaceship' className='alien-ship' />
            <div className='speech-bubble'>
              <p>{error}</p>
            </div>
          </div>
        )}
        <img
          src={starImage}
          alt='Planet'
          className={`spinning-star ${isSpinning ? 'spin' : ''} ${wobble === 1 ? 'wobble' : ''}`}
          onClick={handlePlanetClick}
          onAnimationEnd={handleAnimationEnd}
        />
      </div>
      <div className={`right-content ${isPopping ? 'popup' : 'popdown'}`}>
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
          <button type='submit' className='login-button'>
            Log In
          </button>
          <button className='forgot-button' onClick={handleForgotPassword}>
            Forgot Password
          </button>
        </form>
        <div className='or-section'>
          <hr className='line' />
          <span>or</span>
          <hr className='line' />
        </div>
        <div className='icon-login-buttons'>
          <button onClick={handleGithubLogin} className='icon-button'>
            <img src={githubIcon} alt='Github' />
          </button>
          <button onClick={handleGoogleLogin} className='icon-button'>
            <img src={googleIcon} alt='Google' />
          </button>
        </div>
        {/* {error && <p className='error-text'>{error}</p>} */}
        <span className='inline-span'>
          <p>Don&apos;t already have an account?</p>
          <button type='button' onClick={handleToggle} className='login-button'>
            Sign Up
          </button>
        </span>
      </div>
    </div>
  );
};

export default Login;
