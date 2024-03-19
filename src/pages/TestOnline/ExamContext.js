import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { doc, getDoc } from "firebase/firestore";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { firestore, storage } from "../../firebase";

const ExamContext = createContext();

export const ExamProvider = ({ children }) => {
  let urlParams = new URLSearchParams(window.location.search);
  let parts = urlParams.get("parts")?.split("").map(Number);

  const counts = [0, 6, 31, 70, 100, 130, 146];

  const examId = window.location.pathname.split("/")[2];
  const examName = window.location.pathname.split("/")[3];

  const [audio] = useState(new Audio());

  const [indexQuestion, setIndexQuestion] = useState(0);
  const [answer, setAnswer] = useState(Array.from({ length: 100 }, () => 0));
  const [urlList, setUrlList] = useState();
  const [isReady, setIsReady] = useState(false);
  const [dataExam, setDataExam] = useState(null);
  const [isShowKey, setIsShowKey] = useState(false);
  const [audioSrc, setAudioSrc] = useState(null);

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
      let countCorrect = 0;
      let countIncorrect = 0;
      let countCorrectPart1 = 0;
      let countCorrectPart2 = 0;
      let countCorrectPart3 = 0;
      let countCorrectPart4 = 0;
      let countCorrectPart5 = 0;
      let countCorrectPart6 = 0;
      let countCorrectPart7 = 0;
      let _answer = [...answer];

      for (let i = 0; i < _answer.length; i++) {
        if (_answer[i] === 1) {
          _answer[i] = "A";
        } else if (_answer[i] === 2) {
          _answer[i] = "B";
        } else if (_answer[i] === 3) {
          _answer[i] = "C";
        } else if (_answer[i] === 4) {
          _answer[i] = "D";
        } else {
          _answer[i] = "";
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
          } else if (i < 100) {
            countCorrectPart4++;
          } else if (i < 130) {
            countCorrectPart5++;
          } else if (i < 146) {
            countCorrectPart6++;
          } else {
            countCorrectPart7++;
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
        countCorrectPart5: countCorrectPart5,
        countCorrectPart6: countCorrectPart6,
        countCorrectPart7: countCorrectPart7,
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

  const convertKeyStringToInt = (key) => {
    if (key === "A") {
      return 0;
    } else if (key === "B") {
      return 1;
    } else if (key === "C") {
      return 2;
    } else {
      return 3;
    }
  };

  const checkKey = (value) => {
    if (answer[indexQuestion] === value) {
      if (
        convertKeyStringToInt(dataExam.correct_answer[indexQuestion]) + 1 ===
        value
      ) {
        return <CheckCircleFilled style={{ color: "#00b8ff" }} />;
      } else {
        return <CloseCircleFilled style={{ color: "#ff0000" }} />;
      }
    } else if (
      convertKeyStringToInt(dataExam.correct_answer[indexQuestion]) + 1 ===
      value
    ) {
      return <CheckCircleFilled style={{ color: "#00b8ff" }} />;
    }
    return <></>;
  };

  useEffect(() => {
    if (isShowKey) {
      if (indexQuestion >= 31) {
        setAudioSrc(urlList?.[Math.floor(31 + (indexQuestion - 31) / 3)]);
      } else if (indexQuestion < 31) {
        setAudioSrc(urlList?.[indexQuestion]);
      }
    }
    if (!isReady || isShowKey || indexQuestion > 99) return;

    audio.src = urlList?.[indexQuestion];
    if (indexQuestion >= 31) {
      audio.src = urlList?.[Math.floor(31 + (indexQuestion - 31) / 3)];
    }
    audio.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexQuestion]);

  useEffect(() => {
    if (isShowKey) {
      if (indexQuestion < 6) {
        setAudioSrc(urlList[0]);
      } else if (indexQuestion < 31) {
        setAudioSrc(urlList[6]);
      } else if (indexQuestion < 100) {
        setAudioSrc(urlList[32]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowKey]);

  useEffect(() => {
    if (!isReady) return;
    if (indexQuestion < 100) {
      audio.play();
    }
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
    const storageRef = ref(storage, examName.replace("-", "/"));

    listAll(storageRef)
      .then((result) => {
        const totalItems = result.items.length;

        result.items.forEach((itemRef) => {
          getDownloadURL(itemRef)
            .then((url) => {
              _urlList.push(url);
              downloadedCount++;
              if (downloadedCount === totalItems) {
                _urlList.sort((url1, url2) => {
                  const number1 = extractNumberFromUrl(url1);
                  const number2 = extractNumberFromUrl(url2);
                  return number1 - number2;
                });
                _urlList.sort((a, b) => a.localeCompare(b));

                console.log(_urlList);
                setUrlList(_urlList);
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
      const examRef = doc(firestore, "testonline", examId);
      const docSnapshot = await getDoc(examRef);
      if (docSnapshot.exists()) {
        const examData = { id: docSnapshot.id, ...docSnapshot.data() };
        setDataExam(examData);
        console.log(examData);
      } else {
        setDataExam(null);
      }
    };
    getDataExam();
    parts && setIndexQuestion(counts[parts[0] - 1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      isShowKey,
      setIsShowKey,
      convertKeyStringToInt,
      checkKey,
      urlList,
      audioSrc,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [indexQuestion, isReady, answer, dataExam, isShowKey, audioSrc]
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
