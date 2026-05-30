import { Outlet } from 'react-router-dom';

// Reader layout has NO navbar or footer - full immersion
export default function ReaderLayout() {
    return (
        <div style={{ minHeight: '100vh' }}>
            <Outlet />
        </div>
    );
}
