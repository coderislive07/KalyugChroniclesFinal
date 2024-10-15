import React, { useState } from 'react';

function CheckInput() {
  const [inputValue, setInputValue] = useState('');  // State to store user input
  const [message, setMessage] = useState('');  // State to store output message

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue === 'KALIKATHEEND') {
      setMessage('30°30 58.0"N 76°3932.9E');
    } else {
      setMessage('Incorrect Code.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center fl flex-col bg-[#392409] p-6">
      <h1 className='text-[#f2cc81] text-3xl font-bold'>Enter Code</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg space-y-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}  // Update inputValue on change
          placeholder="Enter the Code here"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#f2cc81]"
        />
        <button className="w-full bg-[#f2cc81] text-[#392409] py-2 px-4 rounded hover:bg-[#e6b370] transition-colors" type="submit">
          Submit
        </button>
      </form>
      {message && <p className="text-white mt-4">{message}</p>}  {/* Display output message */}
    </div>
  );
  
}

export default CheckInput;
