import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      onClick={() => loginWithRedirect()}
      className="px-8 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
    >
      Log In
    </button>
  );
};

export default LoginButton;