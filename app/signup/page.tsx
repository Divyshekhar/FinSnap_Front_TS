'use client';
import * as React from 'react';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Groups2Icon from "@mui/icons-material/Groups2";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { InputAdornment } from "@mui/material";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
// const URL = "https://finsnap-back-ts.onrender.com"
const URL = "http://localhost:5000";
export default function Signin() {
    const router = useRouter();
    const [email, setEmail] = React.useState("");
    const [name, setName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [error, setError] = React.useState("");

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${URL}/user/signup`, {
                name,
                email,
                password
            });

            const token = response.data.token;
            localStorage.setItem("authToken", token);
            router.push('/');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error signing in:", error.response?.data || error.message);
                setError("Please enter correct credentials");
            } else {
                console.error("Unexpected error:", error);
            }
        }
    };

    return (
        <Box
            sx={{
                background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100vh",
                justifyContent: "center",
            }}
        >
            <Paper
                sx={{
                    padding: "32px",
                    maxWidth: "400px",
                    width: "100%",
                    borderRadius: '10px',
                    backgroundColor: "#1E1E1E",
                    color: "white"
                }}
                elevation={3}
            >
                <Box sx={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                    <Groups2Icon sx={{ fontSize: 48, marginRight: "16px" }} />
                    <Typography sx={{ fontSize: 20, fontWeight: 'bold' }}>Sign Up</Typography>
                </Box>
                <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                    <TextField
                        label="Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={(e) => {
                            setError("");
                            setName(e.target.value);
                        }}
                        slotProps={{
                            inputLabel: { sx: { color: "grey" } },
                            input: { sx: { color: "white" } }
                        }}

                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => {
                            setError("");
                            setEmail(e.target.value);
                        }}
                        slotProps={{
                            inputLabel: { sx: { color: "grey" } },
                            input: { sx: { color: "white" } }
                        }}

                    />

                    <TextField
                        label="Password"
                        variant="outlined"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => {
                            setError("");
                            setPassword(e.target.value);
                        }}
                        slotProps={{
                            inputLabel: { sx: { color: "grey" } },
                            input: {
                                sx: { color: "white" },
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleTogglePasswordVisibility}>
                                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            },

                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        sx={{ mt: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Button onClick={() => { router.push('/signin') }}>Already have an account? Login Here</Button>
                    {error && (
                        <Typography variant="body2" color="error" gutterBottom>
                            {error}
                        </Typography>
                    )}
                </form>
            </Paper>
        </Box>
    );
}
