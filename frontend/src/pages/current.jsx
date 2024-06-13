import {
  Avatar,
  Box,
  Button,
  Card,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";
import SkillsAdder from "../components/adds/skills";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Add, Delete } from "@mui/icons-material";
import img from "../components/images/addPic.png";

export default function Current() {
  const names = [
    "C++",
    "C#",
    "Python",
    "Ralph Hubbard",
    "Omar Alexander",
    "Carlos Abbott",
    "Miriam Wagner",
    "Bradley Wilkerson",
    "Virginia Andrews",
    "Kelly Snyder",
  ];

  return (
    <Grid container spacing={2}>
      <Grid item xs={3.5}>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 2,
            borderRadius: 5,
            textAlign: "center",
            gap: 2,
          }}
        >
          <Avatar
            src={img}
            sx={{ width: "175px", height: "175px", marginBottom: 3 }}
          />
          <Grid
            item
            sx={{
              width: "80%",
              maxWidth: "300px",
            }}
          >
            <TextField multiline required fullWidth label="Название проекта" />
          </Grid>
          <Grid item sx={{ width: "80%", maxWidth: "300px" }}>
            <TextField required fullWidth multiline label="Заказчик" />
          </Grid>

          <Grid item sx={{ width: "80%", maxWidth: "300px" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker sx={{ width: "100%" }} label="Дата начала проекта" />
            </LocalizationProvider>
          </Grid>
          <Grid item sx={{ width: "80%", maxWidth: "300px" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={{ width: "100%" }}
                label="Дата завершения проекта"
              />
            </LocalizationProvider>
          </Grid>

          <Grid item sx={{ width: "80%", maxWidth: "300px", marginBottom: 2 }}>
            <TextField label="Бюджет" type="number" required fullWidth />
          </Grid>
        </Card>
      </Grid>
      <Grid item xs={8.5} sx={{ display: "flex", flexDirection: "column" }}>
        <Card sx={{ borderRadius: 5, padding: 2, minHeight: "100px" }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              textWrap: "wrap",
              marginBottom: 1,
            }}
          >
            Описание проекта
          </Typography>
          <TextField
            required
            fullWidth
            id="info"
            multiline
            name="info"
            variant="standard"
            sx={{ background: "white", width: "80%", marginLeft: "10%" }}
          />
        </Card>
        <Card sx={{ marginTop: 2, borderRadius: 5, minHeight: "100px" }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", textAlign: "center", margin: 2 }}
          >
            Профессиональные навыки
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: 2,
              paddingLeft: 3,
              paddingRight: 3,
            }}
          >
            <SkillsAdder data={names} title="Навыки сотрудника"></SkillsAdder>
          </Box>
        </Card>
        <Card sx={{ marginTop: 2, borderRadius: 5, minHeight: "100px" }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", textAlign: "center", margin: 2 }}
          >
            Личностные компетенции
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: 2,
            }}
          >
            <SkillsAdder
              data={names}
              title="Компетенции сотрудника"
            ></SkillsAdder>
          </Box>
        </Card>
        <Button
          color="error"
          variant="outlined"
          sx={{
            paddingLeft: 2,
            paddingRight: 2,
            borderRadius: 5,
            paddingTop: 1,
            paddingBottom: 1,
            width: "80%",
            marginTop: 2,
            gap: 2,
            backgroundColor: "white",
            alignSelf: "center",
          }}
        >
          Отмена
          <Delete />
        </Button>
        <Button
          color="success"
          variant="outlined"
          sx={{
            paddingLeft: 2,
            paddingRight: 2,
            paddingTop: 1,
            paddingBottom: 1,
            borderRadius: 5,
            width: "80%",
            marginTop: 2,
            gap: 2,
            backgroundColor: "white",
            alignSelf: "center",
          }}
        >
          Добавить
          <Add />
        </Button>
      </Grid>
    </Grid>
  );
}
