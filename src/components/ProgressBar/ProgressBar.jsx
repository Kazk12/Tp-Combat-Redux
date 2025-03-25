import "./ProgressBar.css";

function ProgressBar({ pv, pvMax, faType, barName, bgType }) {
  // Assurez-vous que la valeur ne dépasse jamais 100% ni n'est inférieure à 0%
  const percentage = Math.max(0, Math.min(100, (pv * 100 / pvMax)));
  
  // Déterminez la couleur de la barre en fonction de la santé
  let barColor = bgType || "bg-primary";
  
  // Ajouter une classe pour l'animation lorsque les PV sont bas
  let extraClass = "";
  if (percentage < 25 && barColor === "bg-danger") {
    extraClass = "low-health-pulse";
  }
  
  return (
    <div className="progress">
      <div 
        className={`progress-bar ${barColor} ${extraClass}`}
        style={{ width: `${percentage}%` }}
        aria-valuenow={pv}
        aria-valuemin="0"
        aria-valuemax={pvMax}
        role="progressbar"
      >
        <span className="icon-text">
          <i className={`fas ${faType}`}></i>
          <strong>{pv}</strong>
          <span className="bar-name">{barName}</span>
          <small className="max-value">{pvMax}</small>
        </span>
      </div>
    </div>
  );
}

export default ProgressBar;