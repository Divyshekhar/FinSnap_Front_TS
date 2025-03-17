"use client"
import { CIcon } from '@coreui/icons-react';
import { useEffect, useState } from "react";
import { Typography, Box, Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress, Paper } from "@mui/material";
import Protected from "../protected-layout";
import { PieChart } from "@mui/x-charts";
import { SelectChangeEvent } from '@mui/material';
import axios from "axios";
import { cilBasket, cilBuilding, cilBusAlt, cilCart, cilHospital, cilPizza } from '@coreui/icons';


// const URL = "https://finsnap-back-ts.onrender.com/expense";
const URL = "http://localhost:5000/expense"

export default function Expenses() {
    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        date: "",
        category: "",
        description: ""
    });
    const categories = ["Housing", "Groceries", "Transportation", "Healthcare", "Food", "Others"];
    const [foodData, setFoodData] = useState<number>(0);
    const [healthData, setHealthData] = useState<number>(0);
    const [transportData, setTransportData] = useState<number>(0);
    const [groceriesData, setGroceriesData] = useState<number>(0);
    const [housingData, setHousingData] = useState<number>(0);
    const [otherData, setOtherData] = useState<number>(0);

    const [expenseChartData, setExpenseChatData] = useState([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "amount" ? Number(value) || 0 : value,  // Removed trim() to allow spaces
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${URL}/create`, formData, { withCredentials: true })
            console.log("Form data submitted successfully", response.data)
            fetchExpenseData();
            setFormData({ title: "", amount: "", date: "", category: "", description: "" });

        } catch (e) {
            console.log(e)
        }
    };
    type ExpenseItem = {
        category: string;
        _sum: {
            amount: number;
        };
    };
    const fetchExpenseData = async () => {
        try {
            const response = await axios.get(`${URL}/category`, {
                withCredentials: true
            })
            const chartData = response.data.map((item: ExpenseItem, index: number) => ({
                id: index,
                value: item._sum.amount,
                label: item.category
            }));
            const foodData = response.data.find((item: { category: string; }) => item.category === "Food")?._sum.amount || 0;
            const healthData = response.data.find((item: { category: string; }) => item.category === "Healthcare")?._sum.amount || 0;
            const transportData = response.data.find((item: { category: string; }) => item.category === "Transportation")?._sum.amount || 0;
            const housingData = response.data.find((item: { category: string; }) => item.category === "Housing")?._sum.amount || 0;
            const otherData = response.data.find((item: { category: string; }) => item.category === "Others")?._sum.amount || 0;
            const groceriesData = response.data.find((item: { category: string; }) => item.category === "Groceries")?._sum.amount || 0;

            setGroceriesData(groceriesData);
            setOtherData(otherData);
            setHousingData(housingData);
            setFoodData(foodData);
            setHealthData(healthData);
            setTransportData(transportData);
            setExpenseChatData(chartData);
        } catch (e) {
            console.error("Error occcured", e)
        }
    }


    useEffect(() => {
        fetchExpenseData();
    }, [])

    return (
        <Protected>
            <Box sx={{ width: "100vw", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "100px" }}>
                <Grid container spacing={4} sx={{ maxWidth: "80vw", alignItems: "center" }}>
                    <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center" }}>
                        {expenseChartData.length > 0 ? <PieChart
                            series={[
                                {
                                    data: expenseChartData,
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
                            <CircularProgress size="3rem" />
                        }

                    </Grid>

                    {/* Form Section */}
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <Paper sx={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '20px',
                            paddingTop: "12px",
                            padding: "12px",
                            position: "inherit",
                            marginTop: "50px",
                            marginLeft: "-50px",
                            marginRight: "-50px"
                        }}>
                            <Typography variant="h4" sx={{ color: "white", fontWeight: "bold", mb: 2, textAlign: "center" }}>
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
                                <TextField label="" name="date" type="date" value={formData.date} onChange={handleChange} fullWidth
                                    slotProps={{
                                        inputLabel: { sx: { color: "grey" } },
                                        input: { sx: { color: "grey" } }
                                    }}
                                />
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
                        </Paper>

                    </Grid>
                    <Grid item xs={12} md={12} sx={{ pb: 2, display: "flex", flexDirection: "column" }}>
                        <Paper sx={{
                            background: "rgba(255, 255, 255, 0.05)",
                            height: { xs: "305vh", sm: "305vh", md: "116vh" },
                            borderRadius: "20px",
                            paddingTop: "10px",
                        }}>
                            <Grid container spacing={4} sx={{ mb: 12, marginLeft: "5px", marginTop: "5px" }}>
                                <Grid item xs={12} md={4}>
                                    <Paper elevation={1} sx={{
                                        width: "80%",
                                        p: 4,
                                        height: 290,
                                        display: 'flex',
                                        flexDirection: 'column',
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
                                    ><Box sx={{
                                        width: 80,
                                        height: 80,
                                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 2,
                                    }}>
                                            <CIcon icon={cilPizza} style={{ color: "gold", width: "60px", height: "60px", padding: "7px" }} />
                                        </Box>
                                        <Typography variant="h6" sx={{ color: 'white', paddinTop: "10px" }}>
                                            Food Expense
                                        </Typography>
                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                            Total amount which was spent on food.
                                        </Typography>
                                        <Typography sx={{ mt: 6, justifyContent: "flex-end", color: "white", fontSize: "20px", fontWeight: "bold" }}>
                                            ₹{foodData.toLocaleString('en-IN')}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Paper elevation={1} sx={{
                                        width: "80%",
                                        p: 4,
                                        height: 290,
                                        display: 'flex',
                                        flexDirection: 'column',
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
                                    ><Box sx={{
                                        width: 80,
                                        height: 80,
                                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 2,
                                    }}>
                                            <CIcon icon={cilHospital} style={{ color: "red", width: "60px", height: "60px", padding: "7px" }} />
                                        </Box>
                                        <Typography variant="h6" sx={{ color: 'white', paddinTop: "10px" }}>
                                            Healthcare Expense
                                        </Typography>
                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                            Total amount which was spent on healthcare.
                                        </Typography>
                                        <Typography sx={{ mt: 6, justifyContent: "flex-end", color: "white", fontSize: "20px", fontWeight: "bold" }}>
                                            ₹{healthData.toLocaleString('en-IN')}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Paper elevation={1} sx={{
                                        width: "80%",
                                        p: 4,
                                        height: 290,
                                        display: 'flex',
                                        flexDirection: 'column',
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
                                    ><Box sx={{
                                        width: 80,
                                        height: 80,
                                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 2,
                                    }}>
                                            <CIcon icon={cilBusAlt} style={{ color: "green", width: "60px", height: "60px", padding: "7px" }} />
                                        </Box>
                                        <Typography variant="h6" sx={{ color: 'white', paddinTop: "10px" }}>
                                            Transportation Expense
                                        </Typography>
                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                            Total amount which was spent on transportation.
                                        </Typography>
                                        <Typography sx={{ mt: 5, justifyContent: "flex-end", color: "white", fontSize: "20px", fontWeight: "bold" }}>
                                            ₹{transportData.toLocaleString('en-IN')}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                            <Grid container spacing={4} sx={{ mb: 12, marginLeft: "5px", marginTop: "5px" }}>
                                <Grid item xs={12} md={4}>
                                    <Paper elevation={1} sx={{
                                        width: "80%",
                                        p: 4,
                                        height: 290,
                                        display: 'flex',
                                        flexDirection: 'column',
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
                                    ><Box sx={{
                                        width: 80,
                                        height: 80,
                                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 2,
                                    }}>
                                            <CIcon icon={cilCart} style={{ color: "gold", width: "60px", height: "60px", padding: "7px" }} />
                                        </Box>
                                        <Typography variant="h6" sx={{ color: 'white' }}>
                                            Groceries
                                        </Typography>
                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                            Total amount which was spent on groceries.
                                        </Typography>
                                        <Typography sx={{ mt: 6, justifyContent: "flex-end", color: "white", fontSize: "20px", fontWeight: "bold" }}>
                                            ₹{groceriesData.toLocaleString('en-IN')}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Paper elevation={1} sx={{
                                        width: "80%",
                                        p: 4,
                                        height: 290,
                                        display: 'flex',
                                        flexDirection: 'column',
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
                                    ><Box sx={{
                                        width: 80,
                                        height: 80,
                                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 2,
                                    }}>
                                            <CIcon icon={cilBuilding} style={{ color: "red", width: "60px", height: "60px", padding: "7px" }} />
                                        </Box>
                                        <Typography variant="h6" sx={{ color: 'white', paddinTop: "10px" }}>
                                            Housing Expense
                                        </Typography>
                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                            Total amount which was spent on housing.
                                        </Typography>
                                        <Typography sx={{ mt: 6, justifyContent: "flex-end", color: "white", fontSize: "20px", fontWeight: "bold" }}>
                                            ₹{housingData.toLocaleString('en-IN')}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Paper elevation={1} sx={{
                                        width: "80%",
                                        p: 4,
                                        height: 290,
                                        display: 'flex',
                                        flexDirection: 'column',
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
                                    ><Box sx={{
                                        width: 80,
                                        height: 80,
                                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 2,
                                    }}>
                                            <CIcon icon={cilBasket} style={{ color: "green", width: "60px", height: "60px", padding: "7px" }} />
                                        </Box>
                                        <Typography variant="h6" sx={{ color: 'white', paddinTop: "10px" }}>
                                            Other Expense
                                        </Typography>
                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                            Total amount which was spent on other things.
                                        </Typography>
                                        <Typography sx={{ mt: 6, justifyContent: "flex-end", color: "white", fontSize: "20px", fontWeight: "bold" }}>
                                            ₹{otherData.toLocaleString('en-IN')}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Protected>
    );
}
