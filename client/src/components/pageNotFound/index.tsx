import { useNavigate } from 'react-router-dom';

export default function PageNotFound() {
  const navigate = useNavigate();
  return (
    <div>
      <div>Page not found!</div>
      <button onClick={() => navigate('/home')}>Home</button>
    </div>
  );
}
