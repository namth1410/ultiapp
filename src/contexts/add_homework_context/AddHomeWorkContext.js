import PropTypes from "prop-types";
import { createContext, useContext, useMemo, useState, useEffect } from "react";

const AddHomeWorkContext = createContext();

export const AddHomeWorkProvider = ({ children }) => {
  const [correctAnswer, setCorrectAnswer] = useState([]);
  const [countAnswer, setCountAnswer] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    if (!countAnswer) {
      setCountAnswer(null);
      return;
    }
    let modifiedAnswer = [...correctAnswer];
    if (countAnswer > correctAnswer.length) {
      for (let i = correctAnswer.length; i < countAnswer; i++) {
        modifiedAnswer.push(" ");
      }
    }

    setCorrectAnswer(modifiedAnswer.slice(0, countAnswer));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countAnswer]);

  const contextValue = useMemo(
    () => ({
      correctAnswer,
      setCorrectAnswer,
      countAnswer,
      setCountAnswer,
      selectedAnswer,
      setSelectedAnswer,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [correctAnswer, countAnswer, selectedAnswer]
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
