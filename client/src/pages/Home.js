import React, {useContext, useEffect, useState} from 'react';
import Carousel from '../components/homepage/Carousel';
import Profiles from '../components/homepage/Profiles';
import { UidContext } from "../components/AppContext";
import { Navigate } from 'react-router';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Home = () => {
    const uid = useContext(UidContext);
    const [users, setUsers] = useState([]);
    const userData = useSelector((state) => state.userReducer);
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);
    const geolocationAPI = navigator.geolocation;
    //const userFilters = new URLSearchParams(userData);
    //console.log(users)
    //console.log(userData.liked);

    const getLocation = async () => {
        if (geolocationAPI) {
            geolocationAPI.getCurrentPosition((position) => {
                const { coords } = position;
                setLat(coords.latitude);
                setLong(coords.longitude);
            }, (error) => {
                console.log(error);
            });
        } 
        else {
            console.log("Geolocation is not supported by this browser.");
        }
    };
    getLocation();

    const setUserLocation = async () => {

        try {
            await axios({
                method: "put",
                url: `${process.env.REACT_APP_API_URL}api/user/${uid}`,
                data: {
                    filters:{
                        location: [long, lat] // longitude before latitude !!!
                    },
                }
            });
        }
        catch(err) {
            console.log(err);
        }
    };
    setUserLocation();

    useEffect(() => {
        const getUsers = async () => {
            try {
                const res = await axios({
                    method: "get",
                    url: `${process.env.REACT_APP_API_URL}api/user/`,
                    withCredentials: true,
                    params: {
                        uid: uid,
                        tags: userData.filters.tags,
                        minAge: userData.filters.minAge,
                        maxAge: userData.filters.maxAge,
                        //orientation: userData.filters.orientation,
                        distance: userData.filters.distance,
                        location: userData.filters.location,
                        //location: [5.5666,50.6333],
                        matchs: userData.matchs,
                        liked: userData.liked,

                    }
                    },);
                    setUsers(res.data);
            }
            catch(err) {
                console.log(err);
            }
        }
        getUsers();
    }, []);

    return (
        <div className='swipe profil-page' style={{ maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto', marginTop: 64 }}>
            {uid ? (
                <Carousel>
                    {users.map((u) => (
                        (userData.matchs.includes(u._id) || userData.liked.includes(u._id) || uid===u._id? null:<Profiles user={u} key={u._id}/>)
                    ))}
                </Carousel>
        ):(
            <Navigate to="/profile"/>
        )}
        </div>
    );
};

export default Home;