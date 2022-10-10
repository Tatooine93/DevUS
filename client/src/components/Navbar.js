import React , { useContext } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { UidContext } from '../components/AppContext';
import Logout from './Log/Logout';

const Navbar = () => {
    const uid = useContext(UidContext);
    const userData = useSelector((state) => state.userReducer);

    return (
        <nav>
            <div className="nav-container">
                <div className="logo">
                    <NavLink exact="true" to="/">
                        <div className="logo">
                            <img src="" alt="logo"/>
                            <h3>DevUs</h3>
                        </div>
                    </NavLink>
                </div>
                
                <div className="matchPage">
                    <NavLink exact="true" to="/matchs">
                            <h3>Your Matchs</h3>
                    </NavLink>
                </div>

                {uid? (
                    <ul>
                        <li></li>
                        <li className="welcome">
                            <NavLink exact="true" to="/profile">
                                <h5>Bienvenue {userData.pseudo}</h5>
                            </NavLink>
                        </li>
                        <Logout/>
                    </ul>
                ) : (
                    <ul>
                        <li></li>
                        <li>
                            <NavLink exact="true" to="/profile">
                                <img src="" alt="icon-login"/>
                            </NavLink>
                        </li>
                    </ul>
                )}
            </div>
        </nav>
    )
}

export default Navbar