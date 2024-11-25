import './index.css';
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
  const { email, password, handleSubmit, handleInputChange, handleGoogleLogin, error } = useLogin();

  return (
    <div className='container'>
      <h2>Welcome to FakeStackOverflow!</h2>
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
          <button type='button' onClick={() => setShowLogIn(!showLogIn)} className='login-button'>
            Sign Up
          </button>
        </div>
      </form>
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
      {error && <p className='error-text'>{error}</p>}
    </div>
  );
};

export default Login;
