import './index.css';
import useSignUp from '../../hooks/useSignUp';

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
    handleGoogleSignUp,
  } = useSignUp();

  return (
    <div className='container'>
      <div className='right-content'>
        <h2>Welcome to North Star!</h2>
        <h4>Sign up with your email and password.</h4>
        <form onSubmit={handleSubmit}>
          <div className='input-group'>
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
          <div className='button-group'>
            <button type='submit' className='login-button'>
              Sign Up
            </button>
            <button type='button' onClick={() => setShowLogIn(!showLogIn)} className='login-button'>
              Back to Login
            </button>
          </div>
        </form>
        <button onClick={handleGoogleSignUp}>Sign Up With Google</button>
      {error && <p className='error-text'>{error}</p>}
      </div>
    </div>
  );
};

export default SignUp;
