import './index.css';
import { useState } from 'react';
import useSignUp from '../../hooks/useSignUp';
import starImage from '../../images/image.png';
import googleIcon from '../../images/google.png';
import githubIcon from '../../images/github.png';

/**
 * Sign Up Component contains a form for Firebase email/password authentication.
 */
const SignUp = ({
  showLogIn,
  setShowLogIn,
}: {
  showLogIn: boolean;
  setShowLogIn: (showLogIn: boolean) => void;
}) => {
  const {
    firstName,
    lastName,
    email,
    passwordOriginal,
    passwordConfirmation,
    handleSubmit,
    handleInputChange,
    error,
    username,
    handlePlanetClick,
    handleAnimationEnd,
    wobble,
    handleGoogleSignUp,
    handleGithubSignUp,
  } = useSignUp();

  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isPopping, setIsPopping] = useState(true);

  const handleToggle = () => {
    setIsSpinning(true);
    setIsPopping(false);
    setTimeout(() => {
      setIsSpinning(false);
      setShowLogIn(!showLogIn);
    }, 1000);
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
      <div className={`right-content ${isPopping ? 'popup' : 'popdown'}`}>
        <h2>Welcome to North Star!</h2>
        <h4>Sign up with your email and password.</h4>
        <form onSubmit={handleSubmit} className='signup-form'>
          <div className='fields'>
            <div className='left-group'>
              <input
                type='text'
                value={firstName}
                onChange={handleInputChange}
                placeholder='Enter your first name'
                required
                className='input-text'
                id='firstNameInput'
              />
              <input
                type='text'
                value={lastName}
                onChange={handleInputChange}
                placeholder='Enter your last name'
                required
                className='input-text'
                id='lastNameInput'
              />
              <input
                type='text'
                value={username}
                onChange={handleInputChange}
                placeholder='Enter your desired username'
                required
                className='input-text'
                id='usernameInput'
              />
            </div>
            <div className='right-group'>
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
                value={passwordOriginal}
                onChange={handleInputChange}
                placeholder='Enter your password'
                required
                className='input-text'
                id='passwordInputOriginal'
              />
              <input
                type='password'
                value={passwordConfirmation}
                onChange={handleInputChange}
                placeholder='Confirm your password'
                required
                className='input-text'
                id='passwordInputConfirmation'
              />
            </div>
          </div>
          <button type='submit' className='login-button'>
            Sign Up
          </button>
        </form>
        <div className='or-section'>
          <hr className='line' />
          <span>or</span>
          <hr className='line' />
        </div>
        <div className='icon-login-buttons'>
          <button onClick={handleGithubSignUp} className='icon-button'>
            <img src={githubIcon} alt='Github' />
          </button>
          <button onClick={handleGoogleSignUp} className='icon-button'>
            <img src={googleIcon} alt='Google' />
          </button>
        </div>
        {error && <p className='error-text'>{error}</p>}
        <span className='inline-span'>
          <p>Already have an account?</p>
          <button type='button' onClick={handleToggle} className='login-button'>
            Log In
          </button>
        </span>
      </div>
    </div>
  );
};

export default SignUp;
