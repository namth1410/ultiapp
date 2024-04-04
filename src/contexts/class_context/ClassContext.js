import {
  getDataClassById,
  getHomeworkOfClass,
  snapshotDataClass,
} from "appdata/class/classSlice";
import { snapshotDataHomework } from "appdata/homework/homeworkSlice";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth, firestore } from "../../firebase";

const ClassContext = createContext();

export const ClassProvider = ({ children }) => {
  const dispatch = useDispatch();
  const classRedux = useSelector((state) => state.classRedux);
  const mySelf = JSON.parse(localStorage.getItem("ulti_user"));
  const [dataClass, setDataClass] = useState(null);
  const [creatorId, setCreatorId] = useState(null);
  const [dataHomework, setDataHomework] = useState(null);
  const [requestJoinClass, setRequestJoinClass] = useState(null);

  const classId = window.location.pathname.split("/")[2];

  useEffect(() => {
    const unsubRequestJoinClass = onSnapshot(
      query(
        collection(firestore, "notifications"),
        where("class", "==", classId),
        where("type", "==", "request_join_class")
      ),
      (docSnapshot) => {
        if (!docSnapshot.empty) {
          const requestJoinClassData = [];
          docSnapshot?.forEach((doc) => {
            requestJoinClassData.push({ id: doc.id, ...doc.data() });
          });
          setRequestJoinClass(requestJoinClassData);
        } else {
          setRequestJoinClass(null);
          console.log("Không tìm thấy request với id đã cho");
        }
      }
    );

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in:", user);
      } else {
        console.log("User is signed out");
      }
    });

    return () => {
      unsubRequestJoinClass();
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setDataClass(classRedux.dataClass);
    setCreatorId(classRedux.dataClass?.uidCreator);
    setDataHomework(classRedux.dataHomework);
  }, [classRedux]);

  useEffect(() => {
    dispatch(snapshotDataClass({ id: classId }));
    dispatch(snapshotDataHomework({ id: classId }));
    dispatch(getDataClassById({ id: classId }));
    dispatch(getHomeworkOfClass({ id: classId }));

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
      requestJoinClass,
      mySelf,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [creatorId, classId, dataClass, dataHomework, requestJoinClass, mySelf]
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
