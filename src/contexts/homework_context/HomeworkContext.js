import PropTypes from "prop-types";
import { createContext, useContext, useMemo, useState } from "react";

const HomeworkContext = createContext();

export const HomeworkProvider = ({ children }) => {
  const [selectedHomework, setSelectedHomework] = useState(null);

  const contextValue = useMemo(
    () => ({
      selectedHomework,
      setSelectedHomework,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedHomework]
  );

  return (
    <HomeworkContext.Provider value={contextValue}>
      {children}
    </HomeworkContext.Provider>
  );
};

HomeworkProvider.propTypes = {
  children: PropTypes.any,
};

export const useHomework = () => {
  const context = useContext(HomeworkContext);
  if (!context) {
    throw new Error("useHomework must be used within a HomeworkProvider");
  }
  return context;
};
