import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, query, collection, where } from "firebase/firestore";
import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, firestore } from "../../firebase";

const ClassContext = createContext();

export const ClassProvider = ({ children }) => {
  const [dataClass, setDataClass] = useState(null);
  const [creatorId, setCreatorId] = useState(null);
  const [dataHomework, setDataHomework] = useState(null);

  const classId = window.location.pathname.split("/")[2];

  useEffect(() => {
    const classRef = doc(firestore, "classes", classId);

    const unsub = onSnapshot(classRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const classData = { id: docSnapshot.id, ...docSnapshot.data() };
        setDataClass(classData);
        setCreatorId(classData.uidCreator);
      } else {
        console.log("Không tìm thấy class với id đã cho");
      }
    });

    const qHomework = query(
      collection(firestore, "homework"),
      where("class", "==", classId)
    );
    const unsubHomework = onSnapshot(qHomework, (docSnapshot) => {
      if (!docSnapshot.empty) {
        const homeworkData = [];
        docSnapshot?.forEach((doc) => {
          homeworkData.push({ id: doc.id, ...doc.data() });
        });

        setDataHomework(homeworkData);
      } else {
        console.log("Không tìm thấy homework với id đã cho");
      }
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in:", user);
      } else {
        console.log("User is signed out");
      }
    });

    return () => {
      unsubscribe();
      unsub();
      unsubHomework();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue = useMemo(
    () => ({
      creatorId,
      classId,
      dataClass,
      setDataClass,
      dataHomework,
      setDataHomework,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataClass, dataHomework]
  );

  return (
    <ClassContext.Provider value={contextValue}>
      {children}
    </ClassContext.Provider>
  );
};

ClassProvider.propTypes = {
  children: PropTypes.any,
};

export const useClass = () => {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error("useClass must be used within a ClassProvider");
  }
  return context;
};
