import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { auth, firestore } from "../../../firebase";

const SpellContext = createContext();

export const SpellProvider = ({ children }) => {
  const { quizz_id } = useParams();

  const [dataQuizz, setDataQuizz] = useState(null);
  const [totalQuizzItem, setTotalQuizzItem] = useState(0);
  const [indexQuizzItem, setIndexQuizzItem] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [totalRoundIndex, setTotalRoundIndex] = useState(0);
  const [quizzIndexInCurrentRound, setQuizzIndexInCurrentRound] = useState(0);
  const [countQuizzItemInRound, setCountQuizzItemInRound] = useState(0);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(false);
  const [isEnd, setIsEnd] = useState("");
  const [resultRound, setResultRound] = useState(null);

  const onNextRound = () => {
    setStatus(false);
    setIsEnd("");
    setIndexQuizzItem(indexQuizzItem + 1);
    setRoundIndex(roundIndex + 1);
    setQuizzIndexInCurrentRound(0);
  };

  const onRestart = () => {
    setIndexQuizzItem(0);
    setRoundIndex(0);
    setQuizzIndexInCurrentRound(0);
    setProgress(0);
    setStatus(false);
    setIsEnd("");
  };

  useEffect(() => {
    if (!status) return;
    setTimeout(() => {
      if (indexQuizzItem === dataQuizz.quizz_items.length - 1) {
        setIsEnd("end");
        setStatus(false);
        return;
      }
      if ((indexQuizzItem + 1) % 5 === 0) {
        setIsEnd("end_round");
      } else {
        setIndexQuizzItem(indexQuizzItem + 1);
      }
      setStatus(false);
    }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    const getDataQuizz = async (id) => {
      const quizzRef = doc(firestore, "quizzs", id);
      const docSnapshot = await getDoc(quizzRef);

      if (docSnapshot.exists()) {
        const quizzData = { id: docSnapshot.id, ...docSnapshot.data() };
        setDataQuizz(quizzData);
        setTotalQuizzItem(quizzData.quizz_items.length);
        setTotalRoundIndex(Math.ceil(quizzData.quizz_items.length / 5));
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
      totalQuizzItem,
      roundIndex,
      setRoundIndex,
      progress,
      setProgress,
      totalRoundIndex,
      indexQuizzItem,
      setIndexQuizzItem,
      quizzIndexInCurrentRound,
      setQuizzIndexInCurrentRound,
      countQuizzItemInRound,
      setCountQuizzItemInRound,
      status,
      setStatus,
      isEnd,
      resultRound,
      setResultRound,
      onNextRound,
      onRestart,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataQuizz, totalQuizzItem, roundIndex, progress, indexQuizzItem, status]
  );

  return (
    <SpellContext.Provider value={contextValue}>
      {children}
    </SpellContext.Provider>
  );
};

SpellProvider.propTypes = {
  children: PropTypes.any,
};

export const useSpell = () => {
  const context = useContext(SpellContext);
  if (!context) {
    throw new Error("useSpell must be used within a SpellProvider");
  }
  return context;
};
