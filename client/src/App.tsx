import axios from 'axios';
import { FacebookProvider, LoginButton } from 'react-facebook';
import './App.css';

function App() {
  async function handleSuccess(response: any) {
    try {
      var result = await axios.post('http://localhost:5003/user/facebook', {
        userId: response.authResponse.userID,
        accessToken: response.authResponse.accessToken
      })
      console.log(result.data); 
    } catch (error) {
      console.log(error);     }
  }

  function handleError(error: any) {
    console.log(error);
  }

  return (
    <div className="App">
      <FacebookProvider appId={process.env.REACT_APP_FACEBOOK_CLIENT_ID}>
        <LoginButton
          scope="email"
          onError={handleError}
          onSuccess={handleSuccess}
        >
          Login via Facebook
        </LoginButton>
      </FacebookProvider>
    </div>
  );
}

export default App;
