import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useEffect } from "react";
import InputMask from "react-input-mask";

export default function AC2(props) {
  useEffect(() => {
    if (
      props.RegData.s_name &&
      props.RegData.f_name &&
      props.RegData.t_name &&
      props.RegData.contact_number
    ) {
      props.setIsComplete(true);
    } else {
      props.setIsComplete(false);
    }
  });

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
                autoComplete="s_name"
                name="s_name"
                required
                multiline
                fullWidth
                id="s_name"
                label="Фамилия"
                autoFocus
                sx={{ backgroundColor: "white" }}
                inputProps={{ maxLength: 50 }}
                onChange={(e) =>
                  props.setRegData({
                    ...props.RegData,
                    s_name: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                id="f_name"
                label="Имя"
                name="f_name"
                autoComplete="f_name"
                sx={{ backgroundColor: "white" }}
                inputProps={{ maxLength: 50 }}
                onChange={(e) =>
                  props.setRegData({
                    ...props.RegData,
                    f_name: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                id="t_name"
                label="Отчество"
                name="t_name"
                autoComplete="t_name"
                sx={{ backgroundColor: "white" }}
                inputProps={{ maxLength: 50 }}
                onChange={(e) =>
                  props.setRegData({
                    ...props.RegData,
                    t_name: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <InputMask
                mask="+7 (999) 999-99-99"
                maskChar={null}
                onChange={(e) =>
                  props.setRegData({
                    ...props.RegData,
                    contact_number: e.target.value,
                  })
                }
              >
                {() => (
                  <TextField
                    required
                    fullWidth
                    name="contact_number"
                    label="Контактный номер"
                    id="contact_number"
                    autoComplete="contact_number"
                    sx={{ backgroundColor: "white" }}
                  />
                )}
              </InputMask>
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
