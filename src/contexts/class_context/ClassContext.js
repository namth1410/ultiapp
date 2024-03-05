import PropTypes from "prop-types";
import { createContext, useContext, useMemo, useState } from "react";

const ClassContext = createContext();

export const ClassProvider = ({ children }) => {
  const [nameClass, setNameClass] = useState("Tên lướp");
  const [classId, setClassId] = useState("MEZOEas2");
  const contextValue = useMemo(
    () => ({
      nameClass,
      setNameClass,
      classId,
      setClassId,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nameClass, classId]
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
