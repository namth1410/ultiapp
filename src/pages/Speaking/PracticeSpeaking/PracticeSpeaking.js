import { ReactComponent as ListenSvg } from "assets/img/listen.svg";
import { ReactComponent as MicrophoneSvg } from "assets/img/microphone.svg";
import { ReactComponent as PlaySvg } from "assets/img/play.svg";
import { collection, getDocs, query, where } from "firebase/firestore";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { firestore } from "../../../firebase";
import styles from "./PracticeSpeaking.module.css";

function PracticeSpeaking() {
  const [audio] = useState(new Audio());
  const topic = window.location.pathname.split("/")[3];
  const recognition = new window.webkitSpeechRecognition();

  let mediaRecorder;
  let chunks = [];

  const [words, setWords] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const listenWord = () => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(selectedWord.term);
    const voices = synth.getVoices();
    u.voice = voices[0];
    synth.speak(u);
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    // Xử lý transcript, có thể hiển thị lên giao diện
  };

  function startRecognition() {
    recognition.start();
  }

  function stopRecognition() {
    recognition.stop();
  }

  function startRecording() {
    if (isRecording) {
      stopRecording();
      return;
    }
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setIsRecording(true);
        setAudioUrl(null);
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/wav" });
          setAudioUrl(URL.createObjectURL(blob));
        };
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  }

  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);
      console.log("da dung");
      chunks = [];
    }
  }

  const handleWordRecordClick = () => {
    if (audioUrl) {
      audio.src = audioUrl;
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  };

  useEffect(() => {
    const getWords = async () => {
      const _topic = topic.charAt(0).toUpperCase() + topic.slice(1);
      const quizzsRef = collection(firestore, "speaking");
      const querySnapshot = await getDocs(
        query(quizzsRef, where("topic", "==", _topic))
      );
      if (querySnapshot.empty) {
        setWords(null);
      } else {
        const a = querySnapshot.docs[0].data();
        setWords(a.words);
        console.log(a.words);
        setSelectedWord(a.words[0]);
      }
    };

    getWords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.left_box}>
        <div className={styles.wordlist}>
          {words?.map((el) => {
            return (
              <WordItem
                key={el}
                item={el}
                selectedWord={selectedWord}
                setSelectedWord={setSelectedWord}
              />
            );
          })}
        </div>
      </div>

      {selectedWord && (
        <div className={styles.right_box}>
          <div className={styles.word_detail_content}>
            <div className={styles.word_detail_content_group}>
              <div className={styles.word_image_preview}>
                <img
                  src="https://img.hoclieu.vn/sgv_TA/lop12_globalsuccess/image/Unit1/jpeg-optimizer_GS-TA12-U1-achievement-2265726729.jpg"
                  alt=""
                />
              </div>

              <div className={styles.word_detail_content_group_right}>
                <div className={styles.word_pronunciation}>
                  <button
                    className={styles.word_pronunciation_audio}
                    onClick={() => {
                      listenWord();
                    }}
                  >
                    <ListenSvg />
                  </button>

                  <div className={styles.word_col}>
                    <div className={styles.word}>{selectedWord.term}</div>
                    <div className={styles.word_phonetics}>
                      {selectedWord.phonetic}
                    </div>
                  </div>

                  <div className={styles.word_type_and_record}>
                    <div className={styles.word_type}>(n)</div>
                    <div
                      className={styles.word_record}
                      onClick={startRecording}
                    >
                      <MicrophoneSvg />
                    </div>
                    {audioUrl && (
                      <div
                        className={styles.word_record}
                        onClick={handleWordRecordClick}
                      >
                        <PlaySvg />
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.word_meaning}>
                  {selectedWord.definition}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const WordItem = ({ item, selectedWord, setSelectedWord }) => {
  const { term, wordType } = item;
  return (
    <button
      style={{ border: "none" }}
      className={`${styles.word_item} ${
        selectedWord?.term === item.term ? styles.selected_word : ""
      }`}
      onClick={() => {
        setSelectedWord(item);
      }}
    >
      <span className={styles.word_label}>{term}</span>
      <span className={styles.word_label_type}>{`(${wordType})`}</span>
    </button>
  );
};

WordItem.propTypes = {
  item: PropTypes.any,
  term: PropTypes.any,
  wordType: PropTypes.any,
  selectedWord: PropTypes.any,
  setSelectedWord: PropTypes.any,
};

export default PracticeSpeaking;
