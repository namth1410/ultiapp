import PropTypes from "prop-types";
import { createContext, useContext, useMemo, useState } from "react";

const TTSContext = createContext();

export const TTSProvider = ({ children }) => {
  const initialState = {
    nameEx: "",
    namePose: "",
    des: "",
  };

  const [ttsItems, setTtsItems] = useState([]);
  const [urlTtsItems, setUrlTtsItems] = useState([]);
  const [runSubmit, setRunSubmit] = useState(false);

  const onAddTtsItem = () => {
    setTtsItems([...ttsItems, { ...initialState, id: ttsItems.length }]);
  };

  const contextValue = useMemo(
    () => ({
      ttsItems,
      setTtsItems,
      onAddTtsItem,
      runSubmit,
      setRunSubmit,
      urlTtsItems,
      setUrlTtsItems,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ttsItems, runSubmit, urlTtsItems]
  );

  return (
    <TTSContext.Provider value={contextValue}>{children}</TTSContext.Provider>
  );
};

TTSProvider.propTypes = {
  children: PropTypes.any,
};

export const useTTS = () => {
  const context = useContext(TTSContext);
  if (!context) {
    throw new Error("useTTS must be used within a TTSProvider");
  }
  return context;
};
