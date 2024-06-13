import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ArrowForwardIos, Create, Delete } from "@mui/icons-material";
import Suck from "./suckployee";
import { useDispatch, useSelector } from "react-redux";
import {
  setCounterEmployees,
  setCounterFreeEmployees,
  setEmployees,
} from "../../store/slice";
import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

export default function Employee() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [dopEmployeeData, setDopEmployeeData] = useState({
    projects: [],
  });
  const EmployeeData = useSelector((state) => state.employee);
  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        `api/project_on_employee/?employee_id=${EmployeeData.id}`
      );
      setDopEmployeeData(response.data);
    }
    fetchData();
  }, []);

  return (
    <Grid container spacing={2} sx={{ justifyContent: "center" }}>
      <Grid item xs={10} md={3}>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 2,
            borderRadius: 5,
            textAlign: "center",
          }}
        >
          <Avatar
            src="https://i.pinimg.com/564x/4a/6e/fc/4a6efce2cafda3fbff9b6e64d2ea9f94.jpg"
            sx={{ width: "175px", height: "auto", marginBottom: 3 }}
          />
          <Typography variant="h5">
            {EmployeeData.f_name} {EmployeeData.s_name}
          </Typography>
          <Typography variant="h5">{EmployeeData.t_name}</Typography>
          <Typography variant="body2" paddingTop={2}>
            {EmployeeData.birthday}
          </Typography>
          <Typography variant="h5">{EmployeeData.spec}</Typography>
          <Typography variant="h6" sx={{ mt: 3, alignSelf: "start", ml: 3 }}>
            E-mail: {EmployeeData.email}
          </Typography>
          <Typography variant="h6" sx={{ alignSelf: "start", ml: 3 }}>
            Контактный номер: {EmployeeData.contact_number}
          </Typography>
          {/*<Button
            color="primary"
            variant="contained"
            sx={{
              paddingLeft: 2,
              paddingRight: 2,
              borderRadius: 5,
              textAlign: "center",
              width: "100%",
              marginTop: 4,
              justifyContent: "center",
              gap: 2,
            }}
          >
            Редактировать
            <Create />
          </Button>*/}
        </Card>
        {dopEmployeeData.projects === undefined ? (
          <Card
            sx={{
              marginTop: 2,
              borderRadius: 5,
              textAlign: "center",
              padding: 2,
              minHeight: "100px",
            }}
          >
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              marginBottom={2}
            >
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
                Проекты
              </Typography>
              <Typography variant="h6">
                Данный сотрудник не задействован еще ни в одном проекте
              </Typography>
            </Box>
          </Card>
        ) : (
          <Card
            sx={{
              marginTop: 2,
              borderRadius: 5,
              textAlign: "center",
              padding: 2,
              minHeight: "100px",
            }}
          >
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
              marginBottom={2}
            >
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Проекты
              </Typography>
              <Typography>2</Typography>
              <Button
                onClick={() => {
                  console.log(dopEmployeeData.projects);
                }}
              >
                bg
              </Button>
            </Box>

            {["Что за проект", "Что за новый проект"].map((project, index) => (
              <CardActionArea
                key={index}
                sx={{
                  textAlign: "start",
                  padding: 1,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box marginRight={1}>
                  <Typography>{project}</Typography>
                  <Typography>{EmployeeData.spec}</Typography>
                </Box>
                <ArrowForwardIos />
              </CardActionArea>
            ))}
          </Card>
        )}

        <Link to={"/main"}>
          <Button
            color="error"
            variant="outlined"
            sx={{
              paddingLeft: 2,
              paddingRight: 2,
              borderRadius: 5,
              textAlign: "center",
              width: "100%",
              marginTop: 2,
              justifyContent: "center",
              gap: 2,
              backgroundColor: "white",
            }}
            onClick={async () => {
              try {
                await axios.delete(
                  "/api/employee/" + "?employee_id=" + EmployeeData.id
                );
                const [ans3, ans4, ans5] = await Promise.all([
                  axios.get("/api/counter_employees/"),
                  axios.get("/api/counter_free_employees/"),
                  axios.get("/api/user_employees/"),
                ]);

                dispatch(setCounterEmployees(ans3.data));
                dispatch(setCounterFreeEmployees(ans4.data));
                dispatch(setEmployees(ans5.data));
                alert("Удалили");
              } catch {
                alert("Какие-то ошибки с удалением");
              }
            }}
          >
            Удалить сотрудника
            <Delete />
          </Button>
        </Link>
      </Grid>
      <Grid item xs={10} md={7}>
        <Card sx={{ borderRadius: 5, padding: 2, minHeight: "100px" }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 2,
            }}
          >
            Общая информация
          </Typography>
          <Typography>{EmployeeData.description}</Typography>
        </Card>
        <Card
          sx={{ marginTop: 2, padding: 2, borderRadius: 5, minHeight: "100px" }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 2,
            }}
          >
            Данные об оразовании
          </Typography>
          <Typography>{EmployeeData.education_data}</Typography>
        </Card>
        <Card sx={{ marginTop: 2, borderRadius: 5, minHeight: "100px" }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", textAlign: "center", margin: 2 }}
          >
            Hards
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
            {EmployeeData.hards.map((hard, index) => (
              <Typography
                gutterBottom
                variant="h6"
                color="text.secondary"
                sx={{
                  background: "#a5afff",
                  borderRadius: 10,
                  padding: 1,
                  pl: 3,
                  pr: 3,
                  margin: 0.5,
                  textAlign: "center",
                  fontSize: "18px",
                }}
              >
                {hard}
              </Typography>
            ))}
          </Box>
        </Card>
        <Card sx={{ marginTop: 2, borderRadius: 5, minHeight: "100px" }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", textAlign: "center", margin: 2 }}
          >
            Softs
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
            {EmployeeData.softs.map((hard, index) => (
              <Typography
                gutterBottom
                variant="h6"
                color="text.secondary"
                sx={{
                  background: "#a5afff",
                  borderRadius: 10,
                  padding: 1,
                  pl: 3,
                  pr: 3,
                  margin: 0.5,
                  textAlign: "center",
                  fontSize: "18px",
                }}
              >
                {hard}
              </Typography>
            ))}
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}
