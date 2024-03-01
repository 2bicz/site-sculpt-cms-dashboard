import api from "api/api";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import EditIcon from '@mui/icons-material/Edit';
import EntityTable from "components/EntityTable/EntityTable";
import { EntityDataForm } from "components/EntityDataForm/EntityDataForm";
import DeleteIcon from '@mui/icons-material/Delete';
import ColorDisplay from "components/ColorDisplay/ColorDisplay";

export const Themes = () => {
    const { t } = useTranslation();
    const [entityData, setEntityData] = useState();
    const [tableRows, setTableRows] = useState();
    const [editEntityEnabled, setEditEntityEnabled] = useState(false);
    const [editEntityId, setEditEntityId] = useState();
    const [tableDataChanged, setTableDataChanged] = useState(false);

    // const [fontFamily, setFontFamily] = useState();
    const [isCurrent, setIsCurrent] = useState(false);
    const [websiteTitle, setWebsiteTitle] = useState();
    const [faviconPath, setFaviconPath] = useState();
    const [logoPath, setLogoPath] = useState();
    const [fontColor, setFontColor] = useState();
    const [primaryColor, setPrimaryColor] = useState();
    const [secondaryColor, setSecondaryColor] = useState();
    const [tertiaryColor, setTertiaryColor] = useState();
    const [backgroundColor, setBackgroundColor] = useState();

    const columns = [
        // { name: "font family", align: "center" },
        { name: "current", align: "center" },
        { name: "website title", align: "center" },
        { name: "favicon path", align: "center" },
        { name: "logo path", align: "center" },
        { name: "font color", align: "center" },
        { name: "primary color", align: "center" },
        { name: "secondary color", align: "center" },
        { name: "tertiary color", align: "center" },
        { name: "backgroud color", align: "center" },
        { name: "edit theme", align: "center" },
        { name: "delete theme", align: "center" },
    ]

    const prepareTableContent = (data) => {
        return data.map(row => prepareTableRow(row));
      }
      
      const prepareTableRow = ({ themeId, isCurrent, websiteTitle, faviconPath, logoPath, fontColor, primaryColor, secondaryColor, tertiaryColor, backgroundColor }) => {
        return {
          // "font family": (<SoftTypography variant="caption" color="secondary" fontWeight="medium">{ fontFamily }</SoftTypography>),
          "current": (<SoftTypography variant="caption" color="secondary" fontWeight="medium">{ isCurrent ? "Tak" : "Nie" }</SoftTypography>),
          "website title": (<SoftTypography variant="caption" color="secondary" fontWeight="medium">{ websiteTitle }</SoftTypography>),
          "favicon path": (<SoftTypography variant="caption" color="secondary" fontWeight="medium">{ faviconPath }</SoftTypography>),
          "logo path": (<SoftTypography variant="caption" color="secondary" fontWeight="medium">{ logoPath }</SoftTypography>),
          "font color": (<ColorDisplay height={ 30 } width={ 30 } hexCode={ fontColor } />),
          "primary color": (<ColorDisplay height={ 30 } width={ 30 } hexCode={ primaryColor } />),
          "secondary color": (<ColorDisplay height={ 30 } width={ 30 } hexCode={ secondaryColor } />),
          "tertiary color": (<ColorDisplay height={ 30 } width={ 30 } hexCode={ tertiaryColor } />),
          "backgroud color": (<ColorDisplay height={ 30 } width={ 30 } hexCode={ backgroundColor } />),
          "edit theme": (
              <SoftButton 
                onClick={() => {
                  setEditEntityEnabled(true);
                  setEditEntityId(themeId);
                  // setFontFamily(fontFamily);
                  setFontColor(fontColor);
                  setPrimaryColor(primaryColor);
                  setSecondaryColor(secondaryColor);
                  setTertiaryColor(tertiaryColor);
                  setBackgroundColor(backgroundColor);
                  setIsCurrent(isCurrent);
                  setWebsiteTitle(websiteTitle);
                  setFaviconPath(faviconPath);
                  setLogoPath(logoPath);
                }}
              >
                <EditIcon />
              </SoftButton>
            ),
            "delete theme": (
              <SoftButton 
                onClick={() => deleteTheme(themeId)}
              >
                <DeleteIcon />
              </SoftButton>
            ),
        }
      }

    useEffect(() => {
      api.get(`/theme`)
        .then((response) => {
          if (response.status === 200) {
            setEntityData(response.data);
           }
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        });
    }, [tableDataChanged]);

    useEffect(() => {
      if (entityData) {
        setTableRows(prepareTableContent(entityData));
      }
    }, [entityData]);

    const addTheme = () => {
        if (websiteTitle && fontColor && primaryColor && secondaryColor && backgroundColor) {
          api.post(
            `/theme`,
            {
              // fontFamily: fontFamily,
              websiteTitle: websiteTitle,
              isCurrent: isCurrent,
              faviconPath: faviconPath,
              logoPath: logoPath,
              fontColor: fontColor,
              primaryColor: primaryColor,
              secondaryColor: secondaryColor,
              tertiaryColor: tertiaryColor,
              backgroundColor: backgroundColor,
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
  
      const editTheme = () => {
        if (editEntityId) {
          api.post(
            `/theme/update/${editEntityId}`,
            {
              // fontFamily: fontFamily,
              websiteTitle: websiteTitle,
              isCurrent: isCurrent,
              faviconPath: faviconPath,
              logoPath: logoPath,
              fontColor: fontColor,
              primaryColor: primaryColor,
              secondaryColor: secondaryColor,
              tertiaryColor: tertiaryColor,
              backgroundColor: backgroundColor,
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
  
      const deleteTheme = (deleteEntityId) => {
        console.log(deleteEntityId)
        if (deleteEntityId) {
          api.delete(
            `/theme/delete/${deleteEntityId}`
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
              title="Motywy strony internetowej" 
              columns={columns} 
              tableRows={tableRows} 
            />

            <EntityDataForm 
              formTitle={editEntityEnabled ? "Edytuj motyw" : "Dodaj motyw"}
              formType={editEntityEnabled ? "EDIT" : "ADD"}
              dataFields={[
                // {
                //   fieldName: "Czcionka",
                //   type: "text",
                //   placeholder: "Czcionka",
                //   initialValue: fontFamily,
                //   onChange: (content) => setFontFamily(content.target.value),
                // },
                {
                  fieldName: "Aktualnie używany",
                  type: "dropdown",
                  placeholder: "Aktualnie używany",
                  initialValue: isCurrent,
                  onChange: (content) => setIsCurrent(content.target.value),
                  options: [
                    { value: true, label: "Tak" },
                    { value: false, label: "Nie" },
                  ],
                },
                {
                  fieldName: "Tytuł strony",
                  type: "text",
                  placeholder: "Tytuł strony",
                  initialValue: websiteTitle,
                  onChange: (content) => setWebsiteTitle(content.target.value),
                },
                {
                  fieldName: "Źródło faviconu",
                  type: "text",
                  placeholder: "Źródło faviconu",
                  initialValue: faviconPath,
                  onChange: (content) => setFaviconPath(content.target.value),
                },
                {
                  fieldName: "Źródło loga",
                  type: "text",
                  placeholder: "Źródło loga",
                  initialValue: logoPath,
                  onChange: (content) => setLogoPath(content.target.value),
                },
                {
                  fieldName: "Kolor czcionki",
                  type: "color",
                  initialValue: fontColor,
                  onChange: (content) => setFontColor(content.target.value),
                },
                {
                  fieldName: "Kolor I",
                  type: "color",
                  initialValue: primaryColor,
                  onChange: (content) => setPrimaryColor(content.target.value),
                },
                {
                  fieldName: "Kolor II",
                  type: "color",
                  initialValue: secondaryColor,
                  onChange: (content) => setSecondaryColor(content.target.value),
                },
                {
                  fieldName: "Kolor III",
                  type: "color",
                  initialValue: tertiaryColor,
                  onChange: (content) => setTertiaryColor(content.target.value),
                },
                {
                  fieldName: "Kolor tła",
                  type: "color",
                  initialValue: backgroundColor,
                  onChange: (content) => setBackgroundColor(content.target.value),
                },
              ]}
              onFormSubmit={editEntityEnabled ? editTheme : addTheme}
              onFormCancel={editEntityEnabled && setEditEntityEnabled}
            />
            
          </SoftBox>
        </DashboardLayout>
      );
}