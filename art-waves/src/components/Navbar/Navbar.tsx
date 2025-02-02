import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { logout } from '../../slices/authSlice';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';

export const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: '64px', right: '0px' });
    const profileDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updatePosition = () => {
            if (profileDropdownRef.current && isProfileDropdownOpen) {
                const rect = profileDropdownRef.current.getBoundingClientRect();
                setDropdownPosition({
                    top: '64px',
                    right: `${window.innerWidth - rect.right}px`
                });
            }
        };

        const handleScroll = () => {
            if (isProfileDropdownOpen) {
                setIsProfileDropdownOpen(false);
            }
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', handleScroll, true);
        
        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isProfileDropdownOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        setIsProfileDropdownOpen(false);
    };

    const getInitials = () => {
        if (!user) return '';
        return `${user.firstname[0]}${user.lastname[0]}`.toUpperCase();
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-bold text-indigo-600">
                            ArtWaves
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden sm:flex sm:items-center sm:space-x-8">
                        <Link to="/" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md transition duration-150">
                            Home
                        </Link>
                        <Link to="/shop" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md transition duration-150">
                            Shop
                        </Link>
                        <Link to="/blog" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md transition duration-150">
                            Blog
                        </Link>
                        <Link to="/contact" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md transition duration-150">
                            Contact
                        </Link>
                    </div>

                    {/* Right side items */}
                    <div className="hidden sm:flex sm:items-center sm:space-x-4">
                        <Link to="/wishlist" className="text-gray-600 hover:text-indigo-600 p-2 rounded-full transition duration-150 relative">
                            <FaHeart className="h-6 w-6" />
                            {wishlistItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {wishlistItems.length}
                                </span>
                            )}
                        </Link>
                        <Link to="/cart" className="text-gray-600 hover:text-indigo-600 p-2 rounded-full transition duration-150 relative">
                            <FaShoppingCart className="h-6 w-6" />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            <div className="relative" ref={profileDropdownRef}>
                                <button
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="flex items-center focus:outline-none cursor-pointer"
                                >
                                    {user?.imageUrl ? (
                                        <img
                                            src={user.imageUrl}
                                            alt="Profile"
                                            className="h-8 w-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                                            {getInitials()}
                                        </div>
                                    )}
                                </button>

                                {isProfileDropdownOpen && (
                                    <div 
                                        style={{
                                            position: 'fixed',
                                            top: dropdownPosition.top,
                                            right: dropdownPosition.right,
                                            transform: 'translateX(0)',
                                        }}
                                        className="w-64 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-50"
                                    >
                                        <div className="px-4 py-4">
                                            <div className="flex items-center space-x-3">
                                                {user?.imageUrl ? (
                                                    <img
                                                        src={user.imageUrl}
                                                        alt="Profile"
                                                        className="h-12 w-12 rounded-full object-cover border-2 border-indigo-100"
                                                    />
                                                ) : (
                                                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-lg font-semibold border-2 border-indigo-100">
                                                        {getInitials()}
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        {user?.firstname} {user?.lastname}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {user?.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="py-2">
                                            <Link
                                                to="/profile"
                                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition duration-150"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                            >
                                                <svg className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                View Profile
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition duration-150"
                                            >
                                                <svg className="h-5 w-5 mr-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        >
                            {isMenuOpen ? (
                                <HiX className="block h-6 w-6" />
                            ) : (
                                <HiMenu className="block h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            to="/"
                            className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/shop"
                            className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Shop
                        </Link>
                        <Link
                            to="/blog"
                            className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Blog
                        </Link>
                        <Link
                            to="/contact"
                            className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Contact
                        </Link>
                        <Link
                            to="/cart"
                            className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Cart
                        </Link>
                        {!isAuthenticated && (
                            <Link
                                to="/login"
                                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Login
                            </Link>
                        )}
                        {isAuthenticated && (
                            <>
                                <Link
                                    to="/profile"
                                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};