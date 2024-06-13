import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Backdrop } from "@mui/material";
import { LogoutOutlined } from "@mui/icons-material";
import navigationData from "./navigationData";
import navigationAddData from "./navigationAddData";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logout } from "../store/slice";

const drawerWidth = 260;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const BlurBackdrop = styled(Backdrop)(({ theme }) => ({
  zIndex: theme.zIndex.drawer - 1,
  color: "#fff",
  backgroundColor: "rgba(0, 0, 0, 0.3)", // Красный цвет с прозрачностью
  backdropFilter: "blur(10px)", // Размытие
}));

export default function Navigation(props) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            TeamBuilder
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {navigationData.map((detail, index) => (
            <ListItem disablePadding sx={{ display: "block" }} key={index}>
              <Link
                to={detail.path}
                style={{ textDecoration: "none", color: "gray" }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {detail.image}
                  </ListItemIcon>
                  <ListItemText
                    primary={detail.title}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>{" "}
              </Link>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {navigationAddData.map((detail, index) => (
            <ListItem disablePadding sx={{ display: "block" }} key={index}>
              <Link
                to={detail.path}
                style={{ textDecoration: "none", color: "gray" }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {detail.image}
                  </ListItemIcon>
                  <ListItemText
                    primary={detail.title}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>{" "}
              </Link>
            </ListItem>
          ))}
        </List>
        <Box>
          <ListItem
            disablePadding
            sx={{
              display: "block",
              position: "absolute",
              bottom: 1,
              right: 0,
            }}
          >
            <Divider />
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
              onClick={async () => {
                try {
                  dispatch(logout());
                  await axios.post("/api/auth/jwt/logout");
                } catch {
                  alert("Какие-то ошибки с logout");
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <LogoutOutlined />
              </ListItemIcon>
              <ListItemText
                primary="Выйти из аккаунта"
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>{" "}
          </ListItem>
        </Box>
      </Drawer>
      <BlurBackdrop open={open} onClick={handleDrawerClose} />
    </Box>
  );
}
