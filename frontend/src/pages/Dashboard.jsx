import { useState, useEffect, useContext } from "react";
import useAuth from "../hooks/useAuth";
import apiClient from "../services/apiClient";
import { useNavigate } from "react-router-dom";
import { ColorModeContext } from "../main";
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
  useTheme,
  InputAdornment,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import SearchIcon from "@mui/icons-material/Search";

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

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FF8042",
  "#AF19FF",
  "#FF1975",
  "#19FFD8",
  "#B5FF19",
  "#FF5733",
  "#9B59B6",
  "#7F8C8D",
];

const PAYMENT_METHODS = ["Cash", "Card", "UPI", "Net Banking"];

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[10]);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[2]);
  const [notes, setNotes] = useState("");
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [formLoading, setFormLoading] = useState(false);
  const [errMsg, setErrorMsg] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleEditClick = (expense) => {
    setErrorMsg("");
    setEditingId(expense._id);
    setTitle(expense.title);
    setAmount(expense.amount.toString());
    setCategory(
      CATEGORIES.includes(expense.category) ? expense.category : CATEGORIES[0],
    );
    setPaymentMethod(
      PAYMENT_METHODS.includes(expense.paymentMethod)
        ? expense.paymentMethod
        : PAYMENT_METHODS[2],
    );
    setNotes(expense.notes || "");
    if (expense.expenseDate) {
      setExpenseDate(new Date(expense.expenseDate).toISOString().split("T")[0]);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setAmount("");
    setCategory(CATEGORIES[0]);
    setPaymentMethod(PAYMENT_METHODS[2]);
    setNotes("");
    setExpenseDate(new Date().toISOString().split("T")[0]);
    setErrorMsg("");
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const parsedAmount = Number(amount);

    if (!title.trim()) {
      setErrorMsg("Please enter a valid title/description");
      return;
    }

    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMsg("Amount must be +ve no. greater than 0");
      return;
    }

    setFormLoading(true);
    try {
      if (editingId) {
        await apiClient.put(`/expenses/${editingId}`, {
          title: title.trim(),
          amount: parsedAmount,
          category,
          paymentMethod,
          notes: notes.trim() || undefined,
          expenseDate: new Date(expenseDate).toISOString(),
        });
      } else {
        await apiClient.post("/expenses", {
          title: title.trim(),
          amount: parsedAmount,
          category,
          paymentMethod,
          notes: notes.trim() || undefined,
          expenseDate: new Date(expenseDate).toISOString(),
        });
      }
      setTitle("");
      setAmount("");
      setCategory(CATEGORIES[10]);
      setPaymentMethod(PAYMENT_METHODS[2]);
      setNotes("");
      setExpenseDate(new Date().toISOString().split("T")[0]);
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

  const currentMonthExpenses = expenses.reduce((sum, item) => {
    const expenseDateObj = new Date(item.expenseDate || item.createdAt);
    const today = new Date();
    if (
      expenseDateObj.getMonth() === today.getMonth() &&
      expenseDateObj.getFullYear() === today.getFullYear()
    ) {
      return sum + (Number(item.amount) || 0);
    }
    return sum;
  }, 0);

  const chartData = Object.values(
    expenses.reduce((acc, curr) => {
      const cat = curr.category || "Others";
      if (!acc[cat]) {
        acc[cat] = { name: cat, value: 0 };
      }
      acc[cat].value += Number(curr.amount) || 0;
      return acc;
    }, {}),
  );

  const processedExpenses = expenses
    .filter((exp) => {
      const matchesSearch = exp.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        filterCategory === "All" || exp.category === filterCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const amountA = Number(a.amount) || 0;
      const amountB = Number(b.amount) || 0;
      return sortOrder === "desc" ? amountB - amountA : amountA - amountB;
    });

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: "background.default",
        minHeight: "100vh",
      }}
    >
      <AppBar position="static" color="inherit" elevation={1}>
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 4 } }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: "700",
              color: "primary.main",
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
              whiteSpace: "nowrap",
            }}
          >
            💸 Expense Tracker
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={colorMode.toggleColorMode} color="inherit">
              {theme.palette.mode === "dark" ? (
                <LightModeIcon />
              ) : (
                <DarkModeIcon />
              )}
            </IconButton>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<LogoutIcon />}
              onClick={handleLogoutClick}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: { xs: 2, sm: 4 } }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "600",
            mb: 4,
            color: "text.primary",
          }}
        >
          Dashboard Overview
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid xs={12} sm={6}>
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
                Total Expenses
              </Typography>
              <Typography variant="h4" fontWeight="700" color="text.primary">
                ₹{totalExpenses.toFixed(2)}
              </Typography>
            </Paper>
          </Grid>
          <Grid xs={12} md={4}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderLeft: "6px solid",
                borderColor: "warning.main",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="overline"
                color="text.secondary"
                fontWeight="600"
              >
                Monthly Expenses
              </Typography>
              <Typography variant="h4" fontWeight="700" color="text.primary">
                ₹{currentMonthExpenses.toFixed(2)}
              </Typography>
            </Paper>
          </Grid>
          <Grid xs={12} sm={6}>
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
                Total No. of Expenses
              </Typography>
              <Typography variant="h4" fontWeight="700" color="text.primary">
                {expenses.length}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ width: "100%", mb: 4, mt: 2 }}>
          <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "600", mb: 2 }}>
              Filter by Category
            </Typography>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                <CircularProgress />
              </Box>
            ) : chartData.length === 0 ? (
              <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                sx={{ fontStyle: "italic", my: 4 }}
              >
                Add records below to to see the charts
              </Typography>
            ) : (
              <Box
                sx={{
                  width: "100%",
                }}
              >
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `₹${Number(value).toFixed(2)}`}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Paper>
        </Box>

        <Paper
          elevation={2}
          sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2, mb: 4 }}
        >
          <Typography variant="h6" sx={{ fontWeight: "600", mb: 2 }}>
            {editingId ? "✏️ Edit Existing Expense" : "➕ Add New Expense"}
          </Typography>

          {errMsg && (
            <Typography
              variant="body2"
              color="error.main"
              sx={{ fontWeight: "600", mb: 2 }}
            >
              ⚠️ {errMsg}
            </Typography>
          )}
          <Box component="form" onSubmit={handleAddExpense} noValidate>
            <Grid container spacing={2} sx={{ alignItems: "flex-end" }}>
              <Grid xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Title/Description"
                  size="small"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Grid>
              <Grid xs={12} sm={6} md={4}>
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
              <Grid xs={12} sm={6} md={4}>
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
              <Grid xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  select
                  label="Payment Method"
                  size="small"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                >
                  {PAYMENT_METHODS.map((method) => (
                    <MenuItem key={method} value={method}>
                      {method}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="Expense Date"
                  size="small"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  slotProps={{
                    label: { shrink: true },
                    htmlInput: { max: new Date().toISOString().split("T")[0] },
                  }}
                  required
                  sx={{
                    "& input": {
                      colorScheme: theme.palette.mode,
                      WebkitTapHighlightColor: "transparent",
                    },
                  }}
                />
              </Grid>
              <Grid xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Notes/Remark"
                  size="small"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional notes"
                />
              </Grid>
              <Grid
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                {editingId && (
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleCancelEdit}
                    sx={{ fontWeight: "600" }}
                  >
                    Cancel
                  </Button>
                )}
              </Grid>
              <Grid xs={12} md={2}>
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
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", sm: "center" },
              gap: 2,
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "600" }}>
              📃 View Expense History
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                gap: 2,
              }}
            >
              <TextField
                size="small"
                placeholder="Search description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ width: { xs: "100%", sm: 200 } }}
              />
              <TextField
                select
                label="Category Filter"
                size="small"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="All">All Categories</MenuItem>
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="outlined"
                onClick={() =>
                  setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
                }
                sx={{ fontWeight: "600", height: "40px", minWidth: "110px" }}
              >
                {sortOrder === "desc" ? "⬇️ DSC" : "⬆️ ASC"}
              </Button>
            </Box>
          </Box>
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
                  <TableRow
                    sx={{
                      backgroundColor:
                        theme.palette.mode === "light" ? "#f8f9fa" : "#2d2d2d",
                    }}
                  >
                    <TableCell sx={{ fontWeight: "700", py: 2 }}>
                      Title/Description
                    </TableCell>
                    <TableCell sx={{ fontWeight: "700", py: 2 }}>
                      Category
                    </TableCell>
                    <TableCell sx={{ fontWeight: "700", py: 2 }} align="center">
                      Date
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
                  {processedExpenses.map((expense) => (
                    <TableRow
                      key={expense._id}
                      hover
                      selected={editingId === expense._id}
                    >
                      <TableCell sx={{ py: 2, fontSize: "15px" }}>
                        {expense.title}
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Chip
                          label={expense.category}
                          size="small"
                          variant="outlined"
                          color="primary"
                          sx={{ fontWeight: "500" }}
                        />
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          py: 2,
                          fontSize: "15px",
                        }}
                      >
                        {expense.expenseDate
                          ? new Date(expense.expenseDate).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "-"}
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
                          color="primary"
                          size="small"
                          onClick={() => handleEditClick(expense)}
                          sx={{ mr: 1 }}
                          disabled={formLoading}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDeleteExpense(expense._id)}
                          disabled={formLoading}
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
