import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { io } from 'socket.io-client'; // Import the Socket.IO client
import Entries from './views/entries';
import AdminView from './views/admin';
import { apiUrls } from './config.json';
import './index.scss';

const env = location.hostname === 'localhost' ? 'local' : 'staging'


export default function App() {
  const [entries, setEntries] = useState([]);
  const [tags, setTags] = useState([]);
  const [types, setTypes] = useState([]);
  const [themes, setThemes] = useState([]);
  const [theme, setTheme] = useState(null); // State to store received RFID data

  useEffect(() => {
    // Fetch the initial data from the backend API
    fetch(`${apiUrls[env]}/api/data`).then((res) => res.json()).then(({ entries, tags, types, themes }) => {
      setEntries(entries);
      setTags(tags);
      setTypes(types);
      setThemes(themes);
    });

    // Initialize the socket connection to the backend server
    const socket = io(apiUrls[env]); // Connect to the backend's Socket.IO server

    socket.on('themeId', (data) => {
      console.log(themes, data);
      setTheme(data.theme); // Update the state with the received RFID data
    });

    // Cleanup the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route
          path="/entries"
          element={(
            <Entries
              entries={entries}
              types={types}
              tags={tags}
              themes={themes}
              theme={theme}
              setTheme={setTheme}
            />
          )}
        >
          {/* TODO: does this need the rest of the data? */}
          <Route path=":entryId" element={<Entries />} />
        </Route>
        <Route path="/admin" element={<AdminView />} />
        <Route
          path="/"
          element={(
            <div>
              <h1>Lab Tables</h1>
              <Link to="entries">Entries</Link>
              <Link to="admin">Admin</Link>
            </div>
          )}
        />
      </Routes>
    </Router>
  );
}
