"use client";
import Protected from "../../../protected-layout";
import { Button } from "@mui/material";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { useParams } from 'next/navigation';
import axios from "axios";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditModal, { Transaction } from "./EditModal"; // ✅ Import the Edit Modal
import { format } from "path";

const URL = "https://finsnap-back-ts.onrender.com/expense";

export default function Category() {
  const [category, setCategory] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction>();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const params = useParams<{ category: string }>();

  useEffect(() => {
    if (params?.category) {
      const formattedCategory = params.category.charAt(0).toUpperCase() + params.category.slice(1);
      setCategory(formattedCategory);
      fetchCategoryData(formattedCategory);
    }
  }, []);

  const fetchCategoryData = async (category: string) => {
    try {
      const response = await axios.get(`${URL}/history/${category}`, {
        headers: { Authorization: localStorage.getItem("authToken") }
      });
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };
  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setEditModalOpen(true);
  };

  const handleDelete = async (transactionId: string) => {
    try {
      await axios.delete(`${URL}/delete/${transactionId}`, {
        headers: { Authorization: localStorage.getItem("authToken") },
      });

      setTransactions((prevTransactions) =>
        prevTransactions.filter((transaction) => transaction.id !== transactionId)
      );
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };
  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
    );
  };

  return (
    <Protected>
      <Box sx={{
        width: "100vw", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "100px", flexDirection: "column"
      }}>
        <Grid container spacing={4} sx={{ maxWidth: "80vw", alignItems: "center", justifyContent: "center" }}>
          <Grid item xs={12} md={12} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography sx={{ color: "white", fontWeight: "bold", fontSize: "24px", paddingBottom: "30px" }}>
              {category.toUpperCase()} Transactions
            </Typography>
          </Grid>

          {transactions.length > 0 ? (
            transactions.map((transaction, index) => (
              <Grid item xs={12} key={index}>
                <Box sx={{ width: "80vw", display: "flex", justifyContent: "center" }}>
                  <Paper elevation={1} sx={{
                    width: "100%",
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '10px',
                    borderRadius: "20px",
                    cursor: "pointer",
                    transition: 'all 0.3s',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      background: 'rgba(255, 255, 255, 0.08)'
                    }
                  }}>
                    <Typography variant="h6" sx={{ color: 'white', paddingTop: "10px" }}>
                      {transaction.title}
                    </Typography>
                    <Typography sx={{ color: "white", fontSize: "20px", fontWeight: "bold" }}>
                      ₹{transaction.amount.toLocaleString('en-IN')}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: "14px" }}>
                      {new Date(transaction.date).toLocaleDateString()}
                    </Typography>

                    <Box sx={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit(transaction)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(transaction.id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Paper>
                </Box>
              </Grid>
            ))
          ) : (
            <Typography sx={{ color: "white", fontSize: "18px", textAlign: "center" }}>
              No transactions found.
            </Typography>
          )}

          {/* ✅ Edit Modal */}
          {selectedTransaction && (
            <EditModal
              open={isEditModalOpen}
              handleClose={() => setEditModalOpen(false)}
              transaction={selectedTransaction}
              updateTransaction={updateTransaction}
            />
          )}

        </Grid>
      </Box>
    </Protected>
  );
}
