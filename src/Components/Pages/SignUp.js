import { useState } from "react";
import Input from "../Form/Input";
import styles from "./SignUp.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
const API_URL = "http://localhost:3003/user/create";

function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();

  const [register, setRegister] = useState({
    username: "",
    email: "",
    birth_date: "",
    password: "",
    confirm_password: "",
  });
  const [formErrors, setFormErrors] = useState();

  function handleChange(e) {
    setRegister({
      ...register,
      [e.target.name]: e.target.value,
    });
    console.log(register)
  }

  function submit(e) {
    e.preventDefault();
    if (!validate()) return false;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3004",
        "Access-Control-Allow-Credentials": true,
      },
      credentials: "include",
      body: JSON.stringify({
        username: register.username,
        password: register.password,
        email: register.email,
        birthdate: register.birth_date,
      }),
    };
    fetch(API_URL, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (!data?.id) {
          const errors = {};
          errors.login = "We had a problem try later";
          setFormErrors(errors);
          return false;
        }
        navigate("/signin", {
          state: { message: "Account created successfully", type: "success" },
        });
      })
      .catch((err) => console.log(err));
  }
  function validate() {
    const errors = {};
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const passwordRegex = /[0-9]/;
    const { username, email, birth_date, password, confirm_password } =
      register;
    if (!username) {
      errors.username = "Username is required";
    }
    if (!email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Invalid Email";
    }
    const dateUS = new Date(birth_date);
    const dateNow = new Date();

    if (!birth_date) {
      errors.birth_date = "Birth Date is required";
    } else if (dateUS > dateNow) {
      errors.birth_date = "Your date of birth is greater than the current date";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password is too short";
    } else if (password.length > 40) {
      errors.password = "Password is too long";
    } else if (!passwordRegex.test(password)) {
      errors.password = "Password must contain at least one number";
    }

    if (!confirm_password) {
      errors.confirm_password = "Confirm password is required";
    } else if (password !== confirm_password) {
      errors.confirm_password = "Password is different from confirm password";
    }

    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      return true;
    }
    return false;
  }
  return (
    <div className={styles.container}>
      <div className={styles.form_container}>
        <h1 className={styles.form_header}>Create an account</h1>
        <form className={styles.form} onSubmit={submit}>
          <Input
            type="text"
            text="Username"
            name="username"
            handleOnChange={handleChange}
            placeholder="Username"
            error={formErrors?.username}
          />
          <Input
            type="email"
            text="Email"
            name="email"
            handleOnChange={handleChange}
            placeholder="Email"
            error={formErrors?.email}
          />

          <Input
            type="date"
            text="Birth Date"
            name="birth_date"
            handleOnChange={handleChange}
            error={formErrors?.birth_date}
          />

          <Input
            type="password"
            text="Password"
            name="password"
            handleOnChange={handleChange}
            placeholder="Password"
            error={formErrors?.password}
          />

          <Input
            type="password"
            text="Confirm Password"
            name="confirm_password"
            handleOnChange={handleChange}
            placeholder="Confirm Password"
            error={formErrors?.confirm_password}
          />

          <input
            value="Create Account"
            className={styles.input_submit}
            type="submit"
          />
          <p className={styles.input_error}>{formErrors?.login}</p>
          <p>
            Already have an account? <Link to="/signin"> Login </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
