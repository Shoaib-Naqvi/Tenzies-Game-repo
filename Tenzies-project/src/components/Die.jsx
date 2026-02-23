export default function Die(props) {
  const styles = {
    backgroundColor: props.isHeld ? "#59E391" : "white",
  };

  const pips = Array.from({ length: props.value }, (_, i) => (
    <span key={i} className="pip" data-value={props.value}></span>
  ));

  return (
    <button
      style={styles}
      onClick={props.hold}
      aria-pressed={props.isHeld}
      aria-label={`Die with value ${props.value}, 
            ${props.isHeld ? "held" : "not held"}`}
      className={props.isHeld ? "held" : ""}
    >
      <div className="die-pips">{pips}</div>
    </button>
  );
}
