import { useState, useRef, useEffect } from "react";
import Die from "./components/Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
  const [dice, setDice] = useState(() => generateAllNewDice());
  const [rolls, setRolls] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const buttonRef = useRef(null);

  const allHeld = dice.every((die) => die.isHeld);
  const gameWon = allHeld && dice.every((die) => die.value === dice[0].value);
  const gameLost = allHeld && !gameWon;

  useEffect(() => {
    let interval = null;
    if (isActive && !gameWon && !gameLost) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, gameWon]);

  useEffect(() => {
    if (gameWon || gameLost ) {
      buttonRef.current.focus();
      setIsActive(false);
    }
  }, [gameWon, gameLost]);

  function generateAllNewDice() {
    return new Array(10).fill(0).map(() => ({
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    }));
  }

  function rollDice() {
    if (!gameWon && !gameLost ) {
      setRolls((prevRolls) => prevRolls + 1);
      setDice((oldDice) =>
        oldDice.map((die) =>
          die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6) },
        ),
      );
      if (!isActive) setIsActive(true);
    } else {
      setDice(generateAllNewDice());
      setRolls(0);
      setSeconds(0);
      setIsActive(false);
    }
  }

  function hold(id) {
    if (!gameWon  && !gameLost) {
      if (!isActive) setIsActive(true);
      setDice((oldDice) =>
        oldDice.map((die) =>
          die.id === id ? { ...die, isHeld: !die.isHeld } : die,
        ),
      );
    }
  }

  const diceElements = dice.map((dieObj) => (
    <Die
      key={dieObj.id}
      value={dieObj.value}
      isHeld={dieObj.isHeld}
      hold={() => hold(dieObj.id)}
    />
  ));

  return (
    <main>
      {gameWon && <Confetti recycle={false} numberOfPieces={1000} />}
      <div aria-live="polite" className="sr-only">
        {gameWon && (
          <p>Congratulations! You won! Press "New Game" to start again.</p>
        )}
        {gameLost && (
          <p>Game Over! The dice don't match. Press "New Game" to try again.</p>
        )}
      </div>
      <h1 className="title">Tenzies</h1>

      {gameWon && <p className="win-msg">You Won! 🎉</p>}
      {gameLost && <p className="lose-msg">You Lost! 😞</p>}

      {!gameWon && !gameLost && (
        <p className="instructions">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
      )}

      <div className="stats-container">
        <div className="rolls">Rolls: {rolls}</div>
        <div className="timer">Time: {seconds}s</div>
      </div>

      <div className="dice-container">{diceElements}</div>
      <button ref={buttonRef} className="roll-dice" onClick={rollDice}>
        {gameWon || gameLost ? "New Game" : "Roll"}
      </button>
    </main>
  );
}
