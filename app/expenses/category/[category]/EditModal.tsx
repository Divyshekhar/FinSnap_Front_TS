import { useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import axios from "axios";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string; // You can change this to `Date` if it's already converted
}

interface EditModalProps {
  open: boolean;
  handleClose: () => void;
  transaction: Transaction;
  updateTransaction: (updatedTransaction: Transaction) => void;
}
const URL = "https://finsnap-back-ts.onrender.com/expense";

const EditModal = ({ open, handleClose, transaction, updateTransaction }: EditModalProps) => {
  const [title, setTitle] = useState(transaction?.title || "");
  const [amount, setAmount] = useState(transaction?.amount || "");

  const handleSave = async () => {
    const updatedTransaction = { ...transaction, title, amount: Number(amount) };
    try {
      await axios.put(`${URL}/${transaction.id}`, updatedTransaction, {
        headers: { Authorization: localStorage.getItem("authToken") },
      });

      updateTransaction(updatedTransaction); 
      handleClose(); 
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
      }}>
        <Typography variant="h6" gutterBottom>
          Edit Transaction
        </Typography>
        <TextField
          fullWidth
          margin="dense"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSave} color="primary" variant="contained">Save</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditModal;
