import React, { useState } from "react";
import {
  Card,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import theme from "assets/theme";

const ListInput = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddItem = () => {
    if (inputValue.trim() !== "") {
      onChange([...value, inputValue]);
      setInputValue("");
    }
  };

  const handleRemoveItem = (index) => {
    const newList = [...value];
    newList.splice(index, 1);
    onChange(newList);
  };

  return (
    <div>
      <TextField
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add new item"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleAddItem} style={{ position: 'absolute', right: 0 }}>
                <AddCircleOutlineIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <List>
  {value && value.map((item, index) => (
    <ListItem 
      key={index} 
      sx={{ 
        padding: theme.spacing(1),
        borderBottom: '1px solid',
        borderBottomColor: theme.palette.divider,
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        }
      }}
    >
      <ListItemText
        primary={item}
        primaryTypographyProps={{
          variant: 'body2',
          color: 'textPrimary',
        }}
      />
      <ListItemSecondaryAction>
        <IconButton 
          edge="end" 
          aria-label="delete" 
          onClick={() => handleRemoveItem(index)}
          sx={{
            '&:hover': {
              color: theme.palette.error.main, // Use a color indicating an action like delete
            },
          }}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  ))}
</List>
    </div>
  );
};

export const EntityDataForm = ({ formTitle, formType, dataFields, onFormSubmit, onFormCancel }) => {
  const handleSubmit = () => {
    onFormSubmit();
  };

  const handleCancel = () => {
    onFormCancel(false);
  };

  const rows = dataFields.reduce((acc, field, index) => {
    if (field) {
      const rowNum = Math.floor(index / 3);
      if (!acc[rowNum]) acc[rowNum] = [];
      acc[rowNum].push(field);
    }
    return acc;
  }, []);

  return (
    <SoftBox mt={6}>
      <Card>
        <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
          <SoftTypography variant="h6">{formTitle}</SoftTypography>
          {onFormCancel && (
            <SoftButton variant="gradient" color="error" onClick={handleCancel}>
              <CloseIcon />
            </SoftButton>
          )}
        </SoftBox>
        <SoftBox p={3}>
          {rows.map((row, rowIndex) => (
            <Grid container spacing={2} key={`row-${rowIndex}`}>
              {row.map(
                (field, index) =>
                  field && (
                    <Grid
                      item
                      xs={12}
                      sm={row.length === 1 ? 12 : row.length === 2 ? 6 : 4}
                      key={`input-${field.type}-${index}-${formTitle}-${formType}`}
                    >
                      <SoftBox mb={1} ml={0.5}>
                        <SoftTypography component="label" variant="caption" fontWeight="bold">
                          {field.fieldName}
                        </SoftTypography>
                      </SoftBox>
                      {field.type === "dropdown" ? (
                        <Select
                          fullWidth
                          value={field.initialValue}
                          onChange={(event) => field.onChange(event)}
                          displayEmpty
                          startAdornment={
                            <InputAdornment position="start">
                              <ArrowDropDownIcon />
                            </InputAdornment>
                          }
                        >
                          {field.options.map((option, optionIndex) => (
                            <MenuItem key={`option-${index}-${optionIndex}`} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : field.type === "list" ? (
                        <ListInput
                          value={field.initialValue}
                          onChange={(newList) => field.onChange(newList)}
                        />
                      ) : field.type === "switch" ? (
                        <FormControlLabel 
                          control={ 
                            <Switch 
                              checked={field.initialValue} 
                              onChange={(event) => field.onChange(event.target.checked)}
                            />
                          } 
                        />
                      ) : (
                        <SoftInput
                          type={field.type}
                          fullWidth
                          placeholder={field.placeholder}
                          value={field.initialValue}
                          onChange={(content) => field.onChange(content)}
                        />
                      )}
                    </Grid>
                  )
              )}
            </Grid>
          ))}
        </SoftBox>
        <SoftButton variant="gradient" color="secondary" fullWidth onClick={handleSubmit}>
          <DoneIcon />
        </SoftButton>
      </Card>
    </SoftBox>
  );
};

EntityDataForm.propTypes = {
  formType: PropTypes.oneOf(["ADD", "EDIT"]).isRequired,
  dataFields: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      fieldName: PropTypes.string.isRequired,
      placeholder: PropTypes.string,
      initialValue: PropTypes.string,
      onChange: PropTypes.func.isRequired,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  onFormCancel: PropTypes.func,
};
