import PropTypes from "prop-types";
import { createContext, useContext, useMemo, useState } from "react";

const CreateSpeakingContext = createContext();

export const CreateSpeakingProvider = ({ children }) => {
  const [selectedQuizzs, setSelectedQuizzs] = useState(null);
  const [current, setCurrent] = useState(0);
  const [isCreateFromMyQuizz, setIsCreateFromMyQuizz] = useState(false);
  const [resultSearchQuizz, setResultSearchQuizz] = useState(null);

  const contextValue = useMemo(
    () => ({
      selectedQuizzs,
      setSelectedQuizzs,
      current,
      setCurrent,
      isCreateFromMyQuizz,
      setIsCreateFromMyQuizz,
      resultSearchQuizz,
      setResultSearchQuizz,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedQuizzs, current, isCreateFromMyQuizz, resultSearchQuizz]
  );

  return (
    <CreateSpeakingContext.Provider value={contextValue}>
      {children}
    </CreateSpeakingContext.Provider>
  );
};

CreateSpeakingProvider.propTypes = {
  children: PropTypes.any,
};

export const useCreateSpeaking = () => {
  const context = useContext(CreateSpeakingContext);
  if (!context) {
    throw new Error(
      "useCreateSpeaking must be used within a CreateSpeakingProvider"
    );
  }
  return context;
};
