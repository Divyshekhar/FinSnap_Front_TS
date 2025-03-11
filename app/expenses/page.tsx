"use client"
import { useState } from "react";
import { Typography, Box, Grid, TextField, Button } from "@mui/material";
import Protected from "../protected-layout";
import { PieChart } from "@mui/x-charts";

export default function Incomes() {
    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        date: "",
        category: "",
        description: ""
    });

    const incomeChartData = [
        { id: 0, value: 10, label: "series A" },
        { id: 1, value: 15, label: "series B" },
        { id: 2, value: 20, label: "series C" },
    ];

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log("Submitted Data:", formData);
        setFormData({ title: "", amount: "", date: "", category: "", description: "" }); // Reset form
    };

    return (
        <Protected>
            <Box sx={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Grid container spacing={4} sx={{ maxWidth: "80vw", alignItems: "center" }}>

                    {/* Pie Chart */}
                    <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center" }}>
                        <PieChart
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
                        />
                    </Grid>

                    {/* Form Section */}
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <Typography variant="h4" sx={{ color: "#FFFFE4", fontWeight: "bold", mb: 2 }}>
                            Add Expense
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
                            <TextField label="" name="date" type="date" value={formData.date} onChange={handleChange} fullWidth required 
                                slotProps={{
                                    inputLabel: { sx: { color: "grey" } },
                                    input: { sx: { color: "grey" } }
                                }}
                            />
                            <TextField label="Category" name="category" value={formData.category} onChange={handleChange} fullWidth required 
                                slotProps={{
                                    inputLabel: { sx: { color: "grey" } },
                                    input: { sx: { color: "white" } }
                                }}
                            />
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
