import { useClass } from "contexts/class_context/ClassContext";
import { getDownloadURL, getMetadata, listAll, ref } from "firebase/storage";
import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { storage } from "../../../firebase";

const DocumentContext = createContext();

export const DocumentProvider = ({ children }) => {
  const { classId } = useClass();

  const [documents, setDocuments] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    const storageRef = ref(storage, "Homework");
    const _documents = [];

    listAll(storageRef)
      .then((res) => {
        const promises = res.items.map(async (itemRef) => {
          const metadata = await getMetadata(itemRef);
          const timeCreated = metadata.timeCreated;
          const fileName = itemRef.name;
          if (fileName.startsWith(classId)) {
            return getDownloadURL(itemRef)
              .then((url) => {
                const tmp = fileName.split("#");
                _documents.push({
                  name: tmp[tmp.length - 1],
                  fileURL: url,
                  dateCreate: timeCreated,
                });
              })
              .catch((error) => {
                console.log("Lỗi khi lấy URL tải xuống:", error);
              });
          }
        });
        return Promise.all(promises);
      })
      .then(() => {
        setDocuments(_documents.length === 0 ? null : _documents);
      })
      .catch((error) => {
        console.log("Lỗi khi lấy danh sách tệp:", error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue = useMemo(
    () => ({
      documents,
      setDocuments,
      selectedDocument,
      setSelectedDocument,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [documents, selectedDocument]
  );

  return (
    <DocumentContext.Provider value={contextValue}>
      {children}
    </DocumentContext.Provider>
  );
};

DocumentProvider.propTypes = {
  children: PropTypes.any,
};

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("useDocument must be used within a DocumentProvider");
  }
  return context;
};
