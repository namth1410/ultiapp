import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, firestore } from "../../firebase";

const ClassContext = createContext();

export const ClassProvider = ({ children }) => {
  const [dataClass, setDataClass] = useState(null);

  const id = window.location.pathname.split("/")[2];

  useEffect(() => {
    const classRef = doc(firestore, "classes", id);

    const unsub = onSnapshot(classRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const classData = { id: docSnapshot.id, ...docSnapshot.data() };
        setDataClass(classData);
        console.log(classData);
      } else {
        console.log("Không tìm thấy class với id đã cho");
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
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue = useMemo(
    () => ({
      dataClass,
      setDataClass,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataClass]
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
