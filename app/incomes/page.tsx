"use client"
import { useEffect, useState } from "react";
import { Typography, Box, Grid, TextField, Button, MenuItem, Select, InputLabel, FormControl, CircularProgress, Paper, SelectChangeEvent } from "@mui/material";
import Protected from "../protected-layout";
import { PieChart } from "@mui/x-charts";
import axios, { AxiosError } from "axios";
import CIcon from "@coreui/icons-react";
import { cilCash, cilChart, cilCoffee, cilDollar, cilWallet } from "@coreui/icons";
import { useRouter } from "next/navigation";

const URL = "https://finsnap-back-ts.onrender.com/income";

export default function Incomes() {
    const [incomeChartData, setIncomeChartData] = useState([]);
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        category: "",
        date: "",
        description: ""
    });
    const [salaryData, setSalaryData] = useState<number>(0);
    const [freelanceData, setFreelanceData] = useState<number>(0);
    const [businessData, setBusinessData] = useState<number>(0);
    const [investmentData, setInvestmentData] = useState<number>(0);
    const [otherData, setOtherData] = useState<number>(0);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "amount" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("This is form data", formData);

        const token = localStorage.getItem("authToken"); // Retrieve token

        if (!token) {
            console.error("No token found. Please log in again.");
            return;
        }
        try {
            const response = await axios.post(
                `${URL}/create`,
                formData,
                {
                    headers: {
                        "Authorization": token, // Add Bearer prefix
                    },
                }
            );

            console.log("Form data submitted successfully", response.data);
            fetchIncomeData();
            setFormData({ title: "", amount: "", date: "", category: "", description: "" });
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.error("Axios error:", error.response?.data || error.message);
            } else {
                console.error("Unexpected error:", error);
            }
        }
    };
    type IncomesType = {
        category: string;
        _sum: {
            amount: number;
        };
    };
    const fetchIncomeData = async () => {
        const token = await localStorage.getItem('authToken');
        try {
            const response = await axios.get(`${URL}/category`, {
                headers: {
                    "Authorization": token
                }
            })
            const chartData = response.data.map((item: IncomesType, index: number) => ({
                id: index,
                value: item._sum.amount,
                label: item.category

            }))
            const salaryData = response.data.find((item: { category: string; }) => item.category === "Salary")?._sum.amount || 0;
            const freelanceData = response.data.find((item: { category: string; }) => item.category === "Freelance")?._sum.amount || 0;
            const businessData = response.data.find((item: { category: string; }) => item.category === "Business")?._sum.amount || 0;
            const investmentData = response.data.find((item: { category: string; }) => item.category === "Investments")?._sum.amount || 0;
            const otherData = response.data.find((item: { category: string; }) => item.category === "Other")?._sum.amount || 0;

            setOtherData(otherData);
            setInvestmentData(investmentData);
            setBusinessData(businessData);
            setFreelanceData(freelanceData);
            setSalaryData(salaryData);
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
            <Box sx={{ width: "100vw", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "100px" }}>
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
                            <CircularProgress size="3rem" />
                        }

                    </Grid>

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
                        </Paper>
                    </Grid>




                    {/* This is the bottom section */}




                    <Grid item xs={12} md={12} sx={{ pb: 2, display: "flex", flexDirection: "column" }}>
                        <Paper sx={{
                            background: "rgba(255, 255, 255, 0.05)",
                            height: { xs: "265vh", sm: "245vh", md: "120vh", lg: "120vh" },
                            borderRadius: "20px",
                            paddingTop: "10px",
                        }}>
                            <Grid container spacing={4} sx={{ mb: 12, marginLeft: "5px", marginTop: "5px" }}>
                                <Grid item xs={12} md={4}>
                                    <Paper elevation={1} sx={{
                                        width: "80%",
                                        p: 4,
                                        height: {xs:"320px", md: 350, sm: 290},
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
                                    onClick={() => {
                                        router.push('/incomes/category/salary')
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
                                    }}
                                    >
                                            <CIcon icon={cilCash} style={{ color: "gold", width: "60px", height: "60px", padding: "7px" }} />
                                        </Box>
                                        <Typography variant="h6" sx={{ color: 'white', paddinTop: "10px" }}>
                                            Salary
                                        </Typography>
                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                            Total amount recieved for salary.
                                        </Typography>
                                        <Typography sx={{ mt: {xs: 2, md: 6, sm: 6, lg: 3.6}, justifyContent: "flex-end", color: "white", fontSize: "25px", fontWeight: "bold" }}>
                                            ₹{salaryData.toLocaleString('en-IN')}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Paper elevation={1} sx={{
                                        width: "80%",
                                        p: 4,
                                        height: {xs:"320px", md: 350, sm: 290},
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
                                    onClick={() => {
                                        router.push('/incomes/category/freelance')
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
                                            <CIcon icon={cilCoffee} style={{ color: "red", width: "60px", height: "60px", padding: "7px" }} />
                                        </Box>
                                        <Typography variant="h6" sx={{ color: 'white', paddinTop: "10px" }}>
                                            Freelance
                                        </Typography>
                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                            Total amount earned by freelancing.
                                        </Typography>
                                        <Typography sx={{ mt: {xs: 2, md: 3, sm: 6}, justifyContent: "flex-end", color: "white", fontSize: "25px", fontWeight: "bold" }}>
                                            ₹{freelanceData.toLocaleString('en-IN')}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Paper elevation={1} sx={{
                                        width: "80%",
                                        p: 4,
                                        height: {xs:"320px", md: 350, sm: 290},
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
                                    onClick={() => {
                                        router.push('/incomes/category/business')
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
                                            <CIcon icon={cilDollar} style={{ color: "green", width: "60px", height: "60px", padding: "7px" }} />
                                        </Box>
                                        <Typography variant="h6" sx={{ color: 'white', paddinTop: "10px" }}>
                                            Business
                                        </Typography>
                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                            Total amount earned by various business ventures.
                                        </Typography>
                                        <Typography sx={{ mt: {xs: 2, md: 3, sm: 6}, justifyContent: "flex-end", color: "white", fontSize: "25px", fontWeight: "bold" }}>
                                            ₹{businessData.toLocaleString('en-IN')}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                            <Grid container spacing={4} sx={{ mb: 12, marginLeft: "5px", marginTop: "-98px" }}>
                                <Grid item xs={12} md={4}>
                                    <Paper elevation={1} sx={{
                                        width: "80%",
                                        p: 4,
                                        height: {xs:"320px", md: 350, sm: 290},
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
                                    onClick={() => {
                                        router.push('/incomes/category/investments')
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
                                            <CIcon icon={cilChart} style={{ color: "gold", width: "60px", height: "60px", padding: "7px" }} />
                                        </Box>
                                        <Typography variant="h6" sx={{ color: 'white' }}>
                                            Investments
                                        </Typography>
                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                            Total amount earned through investments.
                                        </Typography>
                                        <Typography sx={{ mt: {xs: 2, md: 6, sm: 6, lg: 3.6}, justifyContent: "flex-end", color: "white", fontSize: "25px", fontWeight: "bold" }}>
                                            ₹{investmentData.toLocaleString("en-IN")}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Paper elevation={1} sx={{
                                        width: "80%",
                                        p: 4,
                                        height: {xs:"320px", md: 350, sm: 290},
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
                                    onClick={() => {
                                        router.push('/incomes/category/other')
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
                                            <CIcon icon={cilWallet} style={{ color: "green", width: "60px", height: "60px", padding: "7px" }} />
                                        </Box>
                                        <Typography variant="h6" sx={{ color: 'white', paddinTop: "10px" }}>
                                            Other Income
                                        </Typography>
                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                            Total amount which was spent on other things.
                                        </Typography>
                                        <Typography sx={{ mt: {xs: 2, md: 3, sm: 6}, justifyContent: "flex-end", color: "white", fontSize: "25px", fontWeight: "bold" }}>
                                            ₹{otherData.toLocaleString('en-IN')}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                </Grid>
            </Box>
        </Protected >
    );
}