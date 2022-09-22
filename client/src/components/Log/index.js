import React, { useState } from "react";
const Log = () => {
  const [signUpModal, setSignUpModal] = useState(true);
  const [signInModal, setSignInModal] = useState(false);

  return (
    <div className="connection-form">
      <div className="form-container">
        <ul>
          <li>S'inscrire</li>
          <li>Se connecter</li>
        </ul>
      </div>
    </div>
  );
};

export default Log;
