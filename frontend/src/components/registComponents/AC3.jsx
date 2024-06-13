import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useState } from "react";
import { Alert, Collapse } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useEffect } from "react";

export default function AC3(props) {
  const [passwordAgain, setPasswordAgain] = useState("");
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (
      props.RegData.description &&
      props.RegData.password &&
      passwordAgain === props.RegData.password &&
      isChecked
    ) {
      props.setIsComplete(true);
    } else {
      props.setIsComplete(false);
    }
  }, [props.RegData, passwordAgain, isChecked]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box component="form" sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Логин"
                required
                multiline
                fullWidth
                inputProps={{ maxLength: 50 }}
                onChange={(e) =>
                  props.setRegData({
                    ...props.RegData,
                    description: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
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
                onChange={(e) =>
                  props.setRegData({
                    ...props.RegData,
                    password: e.target.value,
                  })
                }
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Пароль
                </InputLabel>
                <OutlinedInput
                  inputProps={{ maxLength: 20 }}
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="passwordAgain"
                label="Подтвердите пароль"
                name="passwordAgain"
                autoComplete="passwordAgain"
                type="password"
                sx={{ backgroundColor: "white" }}
                onChange={(e) => setPasswordAgain(e.target.value)}
                onBlur={() => setOpen(passwordAgain !== props.RegData.password)}
              />
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
                  Пароли не совпадают! <br />
                </Alert>
              </Collapse>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                required
                control={
                  <Checkbox
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                  />
                }
                label="Даю согласие на обработку персональных данных"
              />
            </Grid>
          </Grid>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/auth" variant="body2">
                Уже есть аккаунт? Войти
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
