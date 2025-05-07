import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './Components/contexts/AuthContext';
import SignUp from './Components/auth/SignUp';
import SignIn from './Components/auth/SignIn';
import Navbar from './Components/layout/Navbar';
import Footer from './Components/layout/Footer';
import HomePage from './Components/pages/HomePage';
import Offer from './Components/pages/Offer';
import ProductOfferCard from './Components/product/ProductOfferCard';
import ProductCard from './Components/product/ProductCard';
import WelcomeScreen from './Components/WelcomeScreen';
import PrivacyPolicy from './Components/pages/Terms';
import ForgotPasswordForm from './Components/auth/Password';
import ResetPasswordForm from './Components/auth/Resetpassword';
import HelpPage from './Components/pages/Help';
import FAQPage from './Components/pages/FAQS';
import Loader from './Components/layout/Loader';
import CouponsPage from './Components/pages/Coupons';
import UserSettingsPage from './Components/pages/Settings';

// Layout config
const LAYOUT_CONFIG = {
  hiddenPaths: ['/', '/login', '/register'],
  routes: [
    { path: '/', element: <WelcomeScreen /> },
    { path: '/home', element: <HomePage /> },
    { path: '/login', element: <SignIn /> },
    { path: '/register', element: <SignUp /> },
    { path: '/deals', element: <Offer /> },
    { path: '/deals/:offerId', element: <ProductOfferCard /> },
    { path: '/products/:productId', element: <ProductCard /> },
    { path: '/category/:categoryId', element: <HomePage /> },
    { path: '/terms', element: <PrivacyPolicy /> },
    { path: '/forgotpassword', element: <ForgotPasswordForm /> },
    { path: '/resetpassword', element: <ResetPasswordForm /> },
    { path: '/help', element: <HelpPage /> },
    { path: '/faqs', element: <FAQPage /> },
    { path: '/loader', element: <Loader /> },
    { path: '/coupons', element: <CouponsPage /> },
    { path: '/settings', element: <UserSettingsPage /> },




    // New routes with placeholder divs
    { 
      path: '/orders', 
      element: <div className="quote">Your orders will appear here once you make some purchases!</div> 
    },
    { 
      path: '/wishlist', 
      element: <div className="quote">Your wishlist is empty. Start saving your favorite items!</div> 
    },
    { 
      path: '/settings', 
      element: <div className="quote">Account settings and preferences will be managed here.</div> 
    },
    { 
      path: '/account', 
      element: <div className="quote">Welcome to your profile page! Personalize your account here.</div> 
    },
    { path: '*', element: <div>404 - Page Not Found</div> }
  ]
};

function Layout() {
  const location = useLocation();
  const showLayout = !LAYOUT_CONFIG.hiddenPaths.includes(location.pathname);

  return (
    <div className="app-container">
      {showLayout && <Navbar />}

      <main className="main-content">
        <Routes>
          {LAYOUT_CONFIG.routes.map((route, index) => (
            <Route 
              key={index} 
              path={route.path} 
              element={route.element} 
            />
          ))}
        </Routes>
      </main>

      {showLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </Router>
  );
}

export default App;
