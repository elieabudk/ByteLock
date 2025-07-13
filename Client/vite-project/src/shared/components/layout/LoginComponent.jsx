import { useState, useEffect, useRef } from 'react';
import { LoginLogic } from '../../helpers/LoginLogica';
import '../../../assets/styles/LoginStyle.css';
import { GoogleLogin } from '@react-oauth/google';
import { authGoogle } from '../../helpers/Google';
import { ValidarToken } from '../../helpers/ValidarToken';


export const LoginComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const focusRef = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        LoginLogic(email, password);
    }

    // Error handler para GoogleLogin
    const handleGoogleError = () => {
        console.log("Error de login con Google");
    }

    useEffect(() => {
        // Verificar si hay un token válido al cargar el componente
        ValidarToken();
        focusRef.current.focus();
    }, []);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#f0f2f5',
            padding: '20px'
        }}>
            <div className="container">
                <h2 className="heading">Login</h2>
                <form className="form" onSubmit={handleSubmit}>
                    <input 
                        ref={focusRef}
                        type="email" 
                        className="input" 
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        autoComplete="email"
                    />
                    <input 
                        type="password" 
                        className="input" 
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                    />
                    <div className="forgot-password">
                        <a href="#">Forgot Password?</a>
                    </div>
                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>
                
                <div className="social-account-container">
                    <span className="title">Or Sign in with</span>
                    <div className="social-accounts">
                        
                        <div className="google-button">
                            <GoogleLogin
                                onSuccess={authGoogle}
                                onError={handleGoogleError}
                                size="medium"
                                shape="circle"
                            />
                        </div>
                    </div>
                </div>
                
                <span className="agreement">
                    <a href="#">Terms of Use & Privacy Policy</a>
                </span>
            </div>
        </div>
    )
}