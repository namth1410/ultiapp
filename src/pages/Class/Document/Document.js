import {
  DeleteOutlined,
  DesktopOutlined,
  DownloadOutlined,
  PartitionOutlined,
} from "@ant-design/icons";
import { Badge, Button, ConfigProvider, Input, Select } from "antd";
import { uploadFile } from "appdata/homework/homeworkSlice";
import empty from "assets/img/empty.json";
import pdf from "assets/img/pdf.png";
import ShowFile from "components/ShowFile/ShowFile";
import { useClass } from "contexts/class_context/ClassContext";
import Lottie from "lottie-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Document.module.scss";
import { useDocument } from "./DocumentContext";

function MyDocument() {
  const dispatch = useDispatch();
  const hiddenFileInput = useRef(null);
  const { classId } = useClass();

  const { documents, selectedDocument, setSelectedDocument } = useDocument();
  const { Search } = Input;
  const homeworkRedux = useSelector((state) => state.homeworkRedux);

  const [documentsToShow, setDocumentsToShow] = useState(null);
  const [preUpLoadDocs, setPreUpLoadDocs] = useState(null);
  const [uploading, setUploading] = useState(false);

  const filters = [
    {
      value: "asc",
      label: "A-Z",
    },
    {
      value: "desc",
      label: "Z-A",
    },
    {
      value: "time_asc",
      label: "Cũ nhất",
    },
    {
      value: "time_desc",
      label: "Mới nhất",
    },
  ];

  const [filter, setFilter] = useState("time_desc");
  const [isShowDocument, setIsShowDocument] = useState(false);

  function sortArrayByFilter(array, filter) {
    let sortedArray = [...array];

    if (filter === "asc" || filter === "desc") {
      sortedArray.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (filter === "asc") {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      });
    } else if (filter === "time_asc" || filter === "time_desc") {
      sortedArray.sort((a, b) => {
        const dateA = new Date(a.dateCreate);
        const dateB = new Date(b.dateCreate);
        if (filter === "time_asc") {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      });
    }

    return sortedArray;
  }

  const handleDownload = () => {
    if (!selectedDocument.fileURL) return;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", selectedDocument.fileURL, true);
    xhr.responseType = "blob";

    xhr.onload = () => {
      if (xhr.status === 200) {
        const url = window.URL.createObjectURL(xhr.response);
        const link = document.createElement("a");
        link.href = url;
        link.download = selectedDocument.nameHomework;
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }
    };

    // Gửi yêu cầu
    xhr.send();
  };

  const onDeletePreUploadDoc = () => {
    setPreUpLoadDocs(
      preUpLoadDocs.filter((el) => el.name !== selectedDocument.name)
    );
  };

  const onUploadDoc = () => {
    preUpLoadDocs.forEach((el) => {
      const body = {
        classId: classId,
        file: el,
        nameFile: `${el.name}`,
      };
      dispatch(uploadFile(body));
    });
    setPreUpLoadDocs(null);
    hiddenFileInput.current.value = "";
  };

  useEffect(() => {
    setUploading(homeworkRedux.loading);
  }, [homeworkRedux]);

  useEffect(() => {
    if (!documentsToShow) return;

    let _documents = [...documentsToShow];
    _documents = sortArrayByFilter(_documents, filter);
    setDocumentsToShow(_documents);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    setDocumentsToShow(documents);
  }, [documents]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.left_box}>
        {!isShowDocument && (
          <div className={styles.tools}>
            <ConfigProvider
              theme={{
                token: {
                  colorText: "var(--text-color-primary)",
                  colorTextPlaceholder: "var(--text-color-secondary)",
                  colorBorder: "var(--text-color-primary)",
                  colorBgContainer: "var(--body-background)",
                },
              }}
            >
              <Search
                placeholder="Tìm kiếm..."
                allowClear
                enterButton="Tìm kiếm"
                size="large"
                onChange={(e) => {
                  setSelectedDocument(null);
                  const key = e.target.value.trim();
                  if (key === "") {
                    setDocumentsToShow(documents);
                  } else {
                    const a =
                      documentsToShow?.filter((el) => el.name.includes(key)) ||
                      [];

                    setDocumentsToShow(a.length === 0 ? null : a);
                  }
                }}
              />
            </ConfigProvider>
            <Select
              defaultValue="time_desc"
              style={{
                width: 160,
                height: "100%",
              }}
              options={filters}
              onChange={(e) => {
                setFilter(e);
              }}
            />
            <Button
              size="large"
              type="primary"
              style={{
                background: "#1e88e5",
                fontFamily: "Gilroy",
                width: "fit-content",
                height: "100%",
              }}
              onClick={() => {
                hiddenFileInput.current.click();
              }}
            >
              Tải lên tài liệu
            </Button>
            <input
              id="fileUpload"
              type="file"
              accept=".pdf"
              multiple
              ref={hiddenFileInput}
              onChange={(el) => {
                console.log(el.target.files);
                setPreUpLoadDocs(Array.from(el.target.files));
              }}
              style={{ display: "none" }}
            />
          </div>
        )}
        {isShowDocument ? (
          <div>
            <ShowFile
              fileUri={
                selectedDocument.fileURL ||
                URL.createObjectURL(selectedDocument)
              }
            />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              gap: "15px",
              padding: "5px 10px",
              flexWrap: "wrap",
            }}
          >
            {(preUpLoadDocs || uploading) && (
              <div style={{ width: "100%" }}>
                <Button
                  onClick={onUploadDoc}
                  type="primary"
                  loading={uploading}
                >
                  Tải lên
                </Button>
              </div>
            )}
            {preUpLoadDocs && (
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  flexDirection: "column",
                  borderBottom: "2px solid #d8dcf0",
                  paddingBottom: "10px",
                }}
              >
                <div style={{ marginBottom: "10px" }}>Chuẩn bị tải lên</div>
                <div style={{ display: "flex", gap: "15px" }}>
                  {preUpLoadDocs.map((el) => (
                    <DocumentItem
                      key={el.name}
                      document={el}
                      selectedDocument={selectedDocument}
                      setSelectedDocument={setSelectedDocument}
                    />
                  ))}
                </div>
              </div>
            )}
            {documentsToShow ? (
              documentsToShow.map((document) => (
                <DocumentItem
                  key={document.dateCreate}
                  document={document}
                  selectedDocument={selectedDocument}
                  setSelectedDocument={setSelectedDocument}
                />
              ))
            ) : (
              <Lottie
                style={{ width: "40%", margin: "auto", marginTop: "10%" }}
                animationData={empty}
                loop={true}
              />
            )}
          </div>
        )}
      </div>
      {selectedDocument && (
        <div className={styles.right_box}>
          <div style={{ width: "100%" }}>
            <button className={styles.action_homework_item}>
              <span>Làm thử</span>
              <DesktopOutlined />
            </button>

            <button className={styles.action_homework_item}>
              <span>Chi tiết</span>
              <PartitionOutlined />
            </button>

            <button
              className={styles.action_homework_item}
              onClick={() => {
                setIsShowDocument(!isShowDocument);
              }}
            >
              <span>{isShowDocument ? "Đóng tài liệu" : "Xem"}</span>
              {isShowDocument ? (
                <i className="bi bi-eye"></i>
              ) : (
                <i className="bi bi-eye-slash"></i>
              )}
            </button>

            <button
              className={styles.action_homework_item}
              onClick={handleDownload}
            >
              <span>Tải xuống</span>
              <DownloadOutlined />
            </button>

            {!selectedDocument.fileURL && (
              <button
                className={styles.action_homework_item}
                onClick={onDeletePreUploadDoc}
              >
                <span style={{ color: "#ff4141" }}>Xóa</span>
                <DeleteOutlined style={{ color: "#ff4141" }} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const DocumentItem = ({ document, selectedDocument, setSelectedDocument }) => {
  const { fileURL, nameHomework, name } = document;
  const typeDocument = fileURL?.includes("pdf") ? "PDF" : "Doc";
  return (
    <div style={{ width: "fit-content" }}>
      <Badge.Ribbon text={typeDocument} color="var(--blue)">
        <button
          className={`${styles.document_item} ${
            selectedDocument?.fileURL === fileURL && fileURL
              ? styles.selected
              : ""
          } ${
            selectedDocument?.name === name && !fileURL ? styles.selected : ""
          }`}
          onClick={() => {
            if (document.fileURL === selectedDocument?.fileURL) {
              setSelectedDocument(null);
            } else {
              setSelectedDocument(document);
            }
          }}
        >
          <div className={styles.img_wrapper}>
            <img alt="img" src={pdf} />
          </div>
          <div className={styles.nameDocument}>{nameHomework || name}</div>
        </button>
      </Badge.Ribbon>
    </div>
  );
};

export default MyDocument;
