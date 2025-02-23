"use client"
import { Box, Typography } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import React from "react";
import Protected from "../protected-layout";


export default function Dashboard() {
    return (
        <Protected>
            <Box>
                <Typography sx={{ color: "white" }}>
                    Hi this is from dashboard
                </Typography>
            </Box>
        </Protected>
    )
}