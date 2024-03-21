import { useClass } from "contexts/class_context/ClassContext";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { firestore } from "../../../firebase";
const ScoreContext = createContext();

export const ScoreProvider = ({ children }) => {
  const { dataClass, dataHomework } = useClass();

  const [selectedHomework, setSelectedHomework] = useState(null);
  const [studentHomeworkData, setStudentHomeworkData] = useState(null);

  const getStudentHomeworkData = async () => {
    const q = query(
      collection(firestore, "homework_results"),
      where("homework_id", "==", selectedHomework.id),
      orderBy("dateCreate", "desc")
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      setStudentHomeworkData(null);
    } else {
      const _studentHomeworkData = [];

      querySnapshot.forEach((doc) => {
        _studentHomeworkData.push({ ...doc.data(), id: doc.id });
      });
      setStudentHomeworkData(_studentHomeworkData);
    }
  };

  useEffect(() => {
    if (!dataHomework) return;
    setSelectedHomework(dataHomework[0]);
  }, [dataHomework]);

  useEffect(() => {
    if (!selectedHomework) return;
    getStudentHomeworkData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHomework]);

  const contextValue = useMemo(
    () => ({
      selectedHomework,
      setSelectedHomework,
      studentHomeworkData,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedHomework, studentHomeworkData]
  );

  return (
    <ScoreContext.Provider value={contextValue}>
      {children}
    </ScoreContext.Provider>
  );
};

ScoreProvider.propTypes = {
  children: PropTypes.any,
};

export const useScore = () => {
  const context = useContext(ScoreContext);
  if (!context) {
    throw new Error("useScore must be used within a ScoreProvider");
  }
  return context;
};
