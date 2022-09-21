import React, { useState } from 'react';
import axios from 'axios';
import SingInForm from './SingInForm';

const SingUpForm = () => {
    const [formSubmit, setFormSubmit] = useState(false);
    const [pseudo, setPseudo] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [controlPassword, setControlPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        const terms = document.getElementById('terms');
        const pseudoError = document.querySelector('.pseudo.error');
        const emailError = document.querySelector('.email.error');
        const passwordError = document.querySelector('.password.error');
        const passwordConfirmError = document.querySelector('.password-conf.error');
        const termsError = document.querySelector('.terms.error');

        passwordConfirmError.innerHTML = ""; //to delete the errors message each time the form is submit
        termsError.innerHTML = ""; //idem

        if (password !== controlPassword || !terms.checked) {
            if (password !== controlPassword) {
                passwordConfirmError.innerHTML = "Les mots de passe ne correspondent pas";
            };
            if (!terms.checked) {
                termsError.innerHTML = "Veuillez valider les conditions générales";
            };
        }
        else {
            await axios({
                method: "post",
                url: `${process.env.REACT_APP_API_URL}api/user/register`,
                data: {
                    pseudo,
                    email,
                    password
                }
            })

            .then((res) => {
                console.log(res);
                if(res.data.errors) {
                    pseudoError.innerHTML = res.data.errors.pseudo;
                    emailError.innerHTML = res.data.errors.email;
                    passwordError.innerHTML = res.data.errors.password;
                }
                else {
                    setFormSubmit(true);
                }
            })

            .catch((err) => console.log(err))
        }
    }

    return (
        <>
            {formSubmit ? (
                <>
                <SingInForm/>
                <span></span>
                <h4 className="success">enregistrement réussi, veuillez vous connecter</h4>
                </>
            ) : (

            <form action="" onSubmit={handleRegister} id="sign-up-form">
                <input type="text" name="pseudo" id="pseudo" onChange={(e) => setPseudo(e.target.value)} placeholder="Pseudo" value={pseudo}/>
                <div className="pseudo error"></div>
                <br/>
                <input type="text" name="email" id="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" value={email}/>
                <div className="email error"></div>
                <br/>
                <input type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" value={password}/>
                <div className="password error"></div>
                <br/>
                <input type="password" name="password" id="password-conf" onChange={(e) => setControlPassword(e.target.value)} placeholder="Confimer mod de passe" value={controlPassword}/>
                <div className="password-conf error"></div>
                <br/>
                <input type="checkbox" id="terms"/>
                <label htmlFor='terms'>J'accepte les <a href="/" target="_blank" rel="noopener noreferrer">conditions générales</a></label>
                <div className="terms error"></div>
                <br/>
                <input type="submit" value="Valider inscription"/>
            </form>
            )}
        </>
    );
};

export default SingUpForm;