import { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

import {
  loginStart,
  loginFailure,
  loginSuccess,
} from "../../redux/user/userSlice.js";

import { useTheme } from "../../context/themeContext/ThemeContext.jsx";
import { useLoading, useError } from "../../redux/user/userHooks.js";
import AlertErrorMessage from "../../components/AlertErrorMessage.jsx";
import { useDispatch } from "react-redux";
import BackButton from "../../components/BackButton/BackButton.jsx";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef();
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const isLoading = useLoading();
  const isError = useError();

  const enterUsername = (e) => {
    setUsername("");
    setUsername(e.target.value);
  };
  const enterPassword = (e) => {
    setPassword("");
    setPassword(e.target.value);
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(loginStart());
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      // console.log(data);
      if (!response.ok) {
        dispatch(loginFailure(data));
        return;
      }
      dispatch(loginSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(loginFailure(error));
      console.log(error);
    }
  };

  return (
    <div>
      <BackButton />
      <p className="authParagraph">
        Do not have an account?{" "}
        <span>
          <Button
            variant="outline-success"
            size="sm"
            onClick={() => navigate("/home/signup")}
          >
            Sign up
          </Button>
        </span>
      </p>
      <Form
        onSubmit={handleSubmit}
        data-bs-theme={theme === "dark" ? "dark" : "light"}
        className="authForm"
      >
        <h1>Login here...</h1>
        <Form.Floating className="mb-3">
          <Form.Control
            id="username"
            type="text"
            placeholder="username"
            required
            ref={inputRef}
            value={username}
            onChange={enterUsername}
          />
          <label htmlFor="username">Username</label>
        </Form.Floating>
        <Form.Floating className="mb-3">
          <Form.Control
            id="password"
            type="password"
            placeholder="password"
            required
            value={password}
            onChange={enterPassword}
          />
          <label htmlFor="password">Password</label>
        </Form.Floating>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="form-action-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="lg"
                role="status"
                aria-hidden="true"
              />
              <span className="visually-hidden">Loading...</span>
            </>
          ) : (
            "Login"
          )}
        </Button>
        {isError && (
          <AlertErrorMessage
            message={isError.message || "Something went wrong"}
          />
        )}
      </Form>
    </div>
  );
};

export default Login;
