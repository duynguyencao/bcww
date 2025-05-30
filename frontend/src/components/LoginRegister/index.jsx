import React, { useState } from "react";
import "./styles.css";

function LoginRegister({ onLogin }) {
  const [login, setLogin] = useState({});
  const [error, setError] = useState("");
  const [register, setRegister] = useState({});
  const [registerError, setRegisterError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8081/api/user/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(login),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Login failed");
      }
      const user = await response.json();
      onLogin(user);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
        const res = await fetch("http://localhost:8081/api/user/admin/register",{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(register),
        })
        if (!res.ok){
            setRegisterError("failed");
        }else{
            const loginRes = await fetch(`http://localhost:8081/api/user/admin/login`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({login_name: register.login_name, password: register.password})
            })
            if (loginRes.ok){
                const user = await loginRes.json();
                onLogin(user);
            }
        }
    }catch ( err ){
        setRegisterError("falied");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Login Name:</label>
          <input
            type="text"
            onChange={(e) => setLogin({ ...login, login_name: e.target.value })}
            required
          />
          <label>Password:</label>
          <input
            type="password"
            onChange={(e) => setLogin({ ...login, password: e.target.value })}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <h2>register</h2>
      <form onSubmit={handleRegister}>
        <div>
            <label>login name</label>
            <input type="text" onChange={e => setRegister({...register, login_name: e.target.value})} required/>
        </div>
        <div>
            <label>password</label>
            <input type="text" onChange={e => setRegister({...register, password: e.target.value})} required/>
        </div>
        <div>
            <label>first name</label>
            <input type="text" onChange={e => setRegister({...register, first_name: e.target.value})} required/>
        </div>
        <div>
            <label>last name</label>
            <input type="text" onChange={e => setRegister({...register, last_name: e.target.value})} required/>
        </div>
        <div>
            <label>location</label>
            <input type="text" onChange={e => setRegister({...register, location: e.target.value})} />
        </div>
        <div>
            <label>description</label>
            <input type="text" onChange={e => setRegister({...register, description: e.target.value})}/>
        </div>
        <div>
            <label>occupation</label>
            <input type="text" onChange={e => setRegister({...register, occupation: e.target.value})} required/>
        </div>
        <button type="submit">register</button>
      </form>
    </div>
  );
}

export default LoginRegister;
