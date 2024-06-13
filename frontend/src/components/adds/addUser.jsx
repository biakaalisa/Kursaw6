import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
const defaultTheme = createTheme();

const softs = [
  "Стрессоустойчивость",
  "Инициатвность",
  "Организованность",
  "Коммуникательность",
  "Пассивность",
  "Креативность",
  "Прокрастинирование",
  "Внимательность",
  "Распиздяйство",
  "Исполнительность",
  "Креативное мышление",
  "Системное мышление",
  "Еще что-то..",
];
const hards = [
  "JS",
  "Python",
  "Java",
  "C++",
  "C#",
  "Ruby",
  "PHP",
  "HTML",
  "CSS",
  "React",
  "Angular",
  "Vue.js",
  "Node.js",
  "Дальше мне переписывать лень",
];

export default function AddUser() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
  };

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [TimeInWork, setTimeInWork] = useState("");
  const [formValid, setFormValid] = useState(false);

  const [status, setStatus] = React.useState("");
  const [post, setPost] = React.useState("");
  const [userSofts, setUserSofts] = React.useState("");

  const addUser = async () => {
    try {
      axios.post("/api/employee", {
        f_name: firstName,
        s_name: lastName,
        age: age,
        time_in_work: TimeInWork,
      });
      axios.post("/api/");
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() => {
    if (firstName && lastName && age && TimeInWork && post && status) {
      setFormValid(false);
    } else {
      setFormValid(true);
    }
  });

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ backgroundColor: "black" }}></Box>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          backgroundColor: "white",
          borderRadius: 5,
          position: "relative",
          margin: "auto",
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            paddingTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <PersonAddIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Добавить сотрудника
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Имя"
                  autoFocus
                  sx={{ background: "white" }}
                  autoComplete="default-name"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Фамилия"
                  name="lastName"
                  sx={{ background: "white" }}
                  autoComplete="family-name"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  fullWidth
                  id="age"
                  label="Отчество"
                  name="age"
                  autoComplete="age"
                  sx={{ background: "white" }}
                  onChange={(e) => setAge(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  fullWidth
                  id="age"
                  label="Дата рождения"
                  name="age"
                  autoComplete="age"
                  sx={{ background: "white" }}
                  onChange={(e) => setAge(e.target.value)}
                />
              </Grid>
              {/* <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Направление</InputLabel>
                  <Select
                    id="post"
                    value={post}
                    label="Направление"
                    name="post"
                    autoComplete="post"
                    sx={{ background: "white" }}
                    onChange={(e) => setPost(e.target.value)}
                  >
                    <MenuItem value={"Стажёр"}>Девопс</MenuItem>
                    <MenuItem value={"Джун"}>Фронт</MenuItem>
                    <MenuItem value={"Миддл"}>Бек</MenuItem>
                    <MenuItem value={"Помидор"}>Тестер</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Уровень</InputLabel>
                  <Select
                    id="post"
                    value={post}
                    label="Уровень"
                    name="post"
                    autoComplete="post"
                    sx={{ background: "white" }}
                    onChange={(e) => setPost(e.target.value)}
                  >
                    <MenuItem value={"Стажёр"}>Стажёр</MenuItem>
                    <MenuItem value={"Джун"}>Джун</MenuItem>
                    <MenuItem value={"Миддл"}>Миддл</MenuItem>
                    <MenuItem value={"Помидор"}>Помидор</MenuItem>
                  </Select>
                </FormControl>
              </Grid> */}

              <Grid item xs={12} fullWidth>
                <Autocomplete
                  multiple
                  sx={{ background: "white" }}
                  id="tags-outlined"
                  options={softs}
                  filterSelectedOptions
                  onChange={(e) => setUserSofts(e.currentTarget)}
                  renderInput={(params) => (
                    <TextField {...params} label="Soft скилы" />
                  )}
                />
              </Grid>

              <Grid item xs={12} fullWidth>
                <Autocomplete
                  multiple
                  sx={{ background: "white" }}
                  id="tags-outlined"
                  options={hards}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField {...params} label="Hard скилы" />
                  )}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Добавить
            </Button>
            <Grid container justifyContent="center" alignItems="center">
              <Button variant="contained" sx={{ mt: 1, mb: 3 }}>
                Отмена
              </Button>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
