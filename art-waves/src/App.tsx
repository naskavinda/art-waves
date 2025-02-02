import { Outlet } from 'react-router'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearCart } from './store/features/cartSlice';
import { clearWishlist } from './store/features/wishlistSlice';
import './App.css'

const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 60 minutes in milliseconds
const ACTIVITY_CHECK_INTERVAL = 60 * 1000; // Check every minute

const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        let activityCheckInterval: NodeJS.Timeout;

        // Function to update last activity timestamp
        const updateLastActivity = () => {
            localStorage.setItem('lastActivityTime', Date.now().toString());
        };

        // Function to check for inactivity
        const checkInactivity = () => {
            const lastActivity = Number(localStorage.getItem('lastActivityTime'));
            const currentTime = Date.now();
            
            if (currentTime - lastActivity >= INACTIVITY_TIMEOUT) {
                // Clear cart and wishlist
                dispatch(clearCart());
                dispatch(clearWishlist());
                // Reset last activity
                updateLastActivity();
            }
        };

        // Check inactivity on page load/return
        const checkInactivityOnReturn = () => {
            const lastActivity = Number(localStorage.getItem('lastActivityTime'));
            // If there's no last activity time or it's been more than 60 minutes
            if (!lastActivity || (Date.now() - lastActivity >= INACTIVITY_TIMEOUT)) {
                dispatch(clearCart());
                dispatch(clearWishlist());
            }
            // Update the activity time after checking
            updateLastActivity();
        };

        // Set up activity listeners
        const activityEvents = [
            'mousedown',
            'keydown',
            'scroll',
            'touchstart',
            'mousemove'
        ];

        // Update activity timestamp on user interaction
        const handleActivity = () => {
            updateLastActivity();
        };

        // Check inactivity when the page loads
        checkInactivityOnReturn();

        // Set up activity listeners
        activityEvents.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        // Start periodic check for inactivity
        activityCheckInterval = setInterval(checkInactivity, ACTIVITY_CHECK_INTERVAL);

        // Handle page visibility changes
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                checkInactivityOnReturn();
            }
        };

        // Add visibility change listener
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            // Clean up event listeners and intervals
            activityEvents.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            clearInterval(activityCheckInterval);
        };
    }, [dispatch]);

    return (
        <>
          <main>
            <Outlet/>
          </main>
        </>
    )
}

export default App;
