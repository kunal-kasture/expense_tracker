import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import apiClient from "../services/apiClient";
import { useNavigate } from "react-router-dom";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  TextField,
  IconButton,
  MenuItem,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import Delete from "@mui/icons-material/Delete";

const CATEGORIES = [
  "Food & Drinks",
  "Shopping",
  "Housing",
  "Transportation",
  "Vehicle",
  "Life & Entertainment",
  "Communication & PC",
  "Financial Expenses",
  "Investments",
  "Income",
  "Others",
];

const Dashboard = () => {
  const { logout, token, user } = useAuth();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [formLoading, setFormLoading] = useState(false);

  const handleLogoutClick = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const fetchDashboardData = async () => {
    try {
      const response = await apiClient.get("/expenses");
      if (Array.isArray(response.data)) {
        setExpenses(response.data);
      } else if (response.data && Array.isArray(response.data.expenses)) {
        setExpenses(response.data.expenses);
      } else if (response.data && Array.isArray(response.data.data)) {
        setExpenses(response.data.data);
      } else {
        setExpenses([]);
      }
    } catch (error) {
      console.error("Error loading dashboard records:", error);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    setFormLoading(true);
    try {
      await apiClient.post("/expenses", {
        title,
        amount: Number(amount),
        category,
      });
      setTitle("");
      setAmount("");
      setCategory(CATEGORIES[0]);
      fetchDashboardData();
    } catch (error) {
      console.error("Error creating expense item:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await apiClient.delete(`/expenses/${id}`);
      fetchDashboardData();
    } catch (error) {
      console.error("Error removing expense item:", error);
    }
  };

  const totalExpenses = expenses.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0,
  );

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      <AppBar position="static" color="inherit" elevation={1}>
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 4 } }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: "700",
              color: "primary.main",
            }}
          >
            Expense Tracker
          </Typography>
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<LogoutIcon />}
            onClick={handleLogoutClick}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: { xs: 2, sm: 4 } }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "600",
            mb: 4,
          }}
        >
          Dashboard Overview
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderLeft: "6px solid",
                borderColor: "error.main",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="overline"
                color="text.secondary"
                fontWeight="600"
              >
                Total Outflow
              </Typography>
              <Typography variant="h4" fontWeight="700" color="text.primary">
                ₹{totalExpenses.toFixed(2)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderLeft: "6px solid",
                borderColor: "primary.main",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="overline"
                color="text.secondary"
                fontWeight="600"
              >
                Active Items Listed
              </Typography>
              <Typography variant="h4" fontWeight="700" color="text.primary">
                {expenses.length}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper
          elevation={2}
          sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2, mb: 4 }}
        >
          <Typography variant="h6" sx={{ fontWeight: "600", mb: 3 }}>
            Add New Transaction Log
          </Typography>
          <Box component="form" onSubmit={handleAddExpense} noValidate>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Title/Description"
                  size="small"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  size="small"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  size="small"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  {CATEGORIES.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={formLoading}
                  sx={{ py: 1, fontWeight: "600" }}
                >
                  {formLoading ? "Adding..." : "Add"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "600", mb: 3 }}>
            Recent Statement Logs
          </Typography>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : expenses.length === 0 ? (
            <Typography
              variant="body1"
              color="text.secondary"
              align="center"
              sx={{ fontStyle: "italic", my: 4 }}
            >
              No data records registered yet. Add transactions to watch metrics
              populate.
            </Typography>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table sx={{ minWidth: "100%" }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                    <TableCell sx={{ fontWeight: "700", py: 2 }}>
                      Title/Description
                    </TableCell>
                    <TableCell sx={{ fontWeight: "700", py: 2 }}>
                      Category
                    </TableCell>
                    <TableCell sx={{ fontWeight: "700", py: 2 }} align="right">
                      Amount
                    </TableCell>
                    <TableCell sx={{ fontWeight: "700", py: 2 }} align="center">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense._id} hover>
                      <TableCell
                        sx={{
                          py: 2,
                          fontSize: "15px",
                        }}
                      >
                        {expense.title}
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Chip
                          label={expense.category}
                          size="small"
                          variant="outlined"
                          color="default"
                          sx={{ fontWeight: "500" }}
                        />
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: "error.main",
                          fontWeight: "700",
                          py: 2,
                          fontSize: "15px",
                        }}
                      >
                        -₹{Number(expense.amount).toFixed(2)}
                      </TableCell>
                      <TableCell align="center" sx={{ py: 2 }}>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDeleteExpense(expense._id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;
