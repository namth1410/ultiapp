import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../../../../firebase";
import styles from "./TestHomework.module.css";

const homeworkId = window.location.pathname.split("/")[4];

function TestHomework() {
  const [dataHomework, setDataHomework] = useState(null);

  useEffect(() => {
    console.log(dataHomework);
  }, [dataHomework]);

  useEffect(() => {
    const getDataHomework = async () => {
      const homeworkRef = doc(firestore, "homework", homeworkId);
      const docSnapshot = await getDoc(homeworkRef);
      console.log(docSnapshot.data());
      setDataHomework(docSnapshot.data());
    };
    getDataHomework();
  }, []);

  return (
    <div className={styles.wrapper}>
      {dataHomework && (
        <div className={styles.left_box}>
          <DocViewer
            documents={[
              {
                uri: "https://firebasestorage.googleapis.com/v0/b/ultiapp-255c3.appspot.com/o/Homework%2Fshub_sample_pdf.pdf?alt=media&token=d53cba67-1733-4a82-b947-d316c8e34e1a",
              },
            ]}
            pluginRenderers={DocViewerRenderers}
          />
        </div>
      )}
    </div>
  );
}

export default TestHomework;
