import { Card, Grid, MenuItem, Select } from "@mui/material";
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";

export const EntityDataForm = ({ formTitle, formType, dataFields, onFormSubmit, onFormCancel }) => {
    const handleSubmit = (event) => {
        onFormSubmit();
    };

    const handleCancel = () => {
        onFormCancel(false);
    };

    return (
        <SoftBox mt={6}>
            <Card>
                <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                  <SoftTypography variant="h6">{ formTitle }</SoftTypography>
                  {onFormCancel && <SoftButton variant="gradient" color="error" onClick={() => handleCancel()}><CloseIcon /></SoftButton>}
                </SoftBox>
                <SoftBox display="flex" p={3} gap={5}>
                    {
                        dataFields.map((field, index) => (                        
                            <Grid container key={`input-${field.type}-${index}-${formTitle}-${formType}`}>
                                <SoftBox mb={1} ml={0.5}>
                                    <SoftTypography component="label" variant="caption" fontWeight="bold">
                                        { field.fieldName }
                                    </SoftTypography>
                                </SoftBox>
                                {field.type !== "dropdown" ? 
                                    <SoftInput 
                                        key={`input-${field.type}-${index}-${formTitle}-${formType}`}
                                        type={field.type}
                                        fullWidth
                                        placeholder={field.placeholder}
                                        value={field.initialValue}
                                        onChange={(content) => field.onChange(content)}
                                    />
                                    :
                                    <Select
                                        fullWidth
                                        value={field.initialValue}
                                        onChange={(event) => field.onChange(event)}
                                        displayEmpty
                                    >
                                        {field.options.map((option, optionIndex) => (
                                            <MenuItem key={`option-${index}-${optionIndex}`} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                }
                            </Grid>
                        ))
                    }
                </SoftBox>
                <SoftButton 
                        variant="gradient"
                        color={"secondary"}
                        fullWidth
                        onClick={() => handleSubmit()}
                    >
                        <DoneIcon />
                  </SoftButton>
            </Card>
        </SoftBox>
    );

}

EntityDataForm.propTypes = {
    formType: PropTypes.oneOf(['ADD', 'EDIT']).isRequired,
    dataFields: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string.isRequired,
        fieldName: PropTypes.string.isRequired,
        placeholder: PropTypes.string,
        initialValue: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        options: PropTypes.arrayOf(
            PropTypes.shape({
                value: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.number,
                ]).isRequired,
                label: PropTypes.string.isRequired,
            })
        ),
    })).isRequired,
    onFormSubmit: PropTypes.func.isRequired,
    onFormCancel: PropTypes.func,
};