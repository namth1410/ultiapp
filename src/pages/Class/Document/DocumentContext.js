import { useClass } from "contexts/class_context/ClassContext";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { firestore } from "../../../firebase";
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
    setDocuments(_documents);
  };
  useEffect(() => {
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
