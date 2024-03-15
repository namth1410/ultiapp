import { getDownloadURL, listAll, ref } from "firebase/storage";
import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { storage } from "../../firebase";

const ExamContext = createContext();

export const ExamProvider = ({ children }) => {
  const [audio] = useState(new Audio());

  const [indexQuestion, setIndexQuestion] = useState(0);
  const [answer, setAnswer] = useState(Array.from({ length: 100 }, () => 0));
  const [urlList, setUrlList] = useState();
  const [isReady, setIsReady] = useState(false);

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
    return new Promise((resolve, reject) => {
      console.log(answer);

      resolve(answer); 
    });
  };

  useEffect(() => {
    if (!isReady) return;
    audio.src = urlList?.[indexQuestion];
    audio.play();
    console.log(indexQuestion);
    console.log("thay doi");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexQuestion]);

  useEffect(() => {
    if (!isReady) return;
    console.log("run");
    audio.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  useEffect(() => {
    if (!urlList) return;
    audio.src = urlList[0];
    audio.addEventListener("ended", () => {
      setIndexQuestion((pre) => pre + 1);
    });

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
              console.log("Download URL:", url);
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
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [indexQuestion, isReady, answer]
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
