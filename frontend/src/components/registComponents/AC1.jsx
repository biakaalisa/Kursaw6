import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useEffect } from "react";

export default function AC1(props) {
  useEffect(() => {
    if (
      props.RegData.organization_name &&
      props.RegData.size &&
      props.RegData.branch &&
      props.RegData.email &&
      emailError === ""
    ) {
      props.setIsComplete(true);
    } else {
      props.setIsComplete(false);
    }
  });

  const [emailError, setEmailError] = React.useState("");
  const emailHandler = (e) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    if (!re.test(String(e.target.value).toLowerCase())) {
      setEmailError("Некорректный email!");
    } else {
      setEmailError("");
    }
    props.setRegData({
      ...props.RegData,
      email: e.target.value,
    });
  };

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
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="organization_name"
                required
                multiline
                fullWidth
                label="Название компании"
                autoFocus
                inputProps={{ maxLength: 50 }}
                onChange={(e) =>
                  props.setRegData({
                    ...props.RegData,
                    organization_name: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                label="Размер компании"
                autoComplete="size"
                inputProps={{ maxLength: 50 }}
                onChange={(e) =>
                  props.setRegData({
                    ...props.RegData,
                    size: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                label="Отрасль"
                autoComplete="branch"
                inputProps={{ maxLength: 50 }}
                onChange={(e) =>
                  props.setRegData({
                    ...props.RegData,
                    branch: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                multiline
                fullWidth
                label="Email"
                type="email"
                autoComplete="email"
                inputProps={{ maxLength: 50 }}
                onChange={(e) => emailHandler(e)}
                error={emailError}
                helperText={emailError}
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
