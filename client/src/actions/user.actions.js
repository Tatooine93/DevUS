import axios from "axios";

export const GET_USER = "GET_USER";

export const getUser = (uid) => {
  return (dispatch) => {
    //il dit quoi stocker dans le store, ce qui est envoyé au reducer
    return axios
      .get(`${process.env.REACT_APP_API_URL}api/user/${uid}`) // recup l'utilisateur
      .then((res) => {
        dispatch({ type: GET_USER, playload: res.data }); //dispatch au reducer
      })
      .catch((err) => console.log(err));
  };
};
