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
  } = useSignUp();

  return (
    <div className='container'>
      <h2>Welcome to FakeStackOverflow!</h2>
      <h4>Sign up with your email and password.</h4>
      <form onSubmit={handleSubmit} className='sign-up-form'>
        <div className='form-group-container'>
          <div className='form-group'>
            <input
              type='text'
              value={firstName}
              onChange={handleInputChange}
              placeholder='Enter your first name'
              required
              className='input-text'
              id='firstNameInput'
            />
          </div>
          <div className='form-group'>
            <input
              type='text'
              value={lastName}
              onChange={handleInputChange}
              placeholder='Enter your last name'
              required
              className='input-text'
              id='lastNameInput'
            />
          </div>
          <div className='form-group'>
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
          <div className='form-group'>
            <input
              type='email'
              value={email}
              onChange={handleInputChange}
              placeholder='Enter your email'
              required
              className='input-text'
              id='emailInput'
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              value={passwordOriginal}
              onChange={handleInputChange}
              placeholder='Enter your password'
              required
              className='input-text'
              id='passwordInputOriginal'
            />
          </div>
          <div className='form-group'>
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
        <div className='button-container'>
          <button type='submit' className='sign-up-button'>
            Sign Up
          </button>
        </div>
      </form>
      {error && (
        <p className='error-text' style={{ textAlign: 'center', marginLeft: '15px' }}>
          {error}
        </p>
      )}

      <div className='footer'>
        <span>Already have an account?</span>
        <button onClick={() => setShowLogIn(!showLogIn)} className='sign-up-button'>
          Login instead
        </button>
      </div>
    </div>
  );
};

export default SignUp;
