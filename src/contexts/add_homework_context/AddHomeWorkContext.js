import PropTypes from "prop-types";
import { createContext, useContext, useMemo, useState, useEffect } from "react";

const AddHomeWorkContext = createContext();

export const AddHomeWorkProvider = ({ children }) => {
  const [answer, setAnswer] = useState("");
  const [countAnswer, setCountAnswer] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    if (!countAnswer) {
      setCountAnswer(null);
      return;
    }
    let modifiedAnswer = [...answer];
    if (countAnswer > answer.length) {
      for (let i = answer.length; i < countAnswer; i++) {
        modifiedAnswer.push("");
      }
    }

    setAnswer(modifiedAnswer.slice(0, countAnswer));
  }, [countAnswer]);

  const contextValue = useMemo(
    () => ({
      answer,
      setAnswer,
      countAnswer,
      setCountAnswer,
      selectedAnswer,
      setSelectedAnswer,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [answer, countAnswer, selectedAnswer]
  );

  return (
    <AddHomeWorkContext.Provider value={contextValue}>
      {children}
    </AddHomeWorkContext.Provider>
  );
};

AddHomeWorkProvider.propTypes = {
  children: PropTypes.any,
};

export const useAddHomeWork = () => {
  const context = useContext(AddHomeWorkContext);
  if (!context) {
    throw new Error("useAddHomeWork must be used within a AddHomeWorkProvider");
  }
  return context;
};
