import React, { useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  Divider,
  Typography,
  TextField,
  MenuItem,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setEmployee } from "../../store/employeeSlice";

export default function EmployesCardsWithEmpl() {
  const DataForCard = useSelector((state) => state.auth.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const dispatch = useDispatch();

  const filteredEmployees = DataForCard.user_employees.filter((employee) => {
    return (
      employee.f_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.s_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.spec.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (sortBy === "f_name") {
      return a.f_name.localeCompare(b.f_name);
    } else if (sortBy === "s_name") {
      return a.s_name.localeCompare(b.s_name);
    } else if (sortBy === "spec") {
      return a.s_name.localeCompare(b.spec);
    } else {
      return 0;
    }
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 3,
        width: "90%",
      }}
    >
      <Box
        sx={{
          width: "100%",
          backgroundColor: "white",
          display: "flex",
          gap: "25px",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          borderRadius: 5,
          p: 3,
        }}
      >
        <TextField
          label="Поиск сотрудников"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: "40%", backgroundColor: "white" }}
        />
        <TextField
          select
          label="Сортировка"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          variant="outlined"
          sx={{ width: "40%", backgroundColor: "white" }}
        >
          <MenuItem value="">Без сортировки</MenuItem>
          <MenuItem value="f_name">По имени</MenuItem>
          <MenuItem value="s_name">По фамилии</MenuItem>
          <MenuItem value="spec">По роду деятельностиа</MenuItem>
        </TextField>
      </Box>
      {sortedEmployees.map((employe, index) => (
        <Link to={"/employee"} key={index} style={{ textDecoration: "none" }}>
          <Card
            key={index}
            sx={{
              width: 500,
              borderRadius: 5,
              display: "flex",
            }}
          >
            <CardActionArea
              sx={{
                paddingLeft: 5,
                display: "flex",
                flexDirection: "row",
                justifyContent: "start",
              }}
              onClick={() => {
                dispatch(
                  setEmployee({
                    id: employe.id,
                    f_name: employe.f_name,
                    s_name: employe.s_name,
                    t_name: employe.t_name,
                    birthday: employe.birthday,
                    contact_number: employe.contact_number,
                    email: employe.email,
                    description: employe.description,
                    education_data: employe.education_data,
                    spec: employe.spec,
                    softs: employe.soft_skill,
                    hards: employe.hard_skill,
                  })
                );
              }}
            >
              <Avatar
                src="https://i.pinimg.com/564x/4a/6e/fc/4a6efce2cafda3fbff9b6e64d2ea9f94.jpg"
                sx={{ width: "25%", height: "auto" }}
              />
              <Box
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ paddingLeft: 5, paddingTop: 2 }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography
                      gutterBottom
                      variant="h4"
                      color="text.secondary"
                    >
                      {employe.f_name}
                    </Typography>
                    <Typography
                      gutterBottom
                      variant="h4"
                      color="text.secondary"
                      sx={{ marginTop: -2 }}
                    >
                      {employe.s_name}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ paddingBottom: 2 }}>
                  <Typography color="text.primary" variant="h5">
                    {employe.spec}
                  </Typography>
                  <Typography color="text.primary" variant="h5">
                    Номер: {employe.contact_number}
                  </Typography>
                  <Divider variant="fullWidth" />
                </Box>
              </Box>
            </CardActionArea>
          </Card>
        </Link>
      ))}
    </Box>
  );
}
