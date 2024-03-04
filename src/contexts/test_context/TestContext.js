import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { auth, firestore } from "../../firebase";

const TestContext = createContext();

export const MODE = {
  MULTIPLE_CHOICE: "MULTIPLE_CHOICE",
  ESSAY: "ESSAY",
  MIXTURE: "MIXTURE",
};

export const TestProvider = ({ children }) => {
  const { quizz_id } = useParams();

  const [dataQuizzInitial, setDataQuizzInitial] = useState(null);
  const [dataQuizz, setDataQuizz] = useState(null);

  const [answer, setAnswer] = useState([]);
  const [correctAnswerInitial, setCorrectAnswerInitial] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState([]);
  const [keys, setKeys] = useState([]);
  const [setting, setSetting] = useState(null);
  const [isSubmited, setIsSubmited] = useState(false);
  const [result, setResult] = useState(0);
  const [indexShuffleArray, setIndexShuffleArray] = useState([]);

  useEffect(() => {
    if (isSubmited) {
      let count = 0;
      for (let i = 0; i < answer.length; i++) {
        if (answer[i] === correctAnswer[i]) {
          count++;
        }
      }
      setResult(count);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmited]);

  useEffect(() => {
    if (!setting || !dataQuizz) return;
    if (setting.isShuffle && indexShuffleArray.length === 0) {
      const generateArray = (n) => {
        const array = Array.from({ length: n }, (_, index) => index);
        return array;
      };

      const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };
      const newArray = generateArray(setting.quantityQuestion);
      const shuffledArray = shuffleArray(newArray);
      setIndexShuffleArray(shuffledArray);

      const _data = dataQuizzInitial.quizz_items.map(
        (_, index) => dataQuizzInitial.quizz_items[shuffledArray[index]]
      );
      const _correctAns = correctAnswerInitial.map(
        (_, index) => correctAnswerInitial[index]
      );
      const a = { ...dataQuizzInitial, quizz_items: _data };
      setDataQuizz(a);
      setCorrectAnswer(_correctAns);
    }
  }, [dataQuizz, setting]);

  useEffect(() => {
    if (correctAnswer.length === 0) return;
    const create4Keys = (key) => {
      if (key >= setting.quantityQuestion) return;
      const keyIndex = correctAnswer[key];

      const availableIndexes = dataQuizz.quizz_items
        .map((item, index) => {
          if (index !== key && index < setting.quantityQuestion) return index;
          return -1;
        })
        .filter((index) => index !== -1);

      const randomIndexes = [];
      for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * availableIndexes.length);
        randomIndexes.push(availableIndexes[randomIndex]);
        availableIndexes.splice(randomIndex, 1);
      }

      const result = [];
      for (let i = 0; i < 4; i++) {
        if (i === keyIndex) {
          result.push(dataQuizz.quizz_items[key].term);
        } else {
          result.push(dataQuizz.quizz_items[randomIndexes.pop()].term);
        }
      }
      return result;
    };
    const _keys = dataQuizz?.quizz_items.map((item, index) =>
      create4Keys(index)
    );
    setKeys(_keys ?? []);
  }, [correctAnswer]);

  useEffect(() => {
    const getDataQuizz = async (id) => {
      const quizzRef = doc(firestore, "quizzs", id);
      const docSnapshot = await getDoc(quizzRef);

      if (docSnapshot.exists()) {
        const quizzData = { id: docSnapshot.id, ...docSnapshot.data() };
        setDataQuizz(quizzData);
        setDataQuizzInitial(quizzData);

        setAnswer(quizzData.quizz_items.map(() => -1));

        const _correctAnswer = quizzData.quizz_items.map(() =>
          Math.floor(Math.random() * 4)
        );
        setCorrectAnswer(_correctAnswer);
        setCorrectAnswerInitial(_correctAnswer);
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

    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get("mode");
    const quantityQuestion = parseInt(urlParams.get("quantityQuestion")) || 5;
    const isShuffle = urlParams.get("isShuffle") === "true";

    setSetting((prevSetting) => ({
      ...prevSetting,
      mode,
      quantityQuestion,
      isShuffle,
    }));

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue = useMemo(
    () => ({
      dataQuizz,
      setDataQuizz,
      dataQuizzInitial,
      setDataQuizzInitial,
      answer,
      setAnswer,
      correctAnswer,
      setCorrectAnswer,
      keys,
      isSubmited,
      setIsSubmited,
      result,
      setResult,
      setting,
      setSetting,
      indexShuffleArray,
      setIndexShuffleArray,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      dataQuizz,
      answer,
      correctAnswer,
      keys,
      isSubmited,
      result,
      setting,
      indexShuffleArray,
      dataQuizzInitial,
    ]
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
