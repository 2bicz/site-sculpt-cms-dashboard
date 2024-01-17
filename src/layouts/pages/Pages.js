import api from "api/api";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import VerticalSplitIcon from "@mui/icons-material/VerticalSplit";
import EntityTable from "components/EntityTable/EntityTable";
import { EntityDataForm } from "components/EntityDataForm/EntityDataForm";
import DeleteIcon from "@mui/icons-material/Delete";

export const Pages = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { websiteId } = useParams();
  const [pagesData, setPagesData] = useState();
  const [tableRows, setTableRows] = useState();
  const [lastOrderValue, setLastOrderValue] = useState(1);
  const [pageTitle, setPageTitle] = useState("");
  const [pagePath, setPagePath] = useState("");
  const [pageOrder, setPageOrder] = useState();
  const [tableDataChanged, setTableDataChanged] = useState(false);

  const [editPageEnabled, setEditPageEnabled] = useState(false);
  const [editPageId, setEditPageId] = useState();

  const columns = [
    { name: "order", align: "center" },
    { name: "title", align: "center" },
    { name: "path", align: "center" },
    { name: "edit page info", align: "center" },
    { name: "edit page layout", align: "center" },
    { name: "delete page", align: "center" },
  ];

  useEffect(() => {
    api
      .get(`/page`)
      .then((response) => {
        if (response.status === 200) {
          setPagesData(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [tableDataChanged]);

  useEffect(() => {
    if (pagesData) {
      setTableRows(prepareTableContent(pagesData));
    }
  }, [pagesData]);

  const prepareTableContent = (data) => {
    return data.map((row) => prepareTableRow(row));
  };

  const prepareTableRow = ({ order, title, path, pageId }) => {
    return {
      order: (
        <SoftTypography variant="caption" color="secondary" fontWeight="medium">
          {order}
        </SoftTypography>
      ),
      title: (
        <SoftTypography variant="caption" color="secondary" fontWeight="medium">
          {title}
        </SoftTypography>
      ),
      path: (
        <SoftTypography variant="caption" color="secondary" fontWeight="medium">
          {path}
        </SoftTypography>
      ),
      "edit page info": (
        <SoftButton
          onClick={() => {
            setEditPageId(pageId);
            setPageOrder(order);
            setPageTitle(title);
            setPagePath(path);
            setEditPageEnabled(true);
          }}
        >
          <EditIcon />
        </SoftButton>
      ),
      "edit page layout": (
        <SoftButton onClick={() => {navigate(`/dashboard/pages/page-sections/${pageId}`)}}>
          <VerticalSplitIcon />
        </SoftButton>
      ),
      "delete page": (
        <SoftButton
          onClick={() => {
            deletePage(pageId);
          }}
        >
          <DeleteIcon />
        </SoftButton>
      ),
    };
  };

  const getExistingOrderNumbers = () => {
    return tableRows.map((row) => parseInt(row.order.props.children, 10));
  };

  const addPage = () => {
    if (pageTitle && pageOrder) {
      api
        .post(`/page`, {
          title: pageTitle,
          path: pagePath,
          websiteId: websiteId,
          order: pageOrder,
        })
        .then((response) => {
          if (response.status === 201) {
            setTableDataChanged((prev) => !prev);
          }
        })
        .catch((error) => {
          console.error("Error posting data: ", error);
        });
    }
  };

  const editPage = () => {
    if (editPageId) {
      api
        .post(`/page/update/${editPageId}`, {
          title: pageTitle,
          path: pagePath,
          websiteId: websiteId,
          order: pageOrder,
        })
        .then((response) => {
          if (response.status === 200) {
            setTableDataChanged((prev) => !prev);
          }
        })
        .catch((error) => {
          console.error("Error posting data: ", error);
        });
    }
  };

  const deletePage = (deletePageId) => {
    if (deletePageId) {
      api
        .delete(`/page/delete/${deletePageId}`)
        .then((response) => {
          if (response.status === 200) {
            setTableDataChanged((prev) => !prev);
          }
        })
        .catch((error) => {
          console.error("Error deleting data: ", error);
        });
    }
  };

  const onOrderChange = (content) => {
    let newValue = parseInt(content.target.value, 10);
    const existingOrders = getExistingOrderNumbers();
    newValue = Math.max(newValue, 1);
    while (existingOrders.includes(newValue)) {
      newValue += newValue > lastOrderValue ? 1 : -1;
    }
    setLastOrderValue(newValue);
    content.target.value = newValue;
    setPageOrder(content.target.value);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <EntityTable title="Podstrony" columns={columns} tableRows={tableRows} />

        <EntityDataForm
          formTitle={editPageEnabled ? "Edytuj podstronę" : "Dodaj podstronę"}
          formType={editPageEnabled ? "EDIT" : "ADD"}
          dataFields={[
            {
              fieldName: "Kolejność",
              type: "number",
              placeholder: "Kolejność",
              initialValue: pageOrder,
              onChange: onOrderChange,
            },
            {
              fieldName: "Tytuł",
              type: "text",
              placeholder: "Tytuł",
              initialValue: pageTitle,
              onChange: (content) => setPageTitle(content.target.value),
            },
            {
              fieldName: "Ścieżka",
              type: "text",
              placeholder: "Ścieżka",
              initialValue: pagePath,
              onChange: (content) => setPagePath(content.target.value),
            },
          ]}
          onFormSubmit={editPageEnabled ? editPage : addPage}
          onFormCancel={editPageEnabled && setEditPageEnabled}
        />
      </SoftBox>
    </DashboardLayout>
  );
};
