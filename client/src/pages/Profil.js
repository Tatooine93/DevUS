import React, { useContext } from "react";
import Log from "../components/Log";
import { UidContext } from "../components/AppContext";
// import ProfilPage from "../components/ProfilPage/ProfilPage";
import UpdateProfil from "../components/UpdateProfil/UpdateProfil";

const Profil = () => {
  const uid = useContext(UidContext);

  return (
    <div className="profil-page">
      {uid ? (
        <UpdateProfil />
      ) : (
        <div className="log-container">
          <Log signin={false} signup={true} />
          {/* props pour être déjà sur l'un des 2 choix*/}
          <div className="img-container">
            <img src="./img/log.svg" alt="ig-log" />
          </div>
        </div>
      )}
    </div>
  );
};
export default Profil;
