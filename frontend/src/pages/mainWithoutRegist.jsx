import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { People, AssignmentTurnedIn, Folder } from "@mui/icons-material";
import { Link } from "react-router-dom";

export default function MainWithoutRegist() {
  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "block",
        position: "absolute",
        zIndex: 2,
        right: 0,
        left: 0,
        margin: "auto",
        width: "90%",
        borderRadius: 5,
        backgroundColor: "white",
        p: 4,
        pb: 12,
      }}
    >
      <Box sx={{ textAlign: "center", marginTop: 8 }}>
        <Typography variant="h3" gutterBottom>
          Добро пожаловать в систему распределения сотрудников на проекты -
          TeamBuilder!
        </Typography>
        <Typography variant="h6" gutterBottom>
          Управляйте проектами и сотрудниками эффективно и легко.
        </Typography>

        <Box sx={{ marginTop: 4 }}>
          <Button
            component={Link}
            to="/regist"
            variant="contained"
            color="primary"
            size="large"
            sx={{ marginRight: 2 }}
          >
            Регистрация
          </Button>
          <Button
            component={Link}
            to="/auth"
            variant="outlined"
            color="primary"
            size="large"
          >
            Войти
          </Button>
        </Box>

        <Box sx={{ marginTop: 8 }}>
          <Typography variant="h4" gutterBottom>
            Возможности системы
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  borderRadius: 5,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ textAlign: "center", flex: 1 }}>
                  <Folder
                    fontSize="large"
                    sx={{ color: "#304ffe", marginBottom: 2 }}
                  />
                  <Typography variant="h6">Управление проектами</Typography>
                  <Typography variant="body1">
                    Создавайте и отслеживайте проекты, назначайте задачи и
                    следите за сроками выполнения.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  borderRadius: 5,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ textAlign: "center", flex: 1 }}>
                  <People
                    fontSize="large"
                    sx={{ color: "#304ffe", marginBottom: 2 }}
                  />
                  <Typography variant="h6">Управление сотрудниками</Typography>
                  <Typography variant="body1">
                    Управляйте командой, назначайте сотрудников на проекты и
                    отслеживайте их занятость.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  borderRadius: 5,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ textAlign: "center", flex: 1 }}>
                  <AssignmentTurnedIn
                    fontSize="large"
                    sx={{ color: "#304ffe", marginBottom: 2 }}
                  />
                  <Typography variant="h6">Аналитика</Typography>
                  <Typography variant="body1">
                    Получайте аналитику по выполнению проектов и работе
                    сотрудников.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
