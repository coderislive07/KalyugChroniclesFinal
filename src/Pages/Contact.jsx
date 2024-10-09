import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { ref, set, get } from 'firebase/database';
import { db } from '../firebaseconfig';

export default function ContactPage() {
  const navigate = useNavigate();
  const { userInfo } = useAppStore();
  const [formData, setFormData] = useState({
    rollNo: '',
    chitkaraMail: '',
    groupNo: '',
    year: '',
    courseName: '',
  });

  useEffect(() => {
    if (!userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'rollNo' && !/^\d*$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      console.error('User not logged in');
      return;
    }

    try {
      const userRef = ref(db, `users/${userInfo.email.replace('.', ',')}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val() || {};

      await set(userRef, {
        ...userData,
        ...formData,
        name: userInfo.displayName,
        email: userInfo.email,
      });

      console.log('Form submitted:', formData);
      navigate('/');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#311207]">
      <div className="bg-[#b5960d] p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-[#311207] text-center">Complete Your Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="rollNo" className="block text-sm font-medium text-[#311207]">Roll No</label>
            <input
              type="text"
              id="rollNo"
              name="rollNo"
              value={formData.rollNo}
              onChange={handleChange}
              required
              pattern="\d*"
              inputMode="numeric"
              className="mt-1 block w-full rounded-md border-[#311207] shadow-sm focus:border-[#311207] focus:ring focus:ring-[#311207] focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="chitkaraMail" className="block text-sm font-medium text-[#311207]">Chitkara Mail ID</label>
            <input
              type="email"
              id="chitkaraMail"
              name="chitkaraMail"
              value={formData.chitkaraMail}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-[#311207] shadow-sm focus:border-[#311207] focus:ring focus:ring-[#311207] focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="groupNo" className="block text-sm font-medium text-[#311207]">Group No</label>
            <select
              id="groupNo"
              name="groupNo"
              value={formData.groupNo}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-[#311207] shadow-sm focus:border-[#311207] focus:ring focus:ring-[#311207] focus:ring-opacity-50"
            >
              <option value="">Select group number</option>
              {[...Array(29)].map((_, i) => (
                <option key={i + 1} value={`${i + 1}`}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#311207]">Year</label>
            <div className="mt-1 space-x-4">
              {['1st', '2nd', '3rd', '4th'].map((year) => (
                <label key={year} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="year"
                    value={year}
                    checked={formData.year === year}
                    onChange={handleChange}
                    className="form-radio text-[#311207] focus:ring-[#311207]"
                  />
                  <span className="ml-2 text-[#311207]">{year}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="courseName" className="block text-sm font-medium text-[#311207]">Course Name</label>
            <input
              type="text"
              id="courseName"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-[#311207] shadow-sm focus:border-[#311207] focus:ring focus:ring-[#311207] focus:ring-opacity-50"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#311207] hover:bg-[#4a1c0a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#311207]"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}