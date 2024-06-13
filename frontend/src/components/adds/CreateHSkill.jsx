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

export default function CreateHSkill(props) {
  const [open, setOpen] = React.useState(false);
  const [newSkill, setNewSkill] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };
  return (
    <Box sx={{ mt: 3 }}>
      <Button
        onClick={handleClickOpen}
        color="success"
        variant="outlined"
        sx={{
          paddingLeft: 2,
          paddingRight: 2,
          borderRadius: 5,
          paddingTop: 1,
          paddingBottom: 1,
        }}
      >
        Добавить профессиональный навык
      </Button>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Добавление навыка</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TextField
                fullWidth
                margin="normal"
                required
                label="hard-skill"
                autoFocus
                onChange={(e) => setNewSkill(e.target.value)}
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              try {
                await axios.post("api/create_hard_skill/", {
                  name: newSkill,
                  title: newSkill,
                });
                const responseH = await axios.get("api/get_hard_skill/");
                props.setHardSkills(responseH.data);
              } catch {
                alert("Ошибка добавленния навыка");
              } finally {
                handleClose();
              }
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
