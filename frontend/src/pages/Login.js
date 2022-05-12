import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { attemptLogin } from '../services/User.service';
import { ReactComponent as Show } from '../assets/icons/Show.svg';
import { ReactComponent as Hide } from '../assets/icons/Hide.svg';
import { ReactComponent as Clear } from '../assets/icons/Input_Clear.svg';
import { isAuthed, setUsername, setRole, setUserId } from '../utils/User.profile';

function Login() {

    let navigate = useNavigate();

    const [ username, setLocalUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ passwordEmpty, setPasswordEmpty ] = useState(false);
    const [ usernameEmpty, setUsernameEmpty ] = useState(false);
    const [ loginIssue, setLoginIssue ] = useState(false);
    const [ showPassword, setShowPassword ] = useState(false);

    useEffect(() => {
        if (isAuthed()) {
            navigate("/");
        }
    }, []);

    return (
        <div className="outer">
            <div className="inner">
                <form className='login-form'>
                <div className="header">
                    <h2>Cage Inventory</h2>
                    <h4>Manage Your RIT Cage Items</h4>
                </div>

                <div className="acctInfo">
                    <h5>ACCOUNT INFORMATION</h5>
                </div>
                <div className="form-group" id="username-control-container">
                    <input type="text" name="username" onChange={e => {setLocalUsername(e.target.value); setUsernameEmpty(false);}} className={usernameEmpty || loginIssue ? "form-control error" : 'form-control'} placeholder="Username" value={username} />
                    <button className={!undefinedOrNull(username) ? "username-clear-control" : "username-clear-control hidden"} type="button" onClick={(e) => { setLocalUsername('') }}><Clear /></button>
                    <p className={usernameEmpty ? 'missing-username' : 'hidden'}>Username is required.</p>
                    <p className={loginIssue ? 'invalid-login' : 'hidden'}>Invalid username or password</p>
                </div>

                <div className="form-group" id="password-control-container">
                    <input type={showPassword ? "text" : "password"} name="password" onChange={e => {setPassword(e.target.value); setPasswordEmpty(false)}} className={passwordEmpty || loginIssue ? "form-control error" : 'form-control'} placeholder="Password" value={password} />
                    <button className={!undefinedOrNull(password) ? "password-show-control" : "password-show-control hidden"} type="button" onClick={(e) => { setShowPassword(!showPassword) }}>{showPassword ? <Hide /> : <Show /> }</button>
                    <p className={passwordEmpty ? 'missing-password' : 'hidden'}>Password is required.</p>
                    <p className={loginIssue ? 'invalid-login' : 'hidden'}>Invalid username or password</p>
                </div>

                <button type="button" className="btn btn-primary btn-block" onClick={(e) => {loginUser(e)}}>Login</button>
                </form>
            </div>
        </div>
    );

    function loginUser() {
        // resetting for ease lol
        setUsernameEmpty(false);
        setPasswordEmpty(false);

        // verify all fields are filled in, if not then highlight it
        if (!undefinedOrNull(username) && !undefinedOrNull(password)) {
            // if all filled in attempt to login using the user service
            // check if successful auth, if not highlight stuff
            attemptLogin(username, password)
                .then(response => {
                    // if successful auth, then maintain session and redirect to home page with user info
                    setLoginIssue(false);

                    // fill in session data
                    setUsername(response.data[0].username);
                    setRole(response.data[0].role_id);
                    setUserId(response.data[0].id);

                    // redirect to home page
                    navigate("/");
                })
                .catch((error) => { setLoginIssue(true); });

            return;
        }

        if (undefinedOrNull(username)) {
            setUsernameEmpty(true);
            setLoginIssue(false);
        }

        if (undefinedOrNull(password)) {
            setPasswordEmpty(true);
            setLoginIssue(false);
        }
    }

    function undefinedOrNull(input) {

        if (input === undefined || input === null || input === '') {
            return true;
        }

        return false;

    }

    // not using for now but still leaving in
    // function handleLoginError(error) {
    //     if (undefinedOrNull(error)) {
    //         return; // if an error happens during redirection it ends up here idk
    //     }

    //     // 500 - username issue
    //     if (error.response.status === 500) {
    //         console.log("username doesn't exist");
    //         setLoginIssue(true);
    //     }

    //     // 401 - password issue
    //     if (error.response.status === 401) {
    //         console.log("password wrong for user");
    //         setLoginIssue(true);
    //     }
    // }
}

export default Login;