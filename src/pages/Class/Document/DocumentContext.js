import { useClass } from "contexts/class_context/ClassContext";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { firestore, storage } from "../../../firebase";

const DocumentContext = createContext();

export const DocumentProvider = ({ children }) => {
  const { classId } = useClass();

  const [documents, setDocuments] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const getAllDocument = async () => {
    const homeworksRef = collection(firestore, "homework");
    const querySnapshot = await getDocs(
      query(
        homeworksRef,
        where("class", "==", classId),
        orderBy("dateCreate", "desc")
      )
    );
    const _documents = [];
    querySnapshot?.forEach((doc) => {
      _documents.push({ id: doc.id, ...doc.data() });
    });
    setDocuments(_documents.length === 0 ? null : _documents);
  };

  useEffect(() => {
    const storageRef = ref(storage, "Homework");

    listAll(storageRef)
      .then((res) => {
        res.items.forEach((itemRef) => {
          // Lấy tên của tệp
          const fileName = itemRef.name;
          // Kiểm tra nếu tên của tệp bắt đầu bằng classID
          if (fileName.startsWith(classId)) {
            // Nếu tên của tệp bắt đầu bằng classID, bạn có thể xử lý tệp tin ở đây
            console.log("Tên tệp:", fileName);

            // Nếu bạn muốn lấy URL để tải xuống tệp, bạn có thể sử dụng getDownloadURL
            getDownloadURL(itemRef)
              .then((url) => {
                console.log("URL tải xuống:", url);
              })
              .catch((error) => {
                console.log("Lỗi khi lấy URL tải xuống:", error);
              });
          }
        });
      })
      .catch((error) => {
        console.log("Lỗi khi lấy danh sách tệp:", error);
      });
    getAllDocument();
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
