import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import { TextField } from "@mui/material";
import axios from "axios";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function AddTask(props) {
  const [open, setOpen] = React.useState(false);
  const [newTask, setNewTask] = React.useState({
    name: null,
    description: null,
    deadline: null,
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };

  const handleDateChange = (date) => {
    if (date) {
      setNewTask({ ...newTask, deadline: date.format("YYYY-MM-DD") });
    } else {
      setNewTask({ ...newTask, deadline: "" });
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Button
        onClick={handleClickOpen}
        variant="contained"
        sx={{
          paddingLeft: 2,
          paddingRight: 2,
          borderRadius: 1,
          paddingTop: 1,
          paddingBottom: 1,
        }}
      >
        Добавить задачу
      </Button>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Добавление задачи</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
            <FormControl sx={{ m: 1, minWidth: 250 }}>
              <TextField
                fullWidth
                margin="normal"
                required
                label="Название"
                autoFocus
                multiline
                onChange={(e) =>
                  setNewTask({ ...newTask, name: e.target.value })
                }
              />
              <TextField
                fullWidth
                margin="normal"
                required
                label="Описание"
                multiline
                sx={{ mb: 3 }}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  sx={{ width: "100%" }}
                  label="Дэдлайн *"
                  onChange={handleDateChange}
                />
              </LocalizationProvider>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={async () => {
              handleClose();
              const ss = await axios.post("api/user_tasks/");
              console.log(ss);
            }}
          >
            Отмена
          </Button>
          <Button
            onClick={async () => {
              await axios.post("api/tasks/", {
                name: newTask.name,
                description: newTask.description,
                deadline: newTask.deadline,
              });
              handleClose();
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
