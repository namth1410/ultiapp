import { collection, getDocs, query, where } from "firebase/firestore";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { firestore, storage } from "../../firebase";

const ExamContext = createContext();

export const ExamProvider = ({ children }) => {
  const [audio] = useState(new Audio());

  const [indexQuestion, setIndexQuestion] = useState(0);
  const [answer, setAnswer] = useState(Array.from({ length: 100 }, () => 0));
  const [urlList, setUrlList] = useState();
  const [isReady, setIsReady] = useState(false);
  const [dataExam, setDataExam] = useState(null);

  const onChooseAnswer = (indexQues, value) => {
    console.log(indexQues, value);
    let _answer = [...answer];
    _answer[indexQues] = value;
    setAnswer(_answer);
  };

  function extractNumberFromUrl(url) {
    const regex = /zenlish-(\d+)(?:-(\d+))?.mp3/;
    const match = url.match(regex);
    if (match) {
      if (match[2]) {
        return parseInt(match[2]);
      } else {
        return parseInt(match[1]);
      }
    }
    return -1;
  }

  const onSubmit = () => {
    audio.pause();
    audio.removeEventListener("ended", endedEventHandler);

    return new Promise((resolve, reject) => {
      console.log(answer);
      let countCorrect = 0;
      let countIncorrect = 0;
      let countCorrectPart1 = 0;
      let countCorrectPart2 = 0;
      let countCorrectPart3 = 0;
      let countCorrectPart4 = 0;
      let _answer = [answer];

      for (let i = 0; i < _answer.length; i++) {
        if (_answer[i] === 1) {
          _answer[i] = "A";
        } else if (_answer[i] === 2) {
          _answer[i] = "B";
        } else if (_answer[i] === 3) {
          _answer[i] = "C";
        } else {
          _answer[i] = "D";
        }
      }

      for (let i = 0; i < answer.length; i++) {
        if (_answer[i] === dataExam.correct_answer[i]) {
          countCorrect++;

          if (i < 6) {
            countCorrectPart1++;
          } else if (i < 31) {
            countCorrectPart2++;
          } else if (i < 70) {
            countCorrectPart3++;
          } else {
            countCorrectPart4++;
          }
        } else {
          countIncorrect++;
        }
      }

      const result = {
        countCorrect: countCorrect,
        countIncorrect: countIncorrect,
        countCorrectPart1: countCorrectPart1,
        countCorrectPart2: countCorrectPart2,
        countCorrectPart3: countCorrectPart3,
        countCorrectPart4: countCorrectPart4,
      };

      resolve(result);
    });
  };

  const endedEventHandler = () => {
    if (indexQuestion < 31) {
      setIndexQuestion((pre) => pre + 1);
    } else {
      setIndexQuestion((pre) => pre + 3);
    }
  };

  useEffect(() => {
    if (!isReady) return;

    audio.src = urlList?.[indexQuestion];
    if (indexQuestion >= 31) {
      audio.src = urlList?.[Math.floor(31 + (indexQuestion - 31) / 3)];
    }
    audio.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexQuestion]);

  useEffect(() => {
    if (!isReady) return;
    audio.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  useEffect(() => {
    if (!urlList) return;
    audio.src = urlList[0];
    audio.addEventListener("ended", endedEventHandler);

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlList]);

  useEffect(() => {
    let downloadedCount = 0;
    let _urlList = [];
    const storageRef = ref(storage, "ETS2024/Test1");

    listAll(storageRef)
      .then((result) => {
        const totalItems = result.items.length;

        result.items.forEach((itemRef) => {
          getDownloadURL(itemRef)
            .then((url) => {
              _urlList.push(url);
              downloadedCount++;
              if (downloadedCount === totalItems) {
                // Sắp xếp danh sách URL
                _urlList.sort((url1, url2) => {
                  const number1 = extractNumberFromUrl(url1);
                  const number2 = extractNumberFromUrl(url2);
                  return number1 - number2;
                });
                setUrlList(_urlList);
                console.log("Sorted URL List:", _urlList);
              }
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
            });
        });
      })
      .catch((error) => {
        console.error("Error listing files:", error);
      });

    const getDataExam = async () => {
      const QuerySnapshot = await getDocs(
        query(
          collection(firestore, "testonline"),
          where("name", "==", "TEST1 - ETS2024")
        )
      );

      if (QuerySnapshot.empty) {
        setDataExam(null);
        return;
      }
      const records = [];

      QuerySnapshot.forEach((doc) => {
        records.push({ ...doc.data(), id: doc.id });
      });
      setDataExam(records[0]);
    };
    getDataExam();
  }, []);

  const contextValue = useMemo(
    () => ({
      indexQuestion,
      setIndexQuestion,
      answer,
      setAnswer,
      onChooseAnswer,
      isReady,
      setIsReady,
      onSubmit,
      dataExam,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [indexQuestion, isReady, answer, dataExam]
  );

  return (
    <ExamContext.Provider value={contextValue}>{children}</ExamContext.Provider>
  );
};

ExamProvider.propTypes = {
  children: PropTypes.any,
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error("useExam must be used within a ExamProvider");
  }
  return context;
};
