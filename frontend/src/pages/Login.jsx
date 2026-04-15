import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.error || 'Failed to login');
    }
  };

  return (
    <div className={styles.container}>
      <Link to="/">
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon Logo" className={styles.logo} />
      </Link>
      <div className={styles.authBox}>
        <h1>Sign in</h1>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email or mobile phone number</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required
            />
          </div>
          <button type="submit" className={`btn-secondary ${styles.authBtn}`}>Continue</button>
        </form>
        <p className={styles.terms}>
          By continuing, you agree to Amazon Clone's Conditions of Use and Privacy Notice.
        </p>
      </div>
      <div className={styles.divider}>
         <h5>New to Amazon Clone?</h5>
      </div>
      <button className={styles.createBtn} onClick={() => navigate('/signup')}>
        Create your Amazon Clone account
      </button>
    </div>
  );
};

export default Login;
