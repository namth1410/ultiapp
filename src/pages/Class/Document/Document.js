import {
  DesktopOutlined,
  DownloadOutlined,
  EyeOutlined,
  PartitionOutlined,
} from "@ant-design/icons";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { Badge, Button, Input, Select } from "antd";
import pdf from "assets/img/pdf.png";
import React, { useEffect, useState } from "react";
import styles from "./Document.module.css";
import { useDocument } from "./DocumentContext";

function Document() {
  const { documents, setDocuments, selectedDocument, setSelectedDocument } =
    useDocument();
  const { Search } = Input;

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
        const nameA = a.nameHomework.toUpperCase();
        const nameB = b.nameHomework.toUpperCase();
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

  useEffect(() => {
    if (!documents) return;

    let _documents = [...documents];
    _documents = sortArrayByFilter(_documents, filter);
    setDocuments(_documents);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.left_box}>
        {!isShowDocument && (
          <div className={styles.tools}>
            <Search
              placeholder="Tìm kiếm..."
              allowClear
              enterButton="Tìm kiếm"
              size="large"
            />
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
            >
              Tải lên tài liệu
            </Button>
          </div>
        )}
        {isShowDocument ? (
          <div>
            <MemoizedDocViewer
              documents={[
                {
                  uri: selectedDocument.fileURL,
                },
              ]}
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
            {documents?.map((document) => (
              <DocumentItem
                key={document.dateCreate}
                document={document}
                selectedDocument={selectedDocument}
                setSelectedDocument={setSelectedDocument}
              />
            ))}
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
              style={{
                backgroundColor: isShowDocument ? "#ccc" : "unset",
              }}
            >
              <span>{isShowDocument ? "Đóng tài liệu" : "Xem"}</span>
              <EyeOutlined />
            </button>

            <button
              className={styles.action_homework_item}
              onClick={handleDownload}
            >
              <span>Tải xuống</span>
              <DownloadOutlined />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const DocumentItem = ({ document, selectedDocument, setSelectedDocument }) => {
  const { fileURL, nameHomework } = document;
  const typeDocument = fileURL.includes("pdf") ? "PDF" : "Doc";
  return (
    <div style={{ width: "fit-content" }}>
      <Badge.Ribbon text={typeDocument} color="var(--blue)">
        <button
          className={`${styles.document_item} ${
            selectedDocument?.fileURL === fileURL ? styles.selected : ""
          }`}
          onClick={() => {
            setSelectedDocument(document);
          }}
        >
          <div className={styles.img_wrapper}>
            <img alt="img" src={pdf} />
          </div>
          <div className={styles.nameDocument}>{nameHomework}</div>
        </button>
      </Badge.Ribbon>
    </div>
  );
};

const MemoizedDocViewer = React.memo(({ documents }) => (
  <DocViewer documents={documents} pluginRenderers={DocViewerRenderers} />
));

export default Document;
