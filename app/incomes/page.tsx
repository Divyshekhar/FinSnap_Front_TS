"use client"
import { useEffect, useState } from "react";
import { Typography, Box, Grid, TextField, Button, MenuItem, Select, InputLabel, FormControl, CircularProgress } from "@mui/material";
import Protected from "../protected-layout";
import { PieChart } from "@mui/x-charts";
import axios from "axios";

const URL = "http://localhost:5000/income"

export default function Incomes() {
    const [incomeChartData, setIncomeChartData] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        category: "",
        date: "",
        description: ""
    });
    const handleChange = (e: any) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "amount" ? Number(value) || 0 : value,  // Removed trim() to allow spaces
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log("This is form data", formData);

        const token = localStorage.getItem("authToken"); // Retrieve token

        if (!token) {
            console.error("No token found. Please log in again.");
            return;
        }
        try {
            const response = await axios.post(
                "http://localhost:5000/income/create",
                formData,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`, // Add Bearer prefix
                        "Content-Type": "application/json", // Ensure correct content type
                    },
                }
            );

            console.log("Form data submitted successfully", response.data);
            fetchIncomeData();
            setFormData({ title: "", amount: "", date: "", category: "", description: "" });
        } catch (error: any) {
            console.error("Error submitting form:", error.response?.data || error.message);
        }
    };
    const fetchIncomeData = async () => {
        const token = await localStorage.getItem('authToken');
        try {
            const response = await axios.get(`${URL}/category`, {
                headers: {
                    "Authorization": token
                }
            })
            const chartData = response.data.map((item: any, index: number) => ({
                id: index,
                value: item._sum.amount,
                label: item.category

            }))
            setIncomeChartData(chartData);
        }
        catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        fetchIncomeData();
    }, [])


    const categories = ["Salary", "Freelance", "Investments", "Business", "Other"];



    return (
        <Protected>
            <Box sx={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Grid container spacing={4} sx={{ maxWidth: "80vw", alignItems: "center" }}>
                    <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center" }}>
                        {incomeChartData.length > 0 ? <PieChart
                            series={[
                                {
                                    data: incomeChartData,
                                    innerRadius: 55,
                                    outerRadius: 100,
                                    paddingAngle: 5,
                                    cornerRadius: 5,
                                    startAngle: -45,
                                    endAngle: 360,
                                    cx: 130,
                                    cy: 150,
                                    highlightScope: { fade: "global", highlight: "item" },
                                    faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
                                },
                            ]}
                            width={400}
                            height={300}
                            slotProps={{
                                legend: { labelStyle: { fill: "white" } }
                            }}
                        /> :
                            <CircularProgress size="3rem"/>
                        }

                    </Grid>

                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <Typography variant="h4" sx={{ color: "#FFFFE4", fontWeight: "bold", mb: 2 }}>
                            Add Income
                        </Typography>

                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                            <TextField label="Title" name="title" value={formData.title} onChange={handleChange} fullWidth required
                                slotProps={{
                                    inputLabel: { sx: { color: "grey" } },
                                    input: { sx: { color: "white" } }
                                }}
                            />
                            <TextField label="Amount" name="amount" type="number" value={formData.amount} onChange={handleChange} fullWidth required
                                slotProps={{
                                    inputLabel: { sx: { color: "grey" } },
                                    input: { sx: { color: "white" } }
                                }}
                            />
                            <TextField label="" name="date" type="date" value={formData.date} onChange={handleChange} fullWidth
                                slotProps={{
                                    inputLabel: { sx: { color: "grey" } },
                                    input: { sx: { color: "grey" } }
                                }}
                            />

                            {/* Category Dropdown */}
                            <FormControl fullWidth required>
                                <InputLabel sx={{ color: "grey" }}>Category</InputLabel>
                                <Select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    sx={{
                                        color: "white", "& .MuiSelect-icon": {
                                            color: "grey",
                                        }
                                    }}
                                >
                                    {categories.map((category, index) => (
                                        <MenuItem key={index} value={category} >
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField label="Description" name="description" multiline rows={3} value={formData.description} onChange={handleChange} fullWidth required
                                slotProps={{
                                    inputLabel: { sx: { color: "grey" } },
                                    input: { sx: { color: "white" } }
                                }}
                            />

                            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                                Submit
                            </Button>
                        </form>
                    </Grid>

                </Grid>
            </Box>
        </Protected>
    );
}
