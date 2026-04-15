import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    const res = await register(name, email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.error || 'Failed to register');
    }
  };

  return (
    <div className={styles.container}>
      <Link to="/">
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon Logo" className={styles.logo} />
      </Link>
      <div className={styles.authBox}>
        <h1>Create account</h1>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSignup} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Your name</label>
            <input 
              type="text" 
              id="name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="First and last name"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
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
              placeholder="At least 6 characters"
              required
              minLength="6"
            />
          </div>
          <button type="submit" className={`btn-secondary ${styles.authBtn}`}>Continue</button>
        </form>
        <p className={styles.terms}>
          By creating an account, you agree to Amazon Clone's Conditions of Use and Privacy Notice.
        </p>
        <div className={styles.signinLink}>
          Already have an account? <Link to="/login">Sign in ⯈</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
