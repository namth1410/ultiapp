import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { doc, getDoc } from "firebase/firestore";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { firestore } from "../../../../firebase";
import RightBox from "./RightBox";
import styles from "./TestHomework.module.css";

function TestHomework() {
  const homeworkId = window.location.pathname.split("/")[4];

  const [dataHomework, setDataHomework] = useState(null);

  const memoizedDocuments = useMemo(() => {
    return [
      {
        uri: dataHomework?.fileURL,
      },
    ];
  }, [dataHomework?.fileURL]);

  useEffect(() => {
    console.log(dataHomework);
  }, [dataHomework]);

  useEffect(() => {
    const getDataHomework = async () => {
      const homeworkRef = doc(firestore, "homework", homeworkId);
      const docSnapshot = await getDoc(homeworkRef);
      console.log(docSnapshot.data());
      console.log(docSnapshot.id);
      setDataHomework({ id: docSnapshot.id, ...docSnapshot.data() });
    };
    getDataHomework();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.wrapper}>
      {dataHomework && (
        <>
          <div className={styles.left_box}>
            <MemoizedDocViewer documents={memoizedDocuments} />
          </div>
          {dataHomework && (
            <div className={styles.right_box}>
              <RightBox dataHomework={dataHomework} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

const MemoizedDocViewer = React.memo(({ documents }) => (
  <DocViewer documents={documents} pluginRenderers={DocViewerRenderers} />
));

MemoizedDocViewer.propTypes = {
  documents: PropTypes.any,
};

export default TestHomework;
