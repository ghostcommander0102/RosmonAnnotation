import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import logoLogin from '../logo.png'
import { userActions } from '../_actions';

function RegisterPage(props) {
    
    const [user, setUser] = useState({
        email: '',
        username: '',
        password: '',
        confirm_password: ''
    });
    const [showflg, SetShowFlg] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const registering = useSelector(state => state.registration.registering);
    const dispatch = useDispatch();

    // reset login status
    useEffect(() => {
        dispatch(userActions.logout());
        if (props.location.pathname.split('/').length === 3) {
            var data = { ...user };
            data.username = "1";
            data.email = props.location.pathname.split("/")[2];
            setUser(data);
            SetShowFlg(0);
        }
    }, []);
    
    function handleChange(e) {
        const { name, value } = e.target;
        setUser(user => ({ ...user, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        setSubmitted(true);
        if (user.email && user.username && user.password && user.confirm_password) {
            dispatch(userActions.register(user));
        }
    }

    return (
        <div className="col-lg-5 offset-lg-2">
             <div className="login_logo">
            <img src={logoLogin} alt=""/>
        </div>
            <h2>Register</h2>
            <form name="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" name="username" value={user.username} onChange={handleChange} className={'form-control' + (submitted && !user.username ? ' is-invalid' : '') + (showflg ? "" : " hidden")} />
                    {submitted && !user.username &&
                        <div className="invalid-feedback">Username is required</div>
                    }
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={user.email} onChange={handleChange} className={'form-control' + (submitted && !user.email ? ' is-invalid' : '')} />
                    {submitted && !user.email &&
                        <div className="invalid-feedback">Email is required</div>
                    }
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={user.password} onChange={handleChange} className={'form-control' + (submitted && !user.password ? ' is-invalid' : '')} />
                    {submitted && !user.password &&
                        <div className="invalid-feedback">Password is required</div>
                    }
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input type="password" name="confirm_password" value={user.confirm_password} onChange={handleChange} className={'form-control' + (submitted && !user.confirm_password ? ' is-invalid' : '')} />
                    {submitted && !user.confirm_password &&
                        <div className="invalid-feedback">confirm_Password is required</div>
                    }
                </div>
                <div className="form-group">
                    <button className="btn btn-primary">
                        {registering && <span className="spinner-border spinner-border-sm mr-1"></span>}
                        Register
                    </button>
                    <Link to="/login" className="btn btn-link">Cancel</Link>
                </div>
            </form>
        </div>
    );
}

export { RegisterPage }