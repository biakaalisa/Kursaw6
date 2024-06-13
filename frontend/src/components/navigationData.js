import {
    AndroidOutlined,
    AutoAwesomeMosaicOutlined,
    ContactMailOutlined,
    FolderOutlined,
    FolderSharedOutlined,
  } from "@mui/icons-material";

const navigationData = [
    {
        title: 'Главная',
        image: <AutoAwesomeMosaicOutlined/>,
        path: '/main',
    },
    {
        title: 'Проекты',
        image: <FolderOutlined/>,
        path: '/projects',
    },
    {
        title: 'Сотрудники',
        image: <AndroidOutlined/>,
        path: '/employes',
    },
    {
        title: 'Заказчики',
        image: <ContactMailOutlined/>,
        path: '/customers',
    }
];

  export default navigationData