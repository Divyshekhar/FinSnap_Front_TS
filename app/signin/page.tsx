"use client"
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
export default function signin() {

    const URL = "http://localhost:5000";
    const router = useRouter();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [error, setError] = React.useState("");

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };
    React.useEffect(() =>{
        const token = localStorage.getItem('authToken');
        if(token) router.push('/dashboard');

    }, [router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${URL}/user/signin`, {
                email,
                password
            });
            const token = response.data.token;
            localStorage.setItem("authToken", token);
            router.push('/dashboard');
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
                    borderRadius: '10px'
                }}
                elevation={3}
            >
                <Box sx={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                    <Groups2Icon sx={{ fontSize: 48, marginRight: "16px" }} />
                    <Typography sx={{ fontSize: 20, fontWeight: 'bold' }}>Sign In</Typography>
                </Box>
                <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                    <TextField
                        placeholder="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => {
                            setError("");
                            setEmail(e.target.value);
                        }}
                    />
                    <TextField
                        placeholder="Password"
                        variant="outlined"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => {
                            setError("");
                            setPassword(e.target.value);
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleTogglePasswordVisibility}>
                                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
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
                        Login
                    </Button>
                    <Button onClick={() => { router.push('/signup') }}>dont have an account? Register here</Button>
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
