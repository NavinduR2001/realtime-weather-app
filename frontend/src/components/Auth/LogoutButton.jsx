import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm   "
    >
      Log Out
    </button>
  );
};

export default LogoutButton;