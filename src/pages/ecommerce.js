import React, { useEffect, useState } from 'react'; 
import { db, collection, getDocs, addDoc } from '../firebase'; // Import db and addDoc from firebase.js
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { Link, Navigate } from 'react-router-dom';
import Modal from 'react-modal';
const customModalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: '1000'
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    width: '400px',
    transform: 'translate(-50%, -50%)',
    maxWidth: '80%',
    maxHeight: '80%',
    overflow: 'auto',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '20px'
  }
};

const EcommercePage = () => {
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentUser, setCurrentUser] = useState(null); // State for current user
  const [submitSuccess, setSubmitSuccess] = useState(false); // State for submit success
  const [submitError, setSubmitError] = useState(null); // State for submit error
  const [modalIsOpen, setModalIsOpen] = useState(false); // State for modal


  const fetchBooks = async () => {
    const bookCollection = collection(db, 'books');
    const snapshot = await getDocs(bookCollection);
    const bookList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setBooks(bookList);
  };

  useEffect(() => {
    fetchBooks();
    
    // Listen for authentication state changes
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user); // Set current user if signed in
      } else {
        setCurrentUser(null); // Set current user to null if signed out
      }
    });
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setCurrentUser(null); // Clear current user state // Redirect to login page
    } catch (error) {
      console.error('Logout Error:', error.message);
    }
  };

  const addToCart = (book) => {
    const existingItem = cart.find(item => item.id === book.id);
    if (existingItem) {
      const updatedCart = cart.map(item => {
        if (item.id === book.id) {
          return { ...item, quantity: item.quantity + 1 }; // Increase quantity
        }
        return item;
      });
      setCart(updatedCart);
    } else {
      const updatedCart = [...cart, { ...book, quantity: 1 }]; // Add book with quantity 1
      setCart(updatedCart);
    }
    setTotalPrice(totalPrice + book.Price);
  };

  const removeFromCart = (bookId) => {
    const existingItem = cart.find(item => item.id === bookId);
    if (existingItem.quantity === 1) {
      const updatedCart = cart.filter(item => item.id !== bookId);
      setCart(updatedCart);
    } else {
      const updatedCart = cart.map(item => {
        if (item.id === bookId) {
          return { ...item, quantity: item.quantity - 1 }; // Decrease quantity
        }
        return item;
      });
      setCart(updatedCart);
    }
    setTotalPrice(totalPrice - existingItem.Price);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const openmodal = async () => {
    setModalIsOpen(true); // Open the modal
  };

  const handleSubmitOrder = async () => {
    try {
      const orderData = {
        user: currentUser.email,
        cart: cart,
        totalPrice: totalPrice,
        createdAt: new Date(),
      };
      await addDoc(collection(db, 'orders'), orderData);
      setSubmitSuccess(true);
      setSubmitError(null);
      setCart([]);
      setTotalPrice(0);
      setModalIsOpen(false);
      alert('Order submitted successfully!'); // Show success alert
    } catch (error) {
      setSubmitError(error.message);
      setSubmitSuccess(false);
      alert('Error submitting order: ' + error.message); // Show error alert
    }
  };

  const categories = ['All', 'Fiction', 'Non-Fiction', 'Romance', 'Biography', 'Bundle'];

  const filteredBooks = selectedCategory === 'All' ? books : books.filter(book => book.Category === selectedCategory);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-end mb-4">
        <Link to="/"><button onClick={handleLogout} className="bg-red-500 text-white border-0 px-4 py-2 rounded-lg">Logout</button></Link>
      </div>
      <h1 className="text-3xl font-bold text-center mb-8">E-commerce Page</h1>
      {currentUser && (
        <div className="text-black text-center mb-6">
          <div>Signed in as: {currentUser.name}</div>
          <div>{currentUser.email}</div>
        </div>
      )}
      <div className="mb-4 flex justify-center">
        {categories.map(category => (
          <button key={category} className={`px-4 py-2 rounded-lg mr-4 ${selectedCategory === category ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`} onClick={() => handleCategoryChange(category)}>{category}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map(book => (
          <div key={book.id} className="bg-white border rounded-lg shadow-md p-4">
            <div className="flex justify-center">
              <img src={book.Photo} alt={book.Title} className="w-32 h-48 object-contain mb-2" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{book.Title}</h3>
            <p className="text-sm text-gray-600 mb-2">Author: {book.Author}</p>
            <p className="text-sm text-gray-600 mb-2">Category: {book.Category}</p>
            <p className="text-lg font-bold mb-2">${book.Price}</p>
            <p className="text-sm text-gray-700 mb-2">{book.Description}</p>
            <button onClick={() => addToCart(book)} className="bg-indigo-600 text-white border-0 px-3 py-1 rounded-lg mt-2">Add to Cart</button>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <div>
            {cart.map(item => (
              <div key={item.id} className="flex items-center justify-between border-b py-2">
                <div>
                  <p>{item.Title}</p>
                  <p>${item.Price}</p>
                </div>
                <div className="flex items-center">
                  <p>Quantity: {item.quantity}</p>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 ml-4">Remove</button>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center mt-4">
              <p className="font-bold">Total:</p>
              <p>${totalPrice.toFixed(2)}</p>
            </div>
            <button onClick={openmodal} className="bg-green-500 text-white border-0 px-4 py-2 rounded-lg mt-4">Review Cart & Submit Order</button>
            {/* {submitSuccess && <p className="text-green-500 mt-2">Order submitted successfully!</p>}
            {submitError && <p className="text-red-500 mt-2">Error submitting order: {submitError}</p>} */}
          </div>
        )}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customModalStyles}
        contentLabel="Cart Review Modal"
      >
        <h2 className="text-2xl font-bold mb-4">Review Cart</h2>
        {cart.map(item => (
          <div key={item.id} className="flex items-center justify-between border-b py-2">
            <div>
              <p>{item.Title}</p>
              <p>Quantity: {item.quantity}</p>
              <p className='items-end'>${item.Price}</p>
            </div>
          </div>
        ))}
        <p className="font-bold">Total: ${totalPrice.toFixed(2)}</p>
        <div className="flex justify-end mt-4">
          <button onClick={handleSubmitOrder} className="bg-green-500 text-white border-0 px-4 py-2 rounded-lg">Submit Order</button>
        </div>
      </Modal>
    </div>
  );
};

export default EcommercePage;
