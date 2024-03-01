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

  const [title, setTitle] = useState();
  const [titleColor, setTitleColor] = useState();

  const [description, setDescription] = useState();
  const [descriptionColor, setDescriptionColor] = useState();
  const [source, setSource] = useState();
  const [alt, setAlt] = useState();
  const [maxWidth, setMaxWidth] = useState();
  const [maxHeight, setMaxHeight] = useState();
  const [sourceList, setSourceList] = useState([]);

  const [controls, setControls] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [loop, setLoop] = useState(false);
  const [muted, setMuted] = useState(false);

  const componentTypes = {
    text: "TEXT",
    image: "IMAGE",
    gallery: "GALLERY",
    video: "VIDEO",
    timeline: "TIMELINE",
    descriptionCard: "DESCRIPTION_CARD",
  };
  const [type, setType] = useState(componentTypes.text);

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

  const columns = [
    { name: "order", align: "center" },
    { name: "type", align: "center" },
    { name: "edit component", align: "center" },
    { name: "delete component", align: "center" },
  ];

  const prepareTableContent = (data) => {
    if (data) {
      return data.map((row) => prepareTableRow(row));
    }
  };

  const prepareTableRow = ({
    componentId,
    order,
    type,
    textComponent,
    imageComponent,
    imageGalleryComponent,
    descriptionCardComponent,
    videoComponent,
    timelineComponent,
  }) => {
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
      "edit component": (
        <SoftButton
          onClick={() => {
            setEditEntityEnabled(true);
            setEditEntityId(componentId);
            setOrder(order);
            setType(type);

            switch (type) {
              case componentTypes.text:
                setTitle(textComponent.title);
                setTitleColor(textComponent.titleColor);
                setDescription(textComponent.description);
                setDescriptionColor(textComponent.descriptionColor);
                break;
              case componentTypes.image:
                setSource(imageComponent.src);
                setAlt(imageComponent.alt);
                setMaxWidth(imageComponent.maxWidth);
                setMaxHeight(imageComponent.maxHeight);
                break;
              case componentTypes.video:
                setSource(videoComponent.src);
                setAlt(videoComponent.alt);
                setMaxWidth(videoComponent.maxWidth);
                setMaxHeight(videoComponent.maxHeight);
                setControls(videoComponent.controls);
                setAutoPlay(videoComponent.autoPlay);
                setLoop(videoComponent.loop);
                setMuted(videoComponent.muted);
                break;
              case componentTypes.gallery:
                setSourceList(imageGalleryComponent.imageUrls);
                break;
              case componentTypes.descriptionCard:
                setSource(descriptionCardComponent.imageUrl);
                setTitle(descriptionCardComponent.title);
                setTitleColor(descriptionCardComponent.titleColor);
                setDescription(descriptionCardComponent.description);
                setDescriptionColor(descriptionCardComponent.descriptionColor);
                break;
            }
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

  const obtainComponentRequestBody = () => {
    let request = {
      pageSectionId: sectionId,
      order: order,
      type: type,
    };

    switch (request.type) {
      case componentTypes.text:
        request.textComponent = {
          title: title,
          titleColor: titleColor,
          description: description,
          descriptionColor: descriptionColor,
        };
        break;
      case componentTypes.image:
        request.imageComponent = {
          src: source,
          alt: alt,
          maxWidth: maxWidth,
          maxHeight: maxHeight,
        };
        break;
      case componentTypes.video:
        request.videoComponent = {
          src: source,
          alt: alt,
          maxWidth: maxWidth,
          maxHeight: maxHeight,
          controls: controls,
          autoPlay: autoPlay,
          loop: loop,
          muted: muted,
        };
        break;
      case componentTypes.gallery:
        request.imageGalleryComponent = {
          imageUrls: sourceList,
        };
        break;
      case componentTypes.descriptionCard:
        request.descriptionCardComponent = {
          imageUrl: source,
          title: title,
          titleColor: titleColor,
          description: description,
          descriptionColor: descriptionColor,
        };
        break;
      case componentTypes.timeline:
        break;
    }

    return request;
  };

  const addComponent = () => {
    if (order && sectionId && type) {
      api
        .post(`/component`, obtainComponentRequestBody())
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
        .post(`/component/update/${editEntityId}`, obtainComponentRequestBody())
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
        .delete(`/component/delete/${deleteEntityId}`)
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

  useEffect(() => {
    if (!editEntityEnabled) {
      setOrder(undefined);
      setTitle(undefined);
      setTitleColor(undefined);
      setDescription(undefined);
      setDescriptionColor(undefined);
      setSource(undefined);
      setAlt(undefined);
      setMaxWidth(undefined);
      setMaxHeight(undefined);
      setSourceList([]);
      setControls(true);
      setAutoPlay(false);
      setLoop(false);
      setMuted(false);
    }
  }, [editEntityEnabled]);

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
                { value: componentTypes.text, label: "Tekst" },
                { value: componentTypes.image, label: "Obraz" },
                { value: componentTypes.gallery, label: "Galeria" },
                { value: componentTypes.video, label: "Wideo" },
                // { value: componentTypes.timeline, label: "Timeline" },
                { value: componentTypes.descriptionCard, label: "Karta opisowa" },
              ],
            },
            (type === componentTypes.text || type === componentTypes.descriptionCard) && {
              fieldName: "Tytuł",
              type: "text",
              placeholder: "Tytuł",
              initialValue: title,
              onChange: (content) => setTitle(content.target.value),
            },
            (type === componentTypes.text || type === componentTypes.descriptionCard) && {
              fieldName: "Kolor tytułu",
              type: "color",
              placeholder: "Kolor tytułu",
              initialValue: titleColor,
              onChange: (content) => setTitleColor(content.target.value),
            },
            (type === componentTypes.text || type === componentTypes.descriptionCard) && {
              fieldName: "Opis",
              type: "text",
              placeholder: "Opis",
              initialValue: description,
              onChange: (content) => setDescription(content.target.value),
            },
            (type === componentTypes.text || type === componentTypes.descriptionCard) && {
              fieldName: "Kolor opisu",
              type: "color",
              placeholder: "Kolor opisu",
              initialValue: descriptionColor,
              onChange: (content) => setDescriptionColor(content.target.value),
            },
            (type === componentTypes.descriptionCard ||
              type === componentTypes.image ||
              type === componentTypes.video) && {
              fieldName: "Źródło",
              type: "text",
              placeholder: "Źródło",
              initialValue: source,
              onChange: (content) => setSource(content.target.value),
            },
            (type === componentTypes.image || type === componentTypes.video) && {
              fieldName: "Alternatywny tekst",
              type: "text",
              placeholder: "Alternatywny tekst",
              initialValue: alt,
              onChange: (content) => setAlt(content.target.value),
            },
            (type === componentTypes.image || type === componentTypes.video) && {
              fieldName: "Maksymalna szerokość",
              type: "text",
              placeholder: "Maksymalna szerokość",
              initialValue: maxWidth,
              onChange: (content) => setMaxWidth(content.target.value),
            },
            (type === componentTypes.image || type === componentTypes.video) && {
              fieldName: "Maksymalna wysokość",
              type: "text",
              placeholder: "Maksymalna wysokość",
              initialValue: maxHeight,
              onChange: (content) => setMaxHeight(content.target.value),
            },
            type === componentTypes.gallery && {
              fieldName: "Lista źródeł",
              type: "list",
              placeholder: "Lista źródeł",
              initialValue: sourceList,
              onChange: setSourceList,
            },
            type === componentTypes.video && {
              fieldName: "Pokaż przyciski kontroli",
              type: "dropdown",
              placeholder: "Pokaż przyciski kontroli",
              initialValue: controls,
              onChange: (content) => setControls(content.target.value),
              options: [
                { value: true, label: "Tak" },
                { value: false, label: "Nie" },
              ],
            },
            type === componentTypes.video && {
              fieldName: "Włącz automatyczne odtwarzanie",
              type: "dropdown",
              placeholder: "Włącz automatyczne odtwarzanie",
              initialValue: autoPlay,
              onChange: (content) => setAutoPlay(content.target.value),
              options: [
                { value: true, label: "Tak" },
                { value: false, label: "Nie" },
              ],
            },
            type === componentTypes.video && {
              fieldName: "Odtwarzaj w pętli",
              type: "dropdown",
              placeholder: "Odtwarzaj w pętli",
              initialValue: loop,
              onChange: (content) => setLoop(content.target.value),
              options: [
                { value: true, label: "Tak" },
                { value: false, label: "Nie" },
              ],
            },
            type === componentTypes.video && {
              fieldName: "Wycisz",
              type: "dropdown",
              placeholder: "Wycisz",
              initialValue: muted,
              onChange: (content) => setMuted(content.target.value),
              options: [
                { value: true, label: "Tak" },
                { value: false, label: "Nie" },
              ],
            },

            // todo: Dodać timeline
          ]}
          onFormSubmit={editEntityEnabled ? editComponent : addComponent}
          onFormCancel={editEntityEnabled && setEditEntityEnabled}
        />
      </SoftBox>
    </DashboardLayout>
  );
};
