/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Table from "examples/Tables/Table";
import AddIcon from '@mui/icons-material/Add';
import SoftButton from "components/SoftButton";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import api from "api/api";
import SoftInput from "components/SoftInput";
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from "react-router-dom";

function Websites() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [websitesData, setWebsitesData] = useState();
  const [tableRows, setTableRows] = useState();

  const [websiteTitleCreate, setWebsiteTitleCreate] = useState();
  const [websiteDescriptionCreate, setWebsiteDescriptionCreate] = useState();
  const [tableDataChanged, setTableDataChanged] = useState(false);

  const columns = [
    { name: "title", align: "center" },
    { name: "description", align: "center" },
    { name: "edit pages", align: "center" },
  ]

  useEffect(() => {
    const username = Cookies.get("username");
    if (username) {
      api.get(`/website/all-by-user/${username}`)
      .then((response) => {
        if (response.status === 200) {
          setWebsitesData(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
    }
  }, [tableDataChanged]);

  useEffect(() => {
    if (websitesData) {
      setTableRows(prepareTableContent(websitesData));
    }
  }, [websitesData]);

  const addWebsite = () => {
    if (websiteTitleCreate && websiteDescriptionCreate) {
      const username = Cookies.get("username");
      api.post(
        `/website`,
        {
          title: websiteTitleCreate,
          description: websiteDescriptionCreate,
          faviconPath: "",
          username: username
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

  const prepareTableContent = (data) => {
    return data.map(row => prepareTableRow(row));
  }
  
  const prepareTableRow = ({ websiteId, title, description }) => {
    return {
      title: (<SoftTypography variant="caption" color="secondary" fontWeight="medium">{ title }</SoftTypography>),
      description: (<SoftTypography variant="caption" color="secondary" fontWeight="medium">{ description }</SoftTypography>),
      "edit pages": (<SoftButton onClick={() => {navigate(`${websiteId}`)}}><EditIcon /></SoftButton>),
    }
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Card>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <SoftTypography variant="h6">Strony internetowe</SoftTypography>
            </SoftBox>
            <SoftBox
              sx={{
                "& .MuiTableRow-root:not(:last-child)": {
                  "& td": {
                    borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                      `${borderWidth[1]} solid ${borderColor}`,
                  },
                },
              }}
            >
              <Table columns={columns} rows={tableRows} />
            </SoftBox>
          </Card>
        </SoftBox>

        <SoftBox mt={6}>
          <Card>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <SoftTypography variant="h6">Dodaj stronę internetową</SoftTypography>
            </SoftBox>
            <SoftBox display="flex" p={3} gap={3}>
              <SoftInput type="text" placeholder="Nazwa" onChange={content => setWebsiteTitleCreate(content.target.value)} />
              <SoftInput type="text" placeholder="Opis" onChange={content => setWebsiteDescriptionCreate(content.target.value)} />
              <SoftButton 
                variant="gradient"
                color={"secondary"}
                fullWidth
                onClick={() => addWebsite()}
              >
                <AddIcon />
                Dodaj
              </SoftButton>
            </SoftBox>
          </Card>
        </SoftBox>

        
      </SoftBox>
    </DashboardLayout>
  );
}

export default Websites;
