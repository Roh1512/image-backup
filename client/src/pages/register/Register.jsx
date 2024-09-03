import Styles from "./Register.module.css";
import { Form, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { axiosPrivate } from "../../api/axios";
import { useNavigate } from "react-router-dom";

const REGISTER_URL = "/auth/register";

const Register = () => {
  const navigate = useNavigate();
  const inputRef = useRef();
  const errRef = useRef();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (password === confirmpassword) {
        const response = await axiosPrivate.post(
          REGISTER_URL,
          JSON.stringify({
            username: username,
            email: email,
            password: password,
          })
        );

        import.meta.env.DEV && console.log(JSON.stringify(response?.data));
        setUsername("");
        setPassword("");
        setEmail("");
        setConfirmPassword("");
        setSuccess(true);
        setErrorMessage(null);
        navigate("/login");
      } else {
        setErrorMessage("Passwords does not match.");
        setSuccess(false);
        setIsLoading(false);
        throw new Error("Passwords does not match.");
      }
    } catch (error) {
      setSuccess(false);
      setIsLoading(false);
      console.log(error);

      if (!error?.response) {
        setErrorMessage(error?.message || "Error Registering user.");
      } else if (error?.response) {
        setErrorMessage(
          error?.response.data?.message ||
            error?.response?.statusText ||
            "Error Registering user."
        );
      } else {
        setErrorMessage("Error Registering user.");
      }
      if (errRef.current) {
        errRef.current.focus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={Styles.registerDiv}>
        <p className={Styles.extra}>
          Already Have an Account?{" "}
          <span>
            <Link to="/login">
              <Button variant="outline-warning">Log In</Button>
            </Link>
          </span>
        </p>
        <h3>Register New User</h3>
        <form className={Styles.loginForm} onSubmit={registerUser}>
          {errorMessage && (
            <p className="errmsg" ref={errRef} tabIndex={-1}>
              {errorMessage}
            </p>
          )}
          {success && (
            <p className={Styles.successMessage}>
              {"User Registered Successfully."}
            </p>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              id="username"
              ref={inputRef}
              type="text"
              placeholder="Enter your username."
              required
              autoComplete="off"
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email."
              required
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password."
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="confirmpassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Re-enter your password."
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
          <Button
            variant="success"
            className={Styles.submitBtn}
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Registering...
              </>
            ) : (
              "Register"
            )}
          </Button>
        </form>
      </div>
    </>
  );
};

export default Register;
