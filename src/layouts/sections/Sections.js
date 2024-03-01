import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import EntityTable from "components/EntityTable/EntityTable";
import { EntityDataForm } from "components/EntityDataForm/EntityDataForm";
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import api from "api/api";
import ColorDisplay from "components/ColorDisplay/ColorDisplay";

export const Sections = () => {
  const { t } = useTranslation();
  const { pageId } = useParams();
  const navigate = useNavigate();

  const [entityData, setEntityData] = useState();
  const [tableRows, setTableRows] = useState();
  const [editEntityEnabled, setEditEntityEnabled] = useState(false);
  const [editEntityId, setEditEntityId] = useState();
  const [tableDataChanged, setTableDataChanged] = useState(false);
  const [lastOrderValue, setLastOrderValue] = useState(1);

  const [order, setOrder] = useState();
  const [backgroundColor, setBackgroundColor] = useState();

  const columns = [
    { name: "order", align: "center" },
    { name: "background color", align: "center" },
    { name: "column count", align: "center" },
    { name: "edit section", align: "center" },
    { name: "edit section columns", align: "center" },
    { name: "delete section", align: "center" },
  ];

  const prepareTableContent = (data) => {
    return data.map((row) => prepareTableRow(row));
  };

  const prepareTableRow = ({ pageSectionId, order, columnCount, backgroundColor }) => {
    return {
      order: (
        <SoftTypography variant="caption" color="secondary" fontWeight="medium">
          {order}
        </SoftTypography>
      ),
      "background color": (
        <ColorDisplay height={ 30 } width={ 30 } hexCode={ backgroundColor } />
      ),
      "column count": (
        <SoftTypography variant="caption" color="secondary" fontWeight="medium">
          {columnCount}
        </SoftTypography>
      ),
      "edit section columns": (
        <SoftButton onClick={() => {navigate(`/dashboard/pages/page-sections/components/${pageSectionId}`)}}>
          <ViewWeekIcon />
        </SoftButton>
      ),
      "edit section": (
        <SoftButton
          onClick={() => {
            setEditEntityEnabled(true);
            setEditEntityId(pageSectionId);
            setBackgroundColor(backgroundColor);
            setOrder(order);
          }}
        >
          <EditIcon />
        </SoftButton>
      ),
      "delete section": (
        <SoftButton onClick={() => deleteSection(pageSectionId)}>
          <DeleteIcon />
        </SoftButton>
      ),
    };
  };

  useEffect(() => {
    api
      .get(`/page-section/get-all-by-page/${pageId}`)
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

  const addSection = () => {
    if (order) {
      api
        .post(`/page-section`, {
          pageId: pageId,
          order: order,
          backgroundColor: backgroundColor,
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

  const editSection = () => {
    if (editEntityId) {
      api
        .post(`/page-section/update/${editEntityId}`, {
          pageId: pageId,
          order: order,
          backgroundColor: backgroundColor,
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

  const deleteSection = (deleteEntityId) => {
    if (deleteEntityId) {
      api
        .delete(`/page-section/delete/${deleteEntityId}`)
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
    setOrder(content.target.value);
  };

  const getExistingOrderNumbers = () => {
    if (tableRows) {
      return tableRows.map((row) => parseInt(row.order.props.children, 10));
    }
  };

  useEffect(() => {
    if (!editEntityEnabled) {
      setOrder(undefined);
      setBackgroundColor(undefined);
    }
  }, [editEntityEnabled])

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <EntityTable title="Sekcje" columns={columns} tableRows={tableRows} />

        <EntityDataForm
          formTitle={editEntityEnabled ? "Edytuj sekcję" : "Dodaj sekcję"}
          formType={editEntityEnabled ? "EDIT" : "ADD"}
          dataFields={[
            {
              fieldName: "Kolejność",
              type: "number",
              placeholder: "Kolejność",
              initialValue: order,
              onChange: onOrderChange,
            },
            {
              fieldName: "Kolor tła",
              type: "color",
              initialValue: backgroundColor,
              onChange: (content) => setBackgroundColor(content.target.value),
            },
          ]}
          onFormSubmit={editEntityEnabled ? editSection : addSection}
          onFormCancel={editEntityEnabled && setEditEntityEnabled}
        />
      </SoftBox>
    </DashboardLayout>
  );
};
