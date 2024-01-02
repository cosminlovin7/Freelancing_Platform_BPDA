import "./LoadingSpinner.css";

interface LoadingSpinnerProps {
    style?: React.CSSProperties;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({style}) => {
    return (
        <div className="spinner-container" style={{...style}}>
            <div className="loading-spinner">
            </div>
        </div>
    );
}