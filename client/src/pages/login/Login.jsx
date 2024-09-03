import { Form, Button, Spinner } from "react-bootstrap";
import Styles from "./Login.module.css";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import axios from "../../api/axios";
import useInput from "../../hooks/useInput";
import useToggle from "../../hooks/useToggle";
import useAuth from "../../hooks/useAuth";

const env = import.meta.env.MODE;

const LOGIN_URL = "/auth/login";

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  const [check, toggleCheck] = useToggle("persist", false);
  const [user, resetUser, userAttribs] = useInput("user", "");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const userRef = useRef();
  const errRef = useRef();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ username: user, password: password }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (env === "development") {
        console.log(JSON.stringify(response?.data));
        console.log("Cookie: ", document.cookie);
      }
      const accessToken = response?.data?.accessToken;
      setAuth({ user, accessToken });
      resetUser(); //setUser("")
      setPassword("");
      navigate(from, { replace: true });
    } catch (error) {
      if (env === "development") {
        console.log("Error: ", error);
      }
      if (!error?.response) {
        setErrMsg(error.message);
      } else if (error?.response) {
        setErrMsg(error.response.data.message);
      } else {
        setErrMsg("Login failed");
      }
      errRef.current.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className={Styles.login}>
        <p className={Styles.extra}>
          {"Don't have and account?"}{" "}
          <span>
            <Link to="/register">
              <Button variant="outline-info">Register</Button>
            </Link>
          </span>
        </p>
        <h3>Log In</h3>
        <form onSubmit={handleSubmit} className={Styles.loginForm}>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your username."
              ref={userRef}
              required
              autoComplete="off"
              {...userAttribs}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password."
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <div className="mb-3">
            <Form.Check // prettier-ignore
              type="checkbox"
              id="persist"
              label="Trust this device?"
              className={Styles.persistCheckbox}
              checked={check}
              onChange={toggleCheck}
              aria-label="Trust this device?"
            />
          </div>
          <Button
            variant="primary"
            type="submit"
            className={Styles.submitBtn}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Loading...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </section>
    </>
  );
};

export default Login;
