import React from 'react';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import SignIn from './pages/signin';
import SignUp from './pages/signup';
import Ecommerce from './pages/ecommerce';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SignIn/>} />
                <Route path="/signup" element={<SignUp/>} />
                <Route path="/ecommerce" element={<Ecommerce/>} />
                </Routes>
        </Router>
    );
}

export default App;
