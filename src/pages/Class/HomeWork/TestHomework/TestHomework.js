import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { getDataHomeworkById } from "appdata/homework/homeworkSlice";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RightBox from "./RightBox";
import styles from "./TestHomework.module.css";

function TestHomework() {
  const homeworkId = window.location.pathname.split("/")[4];
  const dispatch = useDispatch();

  const homeworkRedux = useSelector((state) => state.homeworkRedux);

  const [dataHomework, setDataHomework] = useState(null);

  const memoizedDocuments = useMemo(() => {
    return [
      {
        uri: dataHomework?.fileURL,
      },
    ];
  }, [dataHomework?.fileURL]);

  useEffect(() => {
    setDataHomework(homeworkRedux.dataHomeworkById);
  }, [homeworkRedux]);

  useEffect(() => {
    dispatch(getDataHomeworkById({ homeworkId: homeworkId }));
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
