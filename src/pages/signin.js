import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { signInWithEmailAndPassword, auth } from '../firebase'; // Import signInWithEmailAndPassword function

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false); // State for success message

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('Sign In Successful!', userCredential.user);
            setSuccess(true);
            setError(null); // Clear any previous error
        } catch (error) {
            setError(error.message);
            console.error('Sign In Error:', error.message);
        }
    };

    if (success) {
        return <Navigate to="/ecommerce" replace={true} />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
                <h1 className="text-white text-3xl font-bold text-center mb-5">Welcome To My BookStore</h1>
                <h1 className="text-white text-2xl mb-5">Sign In</h1>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                />
                <button 
                    onClick={handleSignIn} // Call handleSignIn function on button click
                    className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
                >
                    Sign In
                </button>
                {error && <p className="text-red-500">{error}</p>} {/* Display error message if there's an error */}
                <Link to="/signup"><h6 className="text-white mt-4 text-center underline">Sign Up Here</h6></Link>
            </div>
        </div>
    );
}

export default SignIn;
