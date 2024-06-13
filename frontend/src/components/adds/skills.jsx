import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { Button, Input } from "@mui/material";

const ITEM_HEIGHT = 50;
const ITEM_PADDING_TOP = 50;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function SkillsAdder(skillsData) {
  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    const selectedSkills = typeof value === "string" ? value.split(",") : value;
    setPersonName(selectedSkills);

    // Update selected IDs based on selected skills
    const selectedSkillIds = skillsData.data
      .filter((skill) => selectedSkills.includes(skill.name))
      .map((skill) => skill.id);
    if (skillsData.title === "Профессиональные навыки сотрудника") {
      skillsData.setEmployeeData({
        ...skillsData.employeeData,
        hards: selectedSkillIds,
      });
    } else {
      skillsData.setEmployeeData({
        ...skillsData.employeeData,
        softs: selectedSkillIds,
      });
    }
  };

  return (
    <div>
      <FormControl
        fullWidth
        sx={{
          m: 1,
        }}
      >
        <InputLabel>{skillsData.title}</InputLabel>
        <Select
          fullWidth
          multiple
          value={personName}
          onChange={handleChange}
          input={<Input label={skillsData.title} />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {skillsData.data.map((skill) => (
            <MenuItem key={skill.id} value={skill.name}>
              {skill.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
