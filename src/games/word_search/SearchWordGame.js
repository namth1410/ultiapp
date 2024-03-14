import { Radio } from "antd";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Layer, Rect, Stage, Text } from "react-konva";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { auth, firestore } from "../../firebase";

const gridSize = 16;

const SearchWordGame = () => {
  const { quizz_id } = useParams();

  const navigate = useNavigate();

  const levelRef = useRef(null);

  const [words, setWords] = useState([]);
  const [quizzItems, setQuizzItems] = useState([]);
  const [dataQuizz, setDataQuizz] = useState(null);
  const [grid, setGrid] = useState([]);
  const [gridDraw, setGridDraw] = useState(null);
  const [gridOrigin, setGridOrigin] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [foundWordsV1, setFoundWordsV1] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  // const [gridSize, setGridSize] = useState(8);

  const selectWordFromQuizz = () => {
    const a = dataQuizz.quizz_items;
    const cloneArr = [...a];
    const selectedWords = [];

    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * cloneArr.length);
      selectedWords.push(cloneArr.splice(randomIndex, 1)[0]);
    }

    return selectedWords;
  };

  // Kiểm tra xem một từ có thể được đặt vào ma trận không
  const canPlaceWord = (grid, word, startX, startY, direction) => {
    const wordLength = word.length;
    if (direction === "horizontal" && startX + wordLength > gridSize) {
      return false;
    }
    if (direction === "vertical" && startY + wordLength > gridSize) {
      return false;
    }
    for (let i = 0; i < wordLength; i++) {
      const x = direction === "horizontal" ? startX + i : startX;
      const y = direction === "horizontal" ? startY : startY + i;
      if (grid[y][x] !== "" && grid[y][x] !== word[i]) {
        return false;
      }
    }
    return true;
  };

  // Đặt một từ vào ma trận
  const placeWord = (grid, word, startX, startY, direction) => {
    const wordLength = word.length;
    for (let i = 0; i < wordLength; i++) {
      const x = direction === "horizontal" ? startX + i : startX;
      const y = direction === "horizontal" ? startY : startY + i;
      if (grid[y][x] !== "" && grid[y][x] !== word[i]) {
        throw new Error("Overlapping words detected!");
      }
      grid[y][x] = word[i];
    }
  };

  // Điền các ô trống trong ma trận với các ký tự ngẫu nhiên
  const fillEmptyCells = (grid) => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (grid[i][j] === "") {
          const randomIndex = Math.floor(Math.random() * alphabet.length);
          grid[i][j] = alphabet[randomIndex];
        }
      }
    }
  };

  // Tạo một ma trận kích thước gridSize x gridSize với các ô trống
  const createEmptyGrid = () => {
    const grid = [];
    for (let i = 0; i < gridSize; i++) {
      grid.push(Array(gridSize).fill(""));
    }
    return grid;
  };

  // Tạo ma trận với các từ từ danh sách words
  const generateGrid = () => {
    const grid = createEmptyGrid();

    const _quizzItems = selectWordFromQuizz();
    const _words = _quizzItems.map((el) => el.term.toUpperCase());
    setWords(_words);
    setQuizzItems(_quizzItems);
    for (const word of _words) {
      let placed = false;
      while (!placed) {
        const direction = Math.random() < 0.5 ? "horizontal" : "vertical";
        let startX, startY;
        if (direction === "horizontal") {
          startX = Math.floor(Math.random() * (gridSize - word.length + 1));
          startY = Math.floor(Math.random() * gridSize);
        } else {
          startX = Math.floor(Math.random() * gridSize);
          startY = Math.floor(Math.random() * (gridSize - word.length + 1));
        }

        if (canPlaceWord(grid, word, startX, startY, direction)) {
          placeWord(grid, word, startX, startY, direction);
          placed = true;
        }
      }
    }
    fillEmptyCells(grid);

    return grid;
  };

  const handleCellMouseDown = (x, y) => {
    setIsDrawing(true);
    setStartPos({ x, y });
  };

  const handleCellMouseEnter = (x, y) => {
    if (isDrawing) {
      drawLine(startPos.x, startPos.y, x, y);
    }
  };

  const handleCellMouseUp = () => {
    setIsDrawing(false);
    setGrid(gridOrigin);
    setGridDraw(null);
    setStartPos({ x: 0, y: 0 });
    const trueCoordinates = getTrueCoordinates();
    const isStraight = isStraightLine(trueCoordinates);
    if (isStraight) {
      const word = getWordFromLine(trueCoordinates);
      setFoundWordsV1((pre) => [...pre, word]);
      if (checkWordInWords(word)) {
        let _foundWords = Array.from(foundWords, (row) => [...row]);
        _foundWords.forEach((row, i) => {
          row.forEach((el, j) => {
            if (gridDraw[i][j] === true) {
              _foundWords[i][j] = true;
            }
          });
        });
        setFoundWords(_foundWords);
      } else {
        console.log("Word not found in words list");
      }
    } else {
      console.log("Not a straight line");
    }
  };

  const getTrueCoordinates = () => {
    const trueCoordinates = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (gridDraw?.[y][x] === true) {
          trueCoordinates.push({ x, y });
        }
      }
    }
    return trueCoordinates;
  };

  const isStraightLine = (coordinates) => {
    if (coordinates.length < 2) {
      return false;
    }

    const [startX, startY] = [coordinates[0].x, coordinates[0].y];
    const [endX, endY] = [
      coordinates[coordinates.length - 1].x,
      coordinates[coordinates.length - 1].y,
    ];

    const dx = Math.abs(endX - startX);
    const dy = Math.abs(endY - startY);

    for (let i = 1; i < coordinates.length - 1; i++) {
      const [x, y] = [coordinates[i].x, coordinates[i].y];
      if (
        Math.abs(endX - x) * dy !== Math.abs(endY - y) * dx || // Kiểm tra đường thẳng chéo
        (dx === 0 && x !== startX) || // Kiểm tra đường thẳng dọc
        (dy === 0 && y !== startY) || // Kiểm tra đường thẳng ngang
        (dx !== 0 && dy !== 0 && Math.abs(endX - x) !== Math.abs(endY - y))
      ) {
        // Kiểm tra đường thẳng chéo khác
        return false;
      }
    }

    return true;
  };

  const getWordFromLine = (coordinates) => {
    const directions = [
      { dx: 1, dy: 0 }, // Ngang
      { dx: 0, dy: 1 }, // Dọc
      { dx: 1, dy: 1 }, // Chéo xuôi
      { dx: 1, dy: -1 }, // Chéo ngược
    ];

    const [startX, startY] = [coordinates[0].x, coordinates[0].y];
    const [endX, endY] = [
      coordinates[coordinates.length - 1].x,
      coordinates[coordinates.length - 1].y,
    ];

    // Xác định hướng của đường thẳng
    let direction;
    if (startX === endX) {
      direction = 1; // Dọc
    } else if (startY === endY) {
      direction = 0; // Ngang
    } else if (Math.abs(endX - startX) === Math.abs(endY - startY)) {
      direction = startX < endX ? 2 : 3; // Chéo xuôi hoặc chéo ngược
    }

    // Lấy ra các chữ cái từ các ô trên đường thẳng
    let word = "";
    let x = startX;
    let y = startY;
    while (x !== endX || y !== endY) {
      word += grid[y][x];
      x += directions[direction].dx;
      y += directions[direction].dy;
    }
    word += grid[endY][endX]; // Thêm chữ cái cuối cùng
    return word;
  };

  const checkWordInWords = (word) => {
    return !!(
      words.includes(word) || words.includes(word.split("").reverse().join(""))
    );
  };

  const drawLine = (x0, y0, x1, y1) => {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    let newGrid = Array.from(gridOrigin, (row) => [...row]);
    while (true) {
      newGrid[y0][x0] = true;
      setGridDraw(newGrid);

      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
  };

  const checkWin = () => {
    if (foundWordsV1.length === 0) return;
    if (words.every((word) => foundWordsV1.includes(word))) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        background: "#000",
        color: "#fff",
        title: "Chúc mừng bạn!",
        text: `Bạn đã mất  để hoàn thành trò chơi!`,
        icon: "success",
        confirmButtonText: "Chơi lại",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        preConfirm: () => {
          startGame();
        },
      });
    }
  };

  const startGame = () => {
    const _grid = generateGrid();
    setGrid(_grid);
    setGridOrigin(Array.from(_grid, (row) => [...row]));
    setFoundWords(Array.from(_grid, (row) => [...row]));
    setFoundWordsV1([]);
  };

  checkWin();

  useEffect(() => {
    if (!dataQuizz) return;
    startGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridSize, dataQuizz]);

  useEffect(() => {
    const getDataQuizz = async (id) => {
      const quizzRef = doc(firestore, "quizzs", id);
      const docSnapshot = await getDoc(quizzRef);

      if (docSnapshot.exists()) {
        const quizzData = { id: docSnapshot.id, ...docSnapshot.data() };
        setDataQuizz(quizzData);
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

  return (
    <div
      style={{
        width: "100%",
        height: "-webkit-fill-available",
        backgroundColor: "#242424",
        textAlign: "center",
        boxSizing: "border-box",
      }}
      className="game_memory"
    >
      <div
        style={{
          color: "#ffffffde",
          fontSize: "3.2em",
          paddingTop: "20px",
          fontFamily: "Rocher",
          fontPalette: "--Purples",
        }}
      >
        <button
          style={{
            float: "left",
            marginLeft: "20px",
            fontSize: "0.9em",
            padding: "0.3em 0.6em",
          }}
          onClick={() => {
            navigate(-1);
          }}
        >
          <span>🔙</span>
        </button>
        {""}
        Word Seach Game
      </div>
      <button
        onClick={() => {
          startGame();
        }}
      >
        Chơi mới
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "-webkit-fill-available",
          border: "15px solid BURLYWOOD",
          borderRadius: "16px",
          boxShadow: "rgb(255 255 255 / 24%) 8px 8px 8px",
          justifyContent: "space-around",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "normal",
            gap: "20px",
          }}
        >
          {quizzItems.map((el, index) => {
            return index < 3 ? (
              <Definition
                definition={el.definition}
                isFounded={foundWordsV1.includes(
                  quizzItems[index].term.toUpperCase()
                )}
              />
            ) : (
              <></>
            );
          })}
        </div>

        <Stage
          width={gridSize * 40}
          height={gridSize * 40}
          onMouseUp={handleCellMouseUp}
        >
          {grid.length !== 0 && (
            <Layer>
              {grid.map((row, i) =>
                row.map((char, j) => {
                  const x = j * 40;
                  const y = i * 40;
                  return (
                    <React.Fragment key={`${i}-${j}`}>
                      <Rect
                        x={x}
                        y={y}
                        width={40}
                        height={40}
                        fill={
                          gridDraw?.[i][j] === true
                            ? "#80c4ff"
                            : foundWords[i][j] === true
                            ? "#2ec163"
                            : "white"
                        }
                        stroke="black"
                        onMouseDown={() => handleCellMouseDown(j, i)}
                        onMouseEnter={() => handleCellMouseEnter(j, i)}
                        onMouseUp={handleCellMouseUp}
                      />
                      <Text x={x + 10} y={y + 10} text={char} fontSize={18} />
                    </React.Fragment>
                  );
                })
              )}
            </Layer>
          )}
        </Stage>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "normal",
            gap: "20px",
          }}
        >
          {quizzItems.map((el, index) => {
            return index > 2 ? (
              <Definition
                definition={el.definition}
                isFounded={foundWordsV1.includes(
                  quizzItems[index].term.toUpperCase()
                )}
              />
            ) : (
              <></>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Definition = ({ definition, isFounded }) => {
  return (
    <div
      style={{
        color: "#fff",
        fontSize: "26px",
        boxShadow: "rgb(38, 57, 77) 0px 20px 30px -10px",
        border: "1px solid rgb(38, 57, 77)",
        borderRadius: "16px",
        padding: "15px 20px",
        backgroundColor: isFounded ? "#52ff94" : "unset",
        transition: "background-color 0.5s",
      }}
    >
      {definition}
    </div>
  );
};

export default SearchWordGame;
