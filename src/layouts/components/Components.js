import { EntityDataForm } from "components/EntityDataForm/EntityDataForm";
import EntityTable from "components/EntityTable/EntityTable";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "api/api";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Components = () => {
  const { t } = useTranslation();
  const { sectionId } = useParams();

  const [entityData, setEntityData] = useState();
  const [tableRows, setTableRows] = useState();
  const [editEntityEnabled, setEditEntityEnabled] = useState(false);
  const [editEntityId, setEditEntityId] = useState();
  const [tableDataChanged, setTableDataChanged] = useState(false);
  const [lastOrderValue, setLastOrderValue] = useState(1);

  const [order, setOrder] = useState();
  const [type, setType] = useState("TEXT");
  const [content, setContent] = useState();

  const columns = [
    { name: "order", align: "center" },
    { name: "type", align: "center" },
    { name: "content", align: "center" },
    { name: "edit component", align: "center" },
    { name: "delete component", align: "center" },
  ];

  const prepareTableContent = (data) => {
    if (data) {
        return data.map((row) => prepareTableRow(row));
    }
  };

  const prepareTableRow = ({ componentId, order, type, content }) => {
    return {
      order: (
        <SoftTypography variant="caption" color="secondary" fontWeight="medium">
          {order}
        </SoftTypography>
      ),
      type: (
        <SoftTypography variant="caption" color="secondary" fontWeight="medium">
          {type}
        </SoftTypography>
      ),
      content: (
        <SoftTypography variant="caption" color="secondary" fontWeight="medium">
          {content}
        </SoftTypography>
      ),
      "edit component": (
        <SoftButton
          onClick={() => {
            setEditEntityEnabled(true);
            setEditEntityId(componentId);
            setOrder(order);
            setType(type);
            setContent(content);
          }}
        >
          <EditIcon />
        </SoftButton>
      ),
      "delete component": (
        <SoftButton onClick={() => deleteComponent(componentId)}>
          <DeleteIcon />
        </SoftButton>
      ),
    };
  };

  useEffect(() => {
    api
      .get(`/component/get-all-by-page-section/${sectionId}`)
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

  const addComponent = () => {
    if (order && sectionId && type && content) {
      api
        .post(`/component`, {
          pageSectionId: sectionId,
          order: order,
          type: type,
          content: content,
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

  const editComponent = () => {
    if (editEntityId) {
      api
        .post(`/component/update/${editEntityId}`, {
          pageSectionId: sectionId,
          order: order,
          type: type,
          content: content,
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

  const deleteComponent = (deleteEntityId) => {
    if (deleteEntityId) {
      api
        .delete(`/component/delete/${editEntityId}`)
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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <EntityTable title="Komponenty" columns={columns} tableRows={tableRows} />

        <EntityDataForm
          formTitle={editEntityEnabled ? "Edytuj komponent" : "Dodaj komponent"}
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
              fieldName: "Typ",
              type: "dropdown",
              placeholder: "Typ",
              initialValue: type,
              onChange: (content) => setType(content.target.value),
              options: [
                { value: "TEXT", label: "Text" },
                { value: "IMAGE", label: "Image" },
                { value: "VIDEO", label: "Video" },
              ],
            },
            {
              fieldName: "Zawartość",
              type: "text",
              placeholder: "Zawartość",
              initialValue: content,
              onChange: (content) => setContent(content.target.value),
            },
          ]}
          onFormSubmit={editEntityEnabled ? editComponent : addComponent}
          onFormCancel={editEntityEnabled && setEditEntityEnabled}
        />
      </SoftBox>
    </DashboardLayout>
  );
};
