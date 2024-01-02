import loadinggif from "images/loading.gif";

interface LoadingSpinnerProps {
    style?: React.CSSProperties;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({style}) => (
    <img
        src={loadinggif} // Replace with the path or URL to your loading spinner GIF
        alt="Loading..."
        style={{...style}}
    />
);