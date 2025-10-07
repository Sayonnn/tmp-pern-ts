import styles from "./css/spinner.module.css";
import sayonph from "../../assets/sayonph.png";

function Spinner({
  letters = ["S", "A", "Y", "O", "N", "P", "H"],
}: {
  letters?: string[];
}) {

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen space-y-4">
      {/* Logo with bounce */}
      <img
        src={sayonph}
        alt="Logo"
        className={`w-16 h-12 ${styles.logoBounce}`}
        draggable={false}
      />

      {/* Letters row */}
      <div className="flex space-x-1 text-2xl font-bold">
        {letters.map((letter, i) => (
          <span
            key={i}
            className={styles.sphSpinnerLetter}
            style={{ "--index": i} as React.CSSProperties}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Spinner;
