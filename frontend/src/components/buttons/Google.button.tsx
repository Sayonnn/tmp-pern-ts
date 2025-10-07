import icons from '../../hooks/useIcons';
import type { GoogleButtonProps } from '../../interfaces/formsInterface'

const GoogleButton: React.FC<GoogleButtonProps> = ({
    onClick,
    label = "Login with Google",
    className = "",
  }) => {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition ${className}`}
      >
        {icons.igoogle({ size: 20 })}
        <span>{label}</span>
      </button>
    );
  };
  
  export default GoogleButton;