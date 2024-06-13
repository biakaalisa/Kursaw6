import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Main from "../pages/main";
import Auth from "../pages/auth";
import Regist from "../pages/regist";
import AddProject from "./adds/addPr";
import EmployesCards from "./employees/employesCards";
import ProjectsCards from "./projects/projectsCards";
import Employee from "./employees/employee";
import Project from "./projects/project";
import AddEmployee from "./adds/addEmpl";
import Current from "../pages/current";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Header() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          backgroundColor: "white",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          /*aria-label="basic tabs example"*/
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
        >
          <Tab label="Текущая редактируемая" {...a11yProps(0)} />
          <Tab label="Регистрация" {...a11yProps(1)} />
          <Tab label="Главная" {...a11yProps(2)} />
          <Tab label="Сотрудники" {...a11yProps(3)} />
          <Tab label="Сотрудник" {...a11yProps(4)} />
          <Tab label="Проекты" {...a11yProps(5)} />
          <Tab label="Проект" {...a11yProps(6)} />
          <Tab label="Добавить сотрудника" {...a11yProps(7)} />
          <Tab label="Добавить проект" {...a11yProps(8)} />
          <Tab label="Пустая таблица" {...a11yProps(9)} />
          <Tab label="Сотр*2" {...a11yProps(10)} />
          <Tab label="Авторизация" {...a11yProps(11)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Current />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Regist />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Main />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <EmployesCards />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <Employee />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        <ProjectsCards />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={6}>
        <Project />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={7}>
        <AddEmployee />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={8}>
        <AddProject />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={9}>
        <EmployesCards />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={10}>
        <AddEmployee />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={11}>
        <Auth />
      </CustomTabPanel>
    </Box>
  );
}
