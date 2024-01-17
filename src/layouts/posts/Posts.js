import api from "api/api";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import EditIcon from "@mui/icons-material/Edit";
import EntityTable from "components/EntityTable/EntityTable";
import { EntityDataForm } from "components/EntityDataForm/EntityDataForm";
import DeleteIcon from "@mui/icons-material/Delete";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ArchiveIcon from "@mui/icons-material/Archive";
import { useParams } from "react-router-dom";

export const Posts = () => {
  const { t } = useTranslation();
  const { websiteId } = useParams();
  const [entityData, setEntityData] = useState();
  const [tableRows, setTableRows] = useState();
  const [editEntityEnabled, setEditEntityEnabled] = useState(false);
  const [editEntityId, setEditEntityId] = useState();
  const [tableDataChanged, setTableDataChanged] = useState(false);

  const [title, setTitle] = useState();
  const [createdAt, setCreatedAt] = useState();
  const [createdBy, setCreatedBy] = useState();
  const [status, setStatus] = useState();
  const [categories, setCategories] = useState();

  const [content, setContent] = useState();
  const [selectedCategory, setSelectedCategory] = useState();

  const columns = [
    { name: "title", align: "center" },
    { name: "created at", align: "center" },
    { name: "created by", align: "center" },
    { name: "status", align: "center" },
    { name: "categories", align: "center" },
    { name: "edit post", align: "center" },
    { name: "archive post", align: "center" },
    { name: "share post", align: "center" },
  ];

  const prepareTableContent = (data) => {
    return data.map((row) => prepareTableRow(row));
  };

  const prepareTableRow = ({ title, createdAt, createdBy, status, categories }) => {
    return {
      title: (
        <SoftTypography variant="caption" color="secondary" fontWeight="medium">
          {title}
        </SoftTypography>
      ),
      "created at": (
        <SoftTypography variant="caption" color="secondary" fontWeight="medium">
          {createdAt}
        </SoftTypography>
      ),
      "created by": (
        <SoftTypography variant="caption" color="secondary" fontWeight="medium">
          {createdBy}
        </SoftTypography>
      ),
      status: (
        <SoftTypography variant="caption" color="secondary" fontWeight="medium">
          {status}
        </SoftTypography>
      ),
      categories: (
        <SoftTypography variant="caption" color="secondary" fontWeight="medium">
          {categories}
        </SoftTypography>
      ),
      "edit post": (
        <SoftButton
          onClick={() => {
            setEditEntityEnabled(true);
            setEditEntityId(themeId);
            setTitle(title);
            setCreatedAt(createdAt);
            setCreatedBy(createdBy);
            setStatus(status);
            setCategories(categories);
          }}
        >
          <EditIcon />
        </SoftButton>
      ),
      "archive post": (
        <SoftButton onClick={() => archivePost(themeId)}>
          <ArchiveIcon />
        </SoftButton>
      ),
      "share post": (
        <SoftButton onClick={() => sharePost(themeId)}>
          <PostAddIcon />
        </SoftButton>
      ),
    };
  };

  useEffect(() => {
    if (websiteId) {
      api
        .get(`/post/get-all-by-website${websiteId}`)
        .then((response) => {
          if (response.status === 200) {
            setEntityData(response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        });
    }
  }, [websiteId, tableDataChanged]);

  useEffect(() => {
    if (entityData) {
      setTableRows(prepareTableContent(entityData));
    }
  }, [entityData]);

  const addPost = () => {
    if (websiteId && title && content && categories) {
      api
        .post(`/post`, {
          websiteId: websiteId,
          title: title,
          content: content,
          categoriesIds: categories,
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

  const editPost = () => {
    if (editEntityId) {
      api
        .post(`/post/update/${editEntityId}`, {
          websiteId: websiteId,
          title: title,
          content: content,
          categoriesIds: categories,
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

  const archivePost = (postId) => {
    if (postId) {
      api
        .post(`/post/archive/${postId}`)
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

  const sharePost = (postId) => {
    if (postId) {
      api
        .post(`/post/share/${postId}`)
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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <EntityTable title="Posty" columns={columns} tableRows={tableRows} />

        <EntityDataForm
          formTitle={editEntityEnabled ? "Edytuj post" : "Dodaj post"}
          formType={editEntityEnabled ? "EDIT" : "ADD"}
          dataFields={[
            {
              fieldName: "Tytuł",
              type: "text",
              placeholder: "Tytuł",
              initialValue: title,
              onChange: (content) => setTitle(content.target.value),
            },
            {
              fieldName: "Kategorie",
              type: "dropdown",
              placeholder: "Kategorie",
              initialValue: selectedCategory,
              onChange: (content) => setSelectedCategory(content.target.value),
              options: [
                { value: "category1", label: "Category 1" },
                { value: "category2", label: "Category 2" },
              ],
            },
          ]}
          onFormSubmit={editEntityEnabled ? editPost : addPost}
          onFormCancel={editEntityEnabled && setEditEntityEnabled}
        />
      </SoftBox>
    </DashboardLayout>
  );
};
