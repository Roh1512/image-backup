import { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import Spinner from "react-bootstrap/Spinner";

import { useTheme } from "../../context/themeContext/ThemeContext";
import { useLoading, useError } from "../../redux/user/userHooks";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../redux/user/userSlice";
import AlertErrorMessage from "../../components/AlertErrorMessage";
import BackButton from "../../components/BackButton/BackButton";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef();
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const isLoading = useLoading();
  const isError = useError();

  const passwordMatch =
    password && confirmPassword && password === confirmPassword;

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      dispatch(loginStart());
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
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
      console.error(error);
      loginFailure(error);
    }
  };

  return (
    <div>
      <BackButton />
      <p className="authParagraph">
        Do not have an account?{" "}
        <span>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => navigate("/home/login")}
          >
            Login
          </Button>
        </span>
      </p>
      <Form
        data-bs-theme={theme === "dark" ? "dark" : "light"}
        className="authForm"
        onSubmit={handleSignup}
      >
        <h1>Sign Up</h1>
        <Form.Floating className="mb-3">
          <Form.Control
            id="email"
            type="email"
            placeholder="email"
            required
            ref={inputRef}
            value={email}
            onChange={handleEmail}
            disabled={isLoading}
          />
          <label htmlFor="email">Email Id</label>
        </Form.Floating>
        <Form.Floating className="mb-3">
          <Form.Control
            id="username"
            type="text"
            placeholder="username"
            required
            value={username}
            onChange={handleUsername}
            disabled={isLoading}
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
            onChange={handlePassword}
            className={
              passwordMatch === true
                ? "passwordInputSuccess"
                : passwordMatch === false
                ? "passwordInputError"
                : ""
            }
            disabled={isLoading}
          />
          <label htmlFor="password">Password</label>
        </Form.Floating>
        <Form.Floating className="mb-3">
          <Form.Control
            id="confirmPassword"
            type="password"
            placeholder="confirm password"
            required
            value={confirmPassword}
            onChange={handleConfirmPassword}
            className={
              passwordMatch === true
                ? "passwordInputSuccess"
                : passwordMatch === false
                ? "passwordInputError"
                : ""
            }
            disabled={isLoading}
          />
          <label htmlFor="confirmPassword">Confirm Password</label>
        </Form.Floating>
        {passwordMatch === false ? (
          <p className="errorText">
            <ImCross /> Passwords do not match
          </p>
        ) : passwordMatch === true ? (
          <p className="successtext">
            <FaCheck /> Passwords match
          </p>
        ) : null}
        <Button
          type="submit"
          variant="success"
          size="lg"
          className="form-action-button"
          disabled={
            (passwordMatch === false
              ? true
              : passwordMatch === true
              ? false
              : true) || isLoading
          }
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
            "Sign Up"
          )}
        </Button>
        {isError && (
          <AlertErrorMessage message={isError.message || "Sign up failed."} />
        )}
      </Form>
    </div>
  );
};

export default Signup;
