import {
    ControlPointOutlined,
    CreateNewFolderOutlined,
    PersonAddAlt1Outlined,
  } from "@mui/icons-material";

const navigationData = [
    {
        title: 'Добавить проект',
        image: <CreateNewFolderOutlined/>,
        path: '/addProject',
    },
    {
        title: 'Добавить сотрудника',
        image: <PersonAddAlt1Outlined/>,
        path: '/addEmployee',
    },
    {
        title: 'Добавить заказчика',
        image: <ControlPointOutlined/>,
        path: '/addCustomer',
    }
];

  export default navigationData