import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";
import { useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { EntityDataForm } from "components/EntityDataForm/EntityDataForm";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import EntityTable from "components/EntityTable/EntityTable";
import { useTranslation } from "react-i18next";
import api from "api/api";

export const Categories = () => {
    const { t } = useTranslation();
    const [categoriesData, setCategoriesData] = useState();
    const [tableRows, setTableRows] = useState();
    const [tableDataChanged, setTableDataChanged] = useState(false);
    const [editCategoryEnabled, setEditCategoryEnabled] = useState(false);
    const [editCategoryId, setEditCategoryId] = useState();
    const [categoryName, setCategoryName] = useState();


    const columns = [
        { name: "name", align: "center" },
        { name: "edit category", align: "center" },
        { name: "delete category", align: "center" },
    ]

    useEffect(() => {
        api.get(`/category`)
          .then((response) => {
            if (response.status === 200) {
              setCategoriesData(response.data);
            }
          })
          .catch((error) => {
            console.error("Error fetching data: ", error);
          });
      }, [tableDataChanged]);

      useEffect(() => {
        if (categoriesData) {
          setTableRows(prepareTableContent(categoriesData));
        }
      }, [categoriesData]);
  
        const prepareTableContent = (data) => {
        return data.map(row => prepareTableRow(row));
      }
      
      const prepareTableRow = ({ categoryId, name }) => {
        return {
          name: (<SoftTypography variant="caption" color="secondary" fontWeight="medium">{ name }</SoftTypography>),
          "edit category": (
              <SoftButton
                onClick={() => {
                  setEditCategoryId(categoryId);
                  setCategoryName(name);
                  setEditCategoryEnabled(true);
                }}
              >
                <EditIcon />
              </SoftButton>
            ),
            "delete category": (
              <SoftButton 
                onClick={() => {deleteCategory(categoryId)}}
              >
                <DeleteIcon />
              </SoftButton>
            ),
        }
      }

      const addCategory = () => {
        if (categoryName) {
          api.post(
            `/category`,
            {
              name: categoryName,
            }
          ).then((response) => {
              if (response.status === 201) {
                setTableDataChanged(prev => !prev);
              }
            })
            .catch((error) => {
              console.error("Error posting data: ", error);
            });
        }
      }
  
      const editCategory = () => {
        if (editCategoryId) {
          api.post(
            `/category/update/${editCategoryId}`,
            {
              name: categoryName,
            }
          ).then((response) => {
              if (response.status === 200) {
                setTableDataChanged(prev => !prev);
              }
            })
            .catch((error) => {
              console.error("Error posting data: ", error);
            });
        }
      }

      const deleteCategory = (deleteCategoryId) => {
        if (deleteCategoryId) {
          api.delete(
            `/category/delete/${deleteCategoryId}`
          ).then((response) => {
              if (response.status === 200) {
                setTableDataChanged(prev => !prev);
              }
            })
            .catch((error) => {
              console.error("Error deleting data: ", error);
            });
        }
      }

      return (
        <DashboardLayout>
          <DashboardNavbar />
          <SoftBox py={3}>
            <EntityTable 
              title="Kategorie" 
              columns={columns} 
              tableRows={tableRows} 
            />

            <EntityDataForm 
              formTitle={editCategoryEnabled ? "Edytuj kategorię" : "Dodaj kategorię"}
              formType={editCategoryEnabled ? "EDIT" : "ADD"}
              dataFields={[
                {
                  fieldName: "Nazwa",
                  type: "text",
                  placeholder: "Nazwa",
                  initialValue: categoryName,
                  onChange: (content) => setCategoryName(content.target.value),
                },
              ]}
              onFormSubmit={editCategoryEnabled ? editCategory : addCategory}
              onFormCancel={editCategoryEnabled && setEditCategoryEnabled}
            />
            
          </SoftBox>
        </DashboardLayout>
      );
}