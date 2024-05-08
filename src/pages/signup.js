import React, { useState } from 'react';
import { createUserWithEmailAndPassword, auth, db, collection, addDoc} from '../firebase'; // Import the createUserWithEmailAndPassword function
import { Link , Navigate} from 'react-router-dom';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false); // State for success message

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Sign Up Successful!', userCredential.user);
    
            // Create a new user object without the password
            const newUser = {
                name,
                email,
                uid: userCredential.user.uid, // Get the user's UID
            };
    
            // Remove the password from newUser object
            delete newUser.password;
    
            // Add user data to Firestore collection 'users'
            await addDoc(collection(db, 'users'), newUser);
            
            // Clear sensitive data from state
            setName('');
            setEmail('');
            setPassword('');
            
            setSuccess(true); // Set success state to true
        } catch (error) {
            setError(error.message);
            console.error('Sign Up Error:', error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
                <h1 className="text-white text-2xl mb-5">Sign Up</h1>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                />
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
                    onClick={handleSignUp} // Call handleSignUp function on button click
                    className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
                >
                    Sign Up
                </button>
                {error && <p className="text-red-500">{error}</p>} {/* Display error message if there's an error */}
                {success && (<Navigate to="/ecommerce" replace={true} />

                    // <div className="bg-green-500 p-3 rounded mt-3 text-white">
                    //     Sign up successful! {/* Success message */}
                    //     <Link to="/"><button className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500">
                    //         Back to SignIn
                    //     </button></Link>
                    // </div>
                )}
            </div>
        </div>
    );
}

export default SignUp;
