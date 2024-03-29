import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { auth, firestore } from "../../firebase";
import { CardArray } from "./fake_db";

const initialState = {
  cards: CardArray,
  setCards: () => {},
  startGame: () => {},
  turn: 0,
  handleCardItemClick: () => {},
  disabledCards: false,
  checkWin: () => false,
};

const MemoryContext = createContext(initialState);

const MemoryProvider = ({ children }) => {
  const { quizz_id } = useParams();
  const [cards, setCards] = useState(initialState.cards);
  const [turn, setTurn] = useState(initialState.turn);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabledCards, setDisabledCards] = useState(false);

  const checkWin = () => {
    const isWin = cards.every((card) => card.isMatched);
    return isWin;
  };

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const handleCardItemClick = (card) => {
    if (!disabledCards) {
      setCards((prevCard) =>
        prevCard.map((c) => {
          if (c.id === card.id) {
            card.isFlipped = true;
            return card;
          }
          return c;
        })
      );
    }

    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurn((prevTurn) => prevTurn + 1);
    setDisabledCards(false);
  };

  const startGame = () => {
    const _cards = cards.map((el) => ({
      ...el,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(shuffleArray(_cards));
    setTurn(0);
  };

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabledCards(true);
      if (choiceOne.term === choiceTwo.term) {
        setCards((prevCards) =>
          prevCards.map((card) => {
            if (card.id === choiceOne?.id || card.id === choiceTwo?.id) {
              card.isMatched = true;
              card.isFlipped = true;
            }
            return card;
          })
        );
        resetTurn();
      } else {
        setTimeout(() => {
          setCards((prevCard) => {
            return prevCard.map((card) => {
              if (!card.isMatched) {
                return { ...card, isFlipped: false };
              }
              return card;
            });
          });
          resetTurn();
        }, 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  useEffect(() => {
    const getDataQuizz = async (id) => {
      const quizzRef = doc(firestore, "quizzs", id);
      const docSnapshot = await getDoc(quizzRef);

      if (docSnapshot.exists()) {
        const quizzData = { id: docSnapshot.id, ...docSnapshot.data() };
        const shuffledItems = quizzData.quizz_items
          .sort(() => Math.random() - 0.5)
          .slice(0, 6);
        const _data1 = shuffledItems.map((el, index) => ({
          ...el,
          isFlipped: false,
          isMatched: false,
          type: "term",
          id: index,
        }));
        const _data2 = shuffledItems.map((el, index) => ({
          ...el,
          isFlipped: false,
          isMatched: false,
          type: "definition",
          id: index + shuffledItems.length,
        }));
        const _data = [..._data1, ..._data2];
        setCards(shuffleArray(_data));
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

  const value = useMemo(
    () => ({
      cards,
      setCards,
      startGame,
      turn,
      handleCardItemClick,
      disabledCards,
      checkWin,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cards, turn, disabledCards]
  );

  return (
    <MemoryContext.Provider value={value}>{children}</MemoryContext.Provider>
  );
};

const useMemoryCards = () => {
  const context = useContext(MemoryContext);
  if (context === undefined) {
    throw new Error("useMemoryCards must be used within a MemoryProvider");
  }
  return context;
};

MemoryProvider.propTypes = {
  children: PropTypes.any,
};

export { MemoryContext, MemoryProvider, useMemoryCards };
