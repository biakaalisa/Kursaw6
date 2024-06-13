import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { Alert, Collapse } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { login } from "../store/slice";

export default function Auth(props) {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (email && password) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [email, password]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
    try {
      const bodyFormData = new FormData();
      bodyFormData.append("username", email);
      bodyFormData.append("password", password);

      await axios.post("/api/auth/jwt/login", bodyFormData);

      const responses = await Promise.all([
        axios.get("/api/counter_projects/"),
        axios.get("/api/counter_active_projects/"),
        axios.get("/api/counter_employees/"),
        axios.get("/api/counter_free_employees/"),
        axios.get("/api/user_employees/"),
        axios.post("/api/user_projects/"),
      ]);

      const [
        counter_projects,
        counter_active_projects,
        counter_employees,
        counter_free_employees,
        user_employees,
        user_projects,
      ] = responses.map((response) => response.data);

      dispatch(
        login({
          counter_projects: counter_projects.detail || counter_projects,
          counter_active_projects:
            counter_active_projects.detail || counter_active_projects,
          user_projects: user_projects.detail || user_projects,
          counter_employees: counter_employees.detail || counter_employees,
          counter_free_employees:
            counter_free_employees.detail || counter_free_employees,
          user_employees: user_employees.detail || user_employees,
        })
      );
      props.setIsAuth(true);
    } catch {
      setOpen(true);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        backgroundColor: "white",
        marginTop: "10%",
        borderRadius: "10px",
        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
        paddingTop: 7,
        paddingBottom: 5,
      }}
    >
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ bgcolor: "primary.main", mb: 1 }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h2" variant="h4">
          Авторизация
        </Typography>
        <Box
          component="form"
          sx={{
            mt: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <TextField
            fullWidth
            margin="normal"
            required
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            sx={{ backgroundColor: "white" }}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormControl
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="password"
            autoComplete="password"
            variant="outlined"
            onChange={(e) => setPassword(e.target.value)}
          >
            <InputLabel htmlFor="outlined-adornment-password">
              Пароль
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Пароль"
            />
          </FormControl>
          <Collapse in={open}>
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mt: 2 }}
            >
              Ошибка логина / пароля ! <br />
            </Alert>
          </Collapse>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mb: 2,
              mt: 2,
              backgroundColor: isActive ? "" : "grey",
            }}
            disabled={!isActive}
          >
            Авторизоваться
          </Button>
          <Grid item>
            <span style={{ color: "black", fontSize: "14px" }}>
              У Вас нет аккаунта?
            </span>
            <Link href="/regist" variant="body2">
              {" Зарегистрироваться "}
            </Link>
            <br />
            <Link href="#" variant="body2">
              {"Восстановить пароль"}
            </Link>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
