


// // src/pages/Register.jsx (Full Code with Client-Side Password Validation)
// import React, { useState } from "react";
// import { useAuth } from "../context/AuthContext"; // Assuming this path is correct
// import { useNavigate } from "react-router-dom";

// // Regex for a strong password:
// const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

// function Register() {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password
//   const [message, setMessage] = useState(""); // General error message (e.g., from backend)
//   const [passwordError, setPasswordError] = useState(""); // Specific password strength error
//   const [confirmPasswordError, setConfirmPasswordError] = useState(""); // Confirm password mismatch error

//   const auth = useAuth(); // Access auth context
//   const navigate = useNavigate();

//   // Helper function for client-side password strength validation
//   const validatePassword = (pwd) => {
//     let errors = [];

//     if (pwd.length < 8) {
//       errors.push("Password must be at least 8 characters long.");
//     }
//     if (!/[a-z]/.test(pwd)) {
//       errors.push("Password must contain at least one lowercase letter.");
//     }
//     if (!/[A-Z]/.test(pwd)) {
//       errors.push("Password must contain at least one uppercase letter.");
//     }
//     if (!/\d/.test(pwd)) {
//       errors.push("Password must contain at least one number.");
//     }
//     if (!/[!@#$%^&*]/.test(pwd)) {
//       errors.push("Password must contain at least one special character (!@#$%^&*).");
//     }

//     return errors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage(""); // Clear general message
//     setPasswordError(""); // Clear password specific error
//     setConfirmPasswordError(""); // Clear confirm password error

//     // --- Client-side validation before sending to backend ---

//     // 1. Validate password strength
//     const passwordValidationMessages = validatePassword(password);
//     if (passwordValidationMessages.length > 0) {
//       setPasswordError(passwordValidationMessages.join(" ")); // Join errors into a single string
//       return; // Stop form submission if password is weak
//     }

//     // 2. Validate password confirmation
//     if (password !== confirmPassword) {
//       setConfirmPasswordError("Passwords do not match.");
//       return; // Stop form submission if passwords don't match
//     }

//     // If client-side validation passes, attempt to register via backend
//     try {
//       await auth.signUp(username, email, password);
//       navigate("/dashboard"); // Redirect to dashboard on successful registration
//     } catch (error) {
//       // Handle errors from the backend (e.g., user already exists, backend validation)
//       // Access error.response.data.message for Axios errors, or error.message for others
//       setMessage(error.response?.data?.message || error.message || "Registration failed. Please try again.");
//     }
//   };

//   return (
//     <div>
//       <h2>Register</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="username">Username:</label>
//           <input
//             type="text"
//             id="username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="email">Email:</label>
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="password">Password:</label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => {
//               setPassword(e.target.value);
//               // Provide immediate feedback on password strength as user types
//               const currentErrors = validatePassword(e.target.value);
//               setPasswordError(currentErrors.join(" "));
//             }}
//             required
//           />
//           {/* Display password strength error message */}
//           {passwordError && <p style={{ color: "orange", fontSize: "0.8em" }}>{passwordError}</p>}
//         </div>
//         <div>
//           <label htmlFor="confirmPassword">Confirm Password:</label>
//           <input
//             type="password"
//             id="confirmPassword"
//             value={confirmPassword}
//             onChange={(e) => {
//               setConfirmPassword(e.target.value);
//               // Provide immediate feedback if passwords don't match
//               if (e.target.value && e.target.value !== password) {
//                 setConfirmPasswordError("Passwords do not match.");
//               } else {
//                 setConfirmPasswordError("");
//               }
//             }}
//             required
//           />
//           {/* Display confirm password error message */}
//           {confirmPasswordError && <p style={{ color: "orange", fontSize: "0.8em" }}>{confirmPasswordError}</p>}
//         </div>
//         <button type="submit">Register</button>
//       </form>
//       {/* Display general registration error message */}
//       {message && <p style={{ color: "red" }}>{message}</p>}
//       <p>
//         Already have an account? <a href="/login">Login here</a>.
//       </p>
//     </div>
//   );
// }

// export default Register;



import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Make sure this path is correct
import { useNavigate } from "react-router-dom";

// Regex for a strong password
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const auth = useAuth();
  const navigate = useNavigate();

  // Client-side password validation
  const validatePassword = (pwd) => {
    let errors = [];

    if (pwd.length < 8) {
      errors.push("Password must be at least 8 characters.");
    }
    if (!/[a-z]/.test(pwd)) {
      errors.push("Password must contain a lowercase letter.");
    }
    if (!/[A-Z]/.test(pwd)) {
      errors.push("Password must contain an uppercase letter.");
    }
    if (!/\d/.test(pwd)) {
      errors.push("Password must contain a number.");
    }
    if (!/[!@#$%^&*]/.test(pwd)) {
      errors.push("Password must contain a special character (!@#$%^&*).");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setPasswordError("");
    setConfirmPasswordError("");

    const passwordValidationMessages = validatePassword(password);
    if (passwordValidationMessages.length > 0) {
      setPasswordError(passwordValidationMessages.join(" "));
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    }

    try {
      await auth.signUp(username, email, password);
      navigate("/dashboard");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Register</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                const currentErrors = validatePassword(e.target.value);
                setPasswordError(currentErrors.join(" "));
              }}
              required
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            />
            {passwordError && (
              <p style={{ color: "orange", fontSize: "0.8em" }}>
                {passwordError}
              </p>
            )}
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (e.target.value && e.target.value !== password) {
                  setConfirmPasswordError("Passwords do not match.");
                } else {
                  setConfirmPasswordError("");
                }
              }}
              required
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            />
            {confirmPasswordError && (
              <p style={{ color: "orange", fontSize: "0.8em" }}>
                {confirmPasswordError}
              </p>
            )}
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Register
          </button>
        </form>
        {message && (
          <p style={{ color: "red", marginTop: "1rem" }}>{message}</p>
        )}
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Already have an account? <a href="/login">Login here</a>.
        </p>
      </div>
    </div>
  );
}

export default Register;
