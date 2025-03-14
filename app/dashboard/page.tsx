'use client'
import { Box, Typography, Grid, CircularProgress, Paper } from "@mui/material";
import React, { useState } from "react";
import axios from 'axios';
import Protected from "../protected-layout";
import { PieChart } from '@mui/x-charts/PieChart';
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    
    const URL = "https://finsnap-back-ts.onrender.com";
    const router = useRouter();
    const [chartData, setChartData] = React.useState<{ value: number; label: string; color: string }[]>([]);
    const [name, setName] = React.useState<string>("");
    const [income, setIncome] = useState<number>(0);
    const [expense, setExpense] = useState<number>(0);

    React.useEffect(() => {
        const fetchName = async () => {
            const token = await localStorage.getItem("authToken");
            if (!token) {
                console.error("Token not found")
                return
            }
            try {
                const response = await axios.get(`${URL}/user/info`, {
                    headers: {
                        "Authorization": token
                    }
                })
                setName(response.data.user.name)
            } catch (e) {
                console.error("Error setting name", e)
            }
        }

        const fetchData = async () => {
            try {
                const token = await localStorage.getItem("authToken");
                const response1 = await axios.get(`${URL}/expense/total-expense`,
                    {
                        headers: {
                            "Authorization": token
                        }
                    }
                )
                const response2 = await axios.get(`${URL}/income/total-income`,
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
                        color: "#E16A54",
                    },
                    {
                        value: response2.data.total, // Extract the total expense
                        label: "Total Income",
                        color: "#D0E8C5",
                    }
                ])
                setIncome(response2.data.total);
                setExpense(response1.data.total);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchName();
        fetchData();
    }, []);

    return (
        <Protected>
            <Box sx={{ width: "100vw", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "200px" }}>
                <Grid container spacing={4} sx={{ maxWidth: "80vw", alignItems: "center" }}>
                    <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center" }}>
                        {chartData.length > 0 ? <PieChart
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

                        /> :
                            <CircularProgress size="3rem" />
                        }

                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <Typography variant="h3" sx={{ color: "white", fontWeight: "bold" }}>
                            Welcome to FinSnap
                        </Typography>
                        <Typography variant="h5" sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                        }}>
                            Hi! {name}<br />
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={12} sx={{ display: "flex", justifyContent: "center", }}>

                        <Typography sx={{ color: "white", fontWeight: "bold", fontSize: "30px" }}>
                            Overview
                        </Typography>


                    </Grid>
                    <Grid item xs={12} md={12} sx={{ pb: 2 }}>
                        <Paper sx={{
                            background: "rgba(255, 255, 255, 0.05)",
                            height: { xs: "150vh", sm: "150vh", md: "55vh" },
                            borderRadius: "20px",
                            paddingTop: "10px",
                        }}>
                            <Grid container spacing={4} sx={{ mb: 12, marginLeft: "5px", marginTop: "5px" }}>
                                <Grid item xs={12} md={4}>
                                    <Paper elevation={1} sx={{
                                        width: "80%",
                                        p: 4,
                                        height: 290, // Fixed height
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        borderRadius: "20px",
                                        cursor: "pointer",
                                        transition: 'all 0.3s',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        backdropFilter: 'blur(10px)',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            background: 'rgba(255, 255, 255, 0.08)'
                                        }
                                    }}
                                        onClick={() => { router.push('/dashboard') }}
                                    >
                                        <Box sx={{
                                            width: 48,
                                            height: 48,
                                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                                            borderRadius: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 2
                                        }}>
                                            <DollarSign size={24} color="gold" />
                                        </Box>
                                        <Typography variant="h6" sx={{ color: 'white' }}>
                                            Total Balance
                                        </Typography>
                                        <Typography sx={{ mt: 0, color: 'rgba(255, 255, 255, 0.7)' }}>
                                            Net amount after all the income and expenses.

                                        </Typography>
                                        <Typography sx={{ mt: 5, color: "white", fontSize: "20px", fontWeight: "bold" }}>
                                            ₹{(income - expense).toLocaleString('en-IN')}
                                        </Typography>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Paper elevation={1} sx={{
                                        width: "80%",
                                        p: 4,
                                        height: 290, // Fixed height
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        transition: 'all 0.3s',
                                        borderRadius: "20px",
                                        cursor: "pointer",
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        backdropFilter: 'blur(10px)',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            background: 'rgba(255, 255, 255, 0.08)'
                                        }
                                    }}
                                        onClick={() => { router.push('/incomes') }}
                                    >
                                        <Box sx={{
                                            width: 48,
                                            height: 48,
                                            paddingBottom: 1.2,
                                            paddingLeft: 2,
                                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                                            borderRadius: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <Box sx={{ mt: 1.3, mr: 2 }}>
                                                <TrendingUp size={24} color="#00ff11" />
                                            </Box>
                                        </Box>
                                        <Typography variant="h6" sx={{ color: 'white' }}>
                                            Total Income
                                        </Typography>
                                        <Typography sx={{ mt: 0, color: 'rgba(255, 255, 255, 0.7)' }}>
                                            Total amount that you recieved.

                                        </Typography>
                                        <Typography sx={{ mt: 5, color: "white", fontSize: "20px", fontWeight: "bold" }}>
                                            ₹{income.toLocaleString('en-IN')}
                                        </Typography>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Paper elevation={1} sx={{
                                        width: "80%",
                                        cursor: "pointer",
                                        p: 4,
                                        height: 290, // Fixed height
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        transition: 'all 0.3s',
                                        borderRadius: "20px",
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        backdropFilter: 'blur(10px)',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            background: 'rgba(255, 255, 255, 0.08)',

                                        }
                                    }}
                                        onClick={() => { router.push('/expenses') }}
                                    >
                                        <Box sx={{
                                            width: 48,
                                            height: 48,
                                            paddingBottom: 1.2,
                                            paddingLeft: 2,
                                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                                            borderRadius: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 2
                                        }}>
                                            <Box sx={{ mt: 1.2, mr: 2 }}>
                                                <TrendingDown size={24} color="red" />
                                            </Box>
                                        </Box>
                                        <Typography variant="h6" sx={{ mb: 1, color: 'white' }}>
                                            Total Expense
                                        </Typography>
                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                            Total amount which was spent throughout.
                                        </Typography>
                                        <Typography sx={{ mt: 6, justifyContent: "flex-end", color: "white", fontSize: "20px", fontWeight: "bold" }}>
                                            ₹{expense.toLocaleString('en-IN')}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>

                        </Paper>
                    </Grid>
                </Grid>

            </Box>

        </Protected >
    )
}

//dollar sign colour="#5ec965"