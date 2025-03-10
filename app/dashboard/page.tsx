'use client'
import { Box, Typography, Grid } from "@mui/material";
import React from "react";
import axios from 'axios';
import Protected from "../protected-layout";
import { PieChart } from '@mui/x-charts/PieChart';


export default function Dashboard() {
    const URL = "http://localhost:5000";

    const [chartData, setChartData] = React.useState<{ value: number; label: string; color: string }[]>([]);
    const [name, setName] = React.useState<string>("");
    React.useEffect(() => {
        const fetchName = async () => {
            const token = await localStorage.getItem("authToken");
            if(!token){console.error("Token not found")
                return
            }
            try{
            const response = await axios.get(`http://localhost:5000/user/info`,{
                headers:{
                    "Authorization": token
                }
            })
            setName(response.data.user.name)
        }catch(e){
            console.error("Error setting name")
        }
        }
        
        const fetchData = async () => {
            try {
                const token = await localStorage.getItem("authToken");
                const response1 = await axios.get(`http://localhost:5000/expense/total-expense`,
                    {
                        headers: {
                            "Authorization": token
                        }
                    }
                )
                const response2 = await axios.get(`http://localhost:5000/income/total-income`,
                    {
                        headers: {
                            "Authorization": token
                        }
                    }
                )
                setChartData([
                    {
                        value: response1.data.total, // Extract the total expense
                        label: "Total Expense",
                        color: "#E0D4E6",
                    },
                    {
                        value: response2.data.total, // Extract the total expense
                        label: "Total Income",
                        color: "red",
                    }
                ]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchName();
        fetchData();
    }, []);

    return (
        <Protected>
            <Box sx={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Grid container spacing={4} sx={{ maxWidth: "80vw", alignItems: "center" }}>
                    <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center" }}>

                        <PieChart
                            series={[
                                {
                                    data: chartData,
                                    innerRadius: 55,
                                    outerRadius: 100,
                                    paddingAngle: 5,
                                    cornerRadius: 5,
                                    startAngle: -45,
                                    endAngle: 360,
                                    cx: 130,
                                    cy: 150,
                                    highlightScope: { fade: 'global', highlight: 'item' },
                                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                },
                            ]}
                            width={400}
                            height={300}
                            slotProps={{
                                legend: { labelStyle: { fill: "white" } }
                            }}

                        />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <Typography variant="h4" sx={{ color: "white", fontWeight: "bold" }}>
                            Welcome to FinSnap
                        </Typography>
                        <Typography variant="h6" sx={{color: "white"}}>
                            Hi! {name}

                        </Typography>
                    </Grid>
                </Grid>

            </Box>

        </Protected >
    )
}