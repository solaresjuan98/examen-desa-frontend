
interface LoaderOverlayProps {
    show: boolean;
}

export const LoaderOverlay = ({ show }: LoaderOverlayProps) => {

    if (!show) return null;

    return (
        <div 
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', zIndex: 1050 }}>
            <div className="spinner-border text-light" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    );
}
