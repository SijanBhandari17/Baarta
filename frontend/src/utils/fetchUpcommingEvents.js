import { useState } from 'react';

const upcommingEventsArray = [
  {
    title: 'Research Symposium 2024',
    date: 'Feb 15',
    time: '10:00 AM',
  },
  {
    title: 'Tech Innovators Conference',
    date: 'Mar 22',
    time: '9:00 AM',
  },
  {
    title: 'Annual Science Fair',
    date: 'Apr 10',
    time: '1:30 PM',
  },
];

const upCommingEvents = async e => {
  try {
    const response = await fetch('http://localhost:5000/all/', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    const data = await response.json();
    console.log(data);
    if (response.ok) {
      console.log(data);
    }
  } catch (err) {
    console.log(`Err: ${err}`);
  }
};

export default upcommingEventsArray;
