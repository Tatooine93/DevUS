import React, { useState } from 'react';
import axios from 'axios';

const SingInForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault(); //Prevent reloading page
        const emailError = document.querySelector('.email.error');
        const passwordError = document.querySelector('.password.error');


        axios({
            method: "post",
            url: `${process.env.REACT_APP_API_URL}api/user/login`,
            withCredentials: true,
            data: {
                email,
                password
            },
        })

        .then((res) => {
            //console.log(res);
            if(res.data.errors){
                emailError.innerHTML = res.data.errors.email;
                passwordError.innerHTML = res.data.errors.password;
            }
            else {
                window.location = '/';
            }
        })
        
        .catch((err) => {
            console.log(err);
        })
    };

    return (
        <form action="" onSubmit={handleLogin} id="sign-in-form">
            <input type="text" name="email" id="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" value={email}/>
            <div className="email error"></div>
            <br/>
            <input type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" value={password}/>
            <div className="password error"></div>
            <br/>
            <input type="submit" value="se connecter"></input>
        </form>
    );
};

export default SingInForm;