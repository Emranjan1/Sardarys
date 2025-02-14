import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BasketProvider } from './context/BasketContext';
import AuthenticatedApp from './AuthenticatedApp';

const App = () => {
    return (
        <AuthProvider>
            <BasketProvider>
                <Router>
                    <AuthenticatedApp />
                </Router>
            </BasketProvider>
        </AuthProvider>
    );
};

export default App;
