import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, firestore } from "../../firebase";
import { useParams } from "react-router-dom";

const TestContext = createContext();

export const TestProvider = ({ children }) => {
  const { quizz_id } = useParams();

  const [dataQuizz, setDataQuizz] = useState(null);

  const [answer, setAnswer] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState([]);
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    const getDataQuizz = async (id) => {
      const quizzRef = doc(firestore, "quizzs", id);
      const docSnapshot = await getDoc(quizzRef);

      if (docSnapshot.exists()) {
        const quizzData = { id: docSnapshot.id, ...docSnapshot.data() };
        setDataQuizz(quizzData);
        console.log(quizzData);

        setAnswer(quizzData.quizz_items.map(() => -1));

        const _correctAnswer = quizzData.quizz_items.map(() =>
          Math.floor(Math.random() * 4)
        );
        setCorrectAnswer(_correctAnswer);

        const create4Keys = (key) => {
          const keyIndex = _correctAnswer[key];

          const availableIndexes = quizzData.quizz_items
            .filter((item, index) => index !== key && index !== keyIndex)
            .map((item, index) => index);

          const randomIndexes = [];
          for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(
              Math.random() * availableIndexes.length
            );
            randomIndexes.push(availableIndexes[randomIndex]);
            //   availableIndexes.splice(randomIndex, 1);
          }

          const result = [];
          for (let i = 0; i < 4; i++) {
            if (i === keyIndex) {
              result.push(quizzData.quizz_items[key].term);
            } else {
              result.push(quizzData.quizz_items[randomIndexes.pop()].term);
            }
          }
          return result;
        };
        const _keys = quizzData?.quizz_items.map((item, index) =>
          create4Keys(index)
        );
        setKeys(_keys ?? []);
      } else {
        console.log("Không tìm thấy quizz với id đã cho");
      }
    };
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in:", user);
        getDataQuizz(quizz_id);
      } else {
        console.log("User is signed out");
      }
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue = useMemo(
    () => ({
      dataQuizz,
      setDataQuizz,
      answer,
      setAnswer,
      correctAnswer,
      setCorrectAnswer,
      keys,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataQuizz, answer, correctAnswer, keys]
  );

  return (
    <TestContext.Provider value={contextValue}>{children}</TestContext.Provider>
  );
};

TestProvider.propTypes = {
  children: PropTypes.any,
};

export const useTest = () => {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error("useTest must be used within a TestProvider");
  }
  return context;
};