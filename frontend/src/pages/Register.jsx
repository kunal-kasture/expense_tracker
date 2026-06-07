import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    const result = await register(username, email, password);
    setLoading(false);

    if (result.success) {
      navigate("/login");
    } else {
      setError(result.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{ padding: 4, width: "100%", borderRadius: 2 }}
        >
          <Typography
            component="h1"
            variant="h5"
            align="center"
            gutterBottom
            fontWeight="600"
          >
            Register
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="confirmPassword"
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="success"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.2, fontWeight: "600" }}
            >
              {loading ? "Creating Account..." : "Register"}
            </Button>
            <Box sx={{ textAlign: "center", mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Box
                  component={RouterLink}
                  to="/login"
                  sx={{
                    color: "primary.main",
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                >
                  Login here
                </Box>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
