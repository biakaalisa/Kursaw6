import {
  Avatar,
  Box,
  Button,
  Card,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Alert,
} from "@mui/material";
import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SkillsAdder from "./skills";
import InputMask from "react-input-mask";
import { Add, Delete } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  setCounterEmployees,
  setCounterFreeEmployees,
  setEmployees,
} from "../../store/slice";
import CreateSSkill from "./CreateSSkill";
import CreateHSkill from "./CreateHSkill";

export default function AddEmployee() {
  const AllEmplData = useSelector(selectUser);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [softSkills, setSoftSkills] = useState([]);
  const [hardSkills, setHardSkills] = useState([]);
  useEffect(() => {
    // Запрос к API для получения данных
    const fetchData = async () => {
      try {
        const responseS = await axios.get("/api/get_soft_skill/");
        setSoftSkills(responseS.data);
        const responseH = await axios.get("api/get_hard_skill/");
        setHardSkills(responseH.data);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };
    fetchData();
  }, []);

  const [employeeData, setEmployeeData] = useState({
    f_name: null,
    s_name: null,
    t_name: null,
    spec: null,
    birthday: null,
    contact_number: null,
    email: null,
    description: null,
    education_data: null,
    hards: null,
    softs: null,
  });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (
      employeeData.f_name &&
      employeeData.s_name &&
      employeeData.birthday &&
      employeeData.spec &&
      employeeData.t_name &&
      employeeData.contact_number &&
      employeeData.email &&
      employeeData.description &&
      employeeData.education_data
    ) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [employeeData]);

  const handleDateChange = (date) => {
    if (date) {
      setEmployeeData({ ...employeeData, birthday: date.format("YYYY-MM-DD") });
    } else {
      setEmployeeData({ ...employeeData, birthday: "" });
    }
  };

  const handleAddEmployee = async () => {
    try {
      await axios.post("/api/create_employee/", {
        f_name: employeeData.f_name,
        s_name: employeeData.s_name,
        birthday: employeeData.birthday,
        spec: employeeData.spec,
        t_name: employeeData.t_name,
        contact_number: employeeData.contact_number,
        email: employeeData.email,
        description: employeeData.description,
        education_data: employeeData.education_data,
      });

      const [ans3, ans4, ans5] = await Promise.all([
        axios.get("/api/counter_employees/"),
        axios.get("/api/counter_free_employees/"),
        axios.get("/api/user_employees/"),
      ]);

      dispatch(setCounterEmployees(ans3.data));
      dispatch(setCounterFreeEmployees(ans4.data));
      dispatch(setEmployees(ans5.data));

      const newEmployeeId = ans5.data[ans5.data.length - 1].id;

      await Promise.all(
        employeeData.hards.map((hardId) =>
          axios.post(
            `api/add_employee_hard_skill/?employee_id=${newEmployeeId}&hardskill_id=${hardId}`
          )
        )
      );

      await Promise.all(
        employeeData.softs.map((softId) =>
          axios.post(
            `api/add_employee_soft_skill/?employee_id=${newEmployeeId}&softskill_id=${softId}`
          )
        )
      );

      const ans = await axios.get("/api/user_employees/");
      dispatch(setEmployees(ans.data));
    } catch (error) {
      alert("Ошибка добавления сотрудника: " + error.response.data);
    }
  };

  return (
    <Grid container spacing={2} sx={{ justifyContent: "center" }}>
      <Grid item xs={12} md={4} sx={{ ml: { xs: 0, md: 2.5 } }}>
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
            src="https://i.pinimg.com/564x/4a/6e/fc/4a6efce2cafda3fbff9b6e64d2ea9f94.jpg"
            sx={{ width: "175px", height: "auto", marginBottom: 3 }}
          />
          <Grid item sx={{ width: "80%", maxWidth: "300px" }}>
            <TextField
              multiline
              autoFocus
              required
              fullWidth
              id="lastName"
              label="Фамилия"
              sx={{ background: "white" }}
              onChange={(e) =>
                setEmployeeData({ ...employeeData, s_name: e.target.value })
              }
            />
          </Grid>
          <Grid item sx={{ width: "80%", maxWidth: "300px" }}>
            <TextField
              required
              fullWidth
              multiline
              id="firstName"
              label="Имя"
              onChange={(e) =>
                setEmployeeData({ ...employeeData, f_name: e.target.value })
              }
            />
          </Grid>
          <Grid item sx={{ width: "80%", maxWidth: "300px" }}>
            <TextField
              required
              multiline
              fullWidth
              label="Отчество"
              onChange={(e) =>
                setEmployeeData({ ...employeeData, t_name: e.target.value })
              }
            />
          </Grid>
          <Grid item sx={{ width: "80%", maxWidth: "300px" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={{ width: "100%" }}
                label="Дата рождения"
                onChange={handleDateChange}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item sx={{ width: "80%", maxWidth: "300px" }}>
            <TextField
              required
              multiline
              fullWidth
              label="Квалификация"
              sx={{ background: "white" }}
              onChange={(e) =>
                setEmployeeData({ ...employeeData, spec: e.target.value })
              }
            />
          </Grid>
          {/*<Grid
            item
            sx={{
              width: "80%",
              maxWidth: "300px",
              marginBottom: 2,
            }}
          >
            <FormControl fullWidth>
              <InputLabel>Уровень квалификации</InputLabel>
              <Select
                sx={{
                  textAlign: "left",
                }}
                label="Уровень квалификации"
                value={employeeData.spec_level}
                onChange={(e) =>
                  setEmployeeData({
                    ...employeeData,
                    spec_level: e.target.value,
                  })
                }
              >
                <MenuItem value={"Intern"}>Intern</MenuItem>
                <MenuItem value={"Junior"}>Junior</MenuItem>
                <MenuItem value={"Pre-Middle"}>Pre-Middle</MenuItem>
                <MenuItem value={"Middle"}>Middle</MenuItem>
                <MenuItem value={"Pre-Senior"}>Pre-Senior</MenuItem>
                <MenuItem value={"Senior"}>Senior</MenuItem>
              </Select>
            </FormControl>
          </Grid>*/}
        </Card>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 2,
            borderRadius: 5,
            textAlign: "center",
            gap: 2,
            marginTop: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 1,
            }}
          >
            Контактная информация
          </Typography>
          <Grid item sx={{ width: "80%", maxWidth: "300px" }}>
            <TextField
              required
              fullWidth
              label="E-mail"
              onChange={(e) =>
                setEmployeeData({ ...employeeData, email: e.target.value })
              }
            />
          </Grid>
          <Grid item sx={{ width: "80%", maxWidth: "300px" }}>
            <InputMask
              mask="+7 (999) 999-99-99"
              maskChar={null}
              onChange={(e) =>
                setEmployeeData({
                  ...employeeData,
                  contact_number: e.target.value,
                })
              }
            >
              {() => <TextField required fullWidth label="Номер телефона" />}
            </InputMask>
          </Grid>
        </Card>
      </Grid>

      <Grid item xs={12} md={7}>
        <Card
          sx={{
            borderRadius: 5,
            padding: 2,
            minHeight: "100px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 1,
            }}
          >
            Общая информация
          </Typography>
          <TextField
            required
            fullWidth
            id="info"
            multiline
            name="info"
            variant="standard"
            sx={{ background: "white", width: "80%", margin: "0 auto" }}
            onChange={(e) =>
              setEmployeeData({ ...employeeData, description: e.target.value })
            }
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 1,
              marginTop: 3,
            }}
          >
            Данные об образовании
          </Typography>
          <TextField
            required
            fullWidth
            id="education"
            multiline
            name="education"
            variant="standard"
            sx={{
              background: "white",
              width: "80%",
              margin: "0 auto 2rem",
            }}
            onChange={(e) =>
              setEmployeeData({
                ...employeeData,
                education_data: e.target.value,
              })
            }
          />
        </Card>

        <Card sx={{ marginTop: 2, borderRadius: 5, minHeight: "100px" }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", textAlign: "center", margin: 2 }}
          >
            Профессиональные навыки
          </Typography>
          {hardSkills.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                paddingBottom: 2,
              }}
            >
              <Alert severity="error">
                {" "}
                У Вас еще нет ни одного навыка, доступного к добавлению!
              </Alert>

              <CreateHSkill setHardSkills={setHardSkills} />
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                paddingBottom: 2,
              }}
            >
              <Box
                sx={{
                  minWidth: "70%",
                  maxWidth: "70%",
                }}
              >
                <SkillsAdder
                  data={hardSkills}
                  title="Профессиональные навыки сотрудника"
                  setEmployeeData={setEmployeeData}
                  employeeData={employeeData}
                ></SkillsAdder>
              </Box>
              <CreateHSkill setHardSkills={setHardSkills} />
            </Box>
          )}
        </Card>

        <Card sx={{ marginTop: 2, borderRadius: 5, minHeight: "100px" }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", textAlign: "center", margin: 2 }}
          >
            Личностные компетенции
          </Typography>
          {softSkills.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                paddingBottom: 2,
              }}
            >
              <Alert severity="error">
                {" "}
                У Вас еще нет ни одного навыка, доступного к добавлению!
              </Alert>

              <CreateSSkill setSoftSkills={setSoftSkills} />
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                paddingBottom: 2,
              }}
            >
              <Box
                sx={{
                  minWidth: "70%",
                  maxWidth: "70%",
                }}
              >
                <SkillsAdder
                  data={softSkills}
                  title="Компетенции сотрудника"
                  setEmployeeData={setEmployeeData}
                  employeeData={employeeData}
                ></SkillsAdder>
              </Box>
              <CreateSSkill setSoftSkills={setSoftSkills} />
            </Box>
          )}
        </Card>
        <Box
          sx={{
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            marginTop: 2,
          }}
        >
          <Link to="/main" style={{ width: isSmallScreen ? "100%" : "48%" }}>
            <Button
              color="error"
              variant="outlined"
              fullWidth
              sx={{
                paddingLeft: 2,
                paddingRight: 2,
                borderRadius: 5,
                paddingTop: 1,
                paddingBottom: 1,
                backgroundColor: "white",
              }}
            >
              Отмена
              <Delete />
            </Button>
          </Link>
          <Link
            to="/main"
            style={{
              width: isSmallScreen ? "100%" : "48%",
              pointerEvents: isActive === true ? "" : "none",
            }}
          >
            <Button
              onClick={handleAddEmployee}
              color="success"
              variant="outlined"
              fullWidth
              sx={{
                paddingLeft: 2,
                paddingRight: 2,
                borderRadius: 5,
                paddingTop: 1,
                paddingBottom: 1,
                backgroundColor: isActive ? "white" : "lightgrey",
              }}
              disabled={!isActive}
            >
              Добавить
              <Add />
            </Button>
          </Link>
        </Box>
      </Grid>
    </Grid>
  );
}
