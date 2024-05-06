import { ReactComponent as ListenSvg } from "assets/img/listen.svg";
import { ReactComponent as MicrophoneSvg } from "assets/img/microphone.svg";
import { ReactComponent as PlaySvg } from "assets/img/play.svg";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Swal from "sweetalert2";
import { firestore } from "../../../firebase";
import styles from "./PracticeSpeaking.module.scss";

function PracticeSpeaking() {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const topic = window.location.pathname.split("/")[3];
  const topicHardCode = [
    "animals",
    "colors",
    "grocery",
    "hours",
    "jobs",
    "weather",
  ];

  let chunks = [];

  const [words, setWords] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voice, setVoice] = useState(null);

  const handleVoiceChange = (event) => {
    const voices = window.speechSynthesis.getVoices();
    setVoice(voices.find((v) => v.name === event.target.value));
  };

  const listenWord = () => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(selectedWord.term);

    u.voice = voice;
    synth.speak(u);
  };

  function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  function startRecording() {
    if (isRecording) {
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        setIsRecording(false);
        SpeechRecognition.stopListening();
        chunks = [];
        if (transcript.toLowerCase() === selectedWord.term.toLowerCase()) {
          Swal.fire({
            title: "Good job!",
            text: " Bạn đã phát âm đúng rồi!",
            icon: "success",
          });
        }
      }
      return;
    }
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        resetTranscript();
        setIsRecording(true);
        setAudioUrl(null);
        let _mediaRecorder = new MediaRecorder(stream);
        _mediaRecorder.start();

        _mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        _mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/wav" });
          setAudioUrl(URL.createObjectURL(blob));
          const reader = new FileReader();
          reader.readAsArrayBuffer(blob);

          reader.onloadend = () => {
            const base64String = arrayBufferToBase64(reader.result);
            console.log(base64String); // Đây là chuỗi base64 của âm thanh
            const url =
              "https://wrg7ayuv7i.execute-api.eu-central-1.amazonaws.com/Prod/GetAccuracyFromRecordedAudio";
            const bodyData = {
              base64Audio: base64String,
              language: "en",
              title: "Who's going to pay for all of this?",
            };

            fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "text/plain;charset=UTF-8",
                "X-Api-Key": "rll5QsTiv83nti99BW6uCmvs9BDVxSB39SVFceYb",
              },
              body: JSON.stringify(bodyData),
            })
              .then((response) => response.json())
              .then((data) => {
                // Xử lý kết quả trả về
                console.log(data);
              })
              .catch((error) => {
                // Xử lý lỗi
                console.error(error);
              });
          };
        };
        setMediaRecorder(_mediaRecorder);
        SpeechRecognition.startListening({ continuous: true });
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
        Swal.fire({
          icon: "error",
          title: "Không tìm thấy mic",
        });
      });
  }

  useEffect(() => {
    setAudioUrl(null);
    setIsRecording(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWord]);

  useEffect(() => {
    return () => {
      if (mediaRecorder?.stream) {
        mediaRecorder.stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [mediaRecorder]);

  useEffect(() => {
    const getWords = async () => {
      let querySnapshot = null;
      if (!topicHardCode.includes(topic)) {
        querySnapshot = await getDoc(doc(firestore, "speaking", topic));
        if (querySnapshot.exists()) {
          const collection = { id: querySnapshot.id, ...querySnapshot.data() };
          setWords(collection.words);
          setSelectedWord(collection.words[0]);
        }
      } else {
        let _topic = topic.charAt(0).toUpperCase() + topic.slice(1);

        const quizzsRef = collection(firestore, "speaking");
        querySnapshot = await getDocs(
          query(quizzsRef, where("topic", "==", _topic))
        );
        if (querySnapshot.empty) {
          setWords(null);
        } else {
          const a = querySnapshot.docs[0].data();
          setWords(a.words);
          setSelectedWord(a.words[0]);
        }
      }
    };

    getWords();

    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    setVoice(voices[0]);

    return () => {
      synth.cancel();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.left_box}>
        <div className={styles.wordlist}>
          {words?.map((el) => {
            return (
              <WordItem
                key={el.term}
                item={el}
                selectedWord={selectedWord}
                setSelectedWord={setSelectedWord}
                resetTranscript={resetTranscript}
                setAudioUrl={setAudioUrl}
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
                  src={
                    selectedWord.image ||
                    "https://img.hoclieu.vn/sgv_TA/lop12_globalsuccess/image/Unit1/jpeg-optimizer_GS-TA12-U1-achievement-2265726729.jpg"
                  }
                  alt=""
                  style={{
                    imageRendering: "auto",
                  }}
                />
              </div>

              <div className={`${styles.word_detail_content_group_right}`}>
                <div className={styles.word_pronunciation}>
                  <button
                    className={styles.word_pronunciation_audio}
                    onClick={() => {
                      listenWord();
                    }}
                  >
                    <ListenSvg className={styles.listen_icon} />
                  </button>

                  <div className={styles.word_col}>
                    <div className={styles.word}>{selectedWord.term}</div>
                    <div className={styles.word_phonetics}>
                      {selectedWord.phonetic}
                    </div>
                  </div>

                  <div className={styles.word_type_and_record}>
                    <div className={styles.word_type}>(n)</div>
                    <button
                      className={`${styles.word_record} ${
                        isRecording ? styles.listening_playing : ""
                      }`}
                      onClick={startRecording}
                    >
                      <MicrophoneSvg className={styles.micro_icon} />
                    </button>
                    {audioUrl && (
                      <div className={styles.word_record}>
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

            <div>
              <div style={{ marginTop: "20px" }}>
                <span
                  style={{
                    color: "var(--text-color-primary)",
                    marginRight: "10px",
                  }}
                >
                  Giọng đọc
                </span>
                <select
                  className={styles.select}
                  style={{
                    padding: "10px",
                    borderRadius: "4px",
                    fontFamily: "Gilroy",
                  }}
                  value={voice?.name}
                  onChange={handleVoiceChange}
                >
                  {window.speechSynthesis.getVoices().map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p>{transcript}</p>

            {audioUrl && (
              <audio controls className={styles.audio}>
                <source src={audioUrl} type="audio/wav"></source>
              </audio>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const WordItem = ({
  item,
  selectedWord,
  setSelectedWord,
  resetTranscript,
  setAudioUrl,
}) => {
  const { term, wordType } = item;
  return (
    <button
      style={{ border: "none" }}
      className={`${styles.word_item} ${
        selectedWord?.term === item.term ? styles.selected_word : ""
      }`}
      onClick={() => {
        if (item.term === selectedWord?.term) return;
        setSelectedWord(item);
        resetTranscript();
        setAudioUrl(null);
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
  resetTranscript: PropTypes.any,
  setAudioUrl: PropTypes.any,
};

export default PracticeSpeaking;
