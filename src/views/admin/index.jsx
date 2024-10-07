import React, { useEffect, useState } from 'react';
import './index.scss';
import EditEntryOverlay from './entry';
import { apiUrls } from '../../config.json';


export default function Admin() {
  const [tags, setTags] = useState([]);
  const [types, setTypes] = useState([]);
  // const [users, setUsers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);

  const env = location.hostname === 'localhost' ? 'local' : 'staging'


  useEffect(() => {
    async function fetchData() {
      try {
        // TODO: use a getAllData route here to save traffic
        setEntries(await (await fetch(`${apiUrls[env]}/api/entries`)).json());
        setTags(await (await fetch(`${apiUrls[env]}/api/tags`)).json());
        setTypes(await (await fetch(`${apiUrls[env]}/api/types`)).json());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const handleEditClick = (entry) => {
    setEditingEntry(entry);
  };

  const handleDeleteClick = async (entry) => {
    const response = await fetch(`${apiUrls[env]}/api/entries/${entry._id}`, {
      method: 'DELETE',
    });

    setEntries(await (await fetch(`${apiUrls[env]}/api/entries`)).json());
  };

  const handleSave = async (entryId, updatedData) => {
    console.log({ updatedData });
    try {
      const response = await fetch(`${apiUrls[env]}/api/entries/${entryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setEntries(await (await fetch(`${apiUrls[env]}/api/entries`)).json());
      setEditingEntry(false);
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };

  const addNew = async (type) => {
    const success = await fetch(`${apiUrls[env]}/api/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type }),
    });

    setEntries(await (await fetch(`${apiUrls[env]}/api/entries`)).json());
  };

  return (
    <div className="admin">
      <div className="table">
        <div className="table-row header">
          <div className="table-row-column">Title</div>
          <div className="table-row-column">Summary</div>
          <div className="table-row-column">Type</div>
          <div className="table-row-column">Tags</div>
          <div className="table-row-column">Actions</div>
        </div>
        {entries.map((entry) => (
          <div className="table-row" key={entry._id}>
            <div className="table-row-column"><a href={`${import.meta.env.BASE_URL}entries/${entry._id}`} target="_blank" rel="noreferrer">{entry.title}</a></div>
            <div className="table-row-column">{entry.summary}</div>
            <div className="table-row-column"><span className="type">{entry.type.name}</span></div>
            <div className="table-row-column taglist">{entry.tags.map((tag) => (<span key={tag._id} className="tag">{tag.name}</span>))}</div>
            <div className="table-row-column actions">
              <button type="button" onClick={() => handleEditClick(entry)}>Edit</button>
              <button type="button" onClick={() => handleDeleteClick(entry)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className="add-buttons">
        {
          types.map((type) => (
            <button
              key={type._id}
              type="button"
              onClick={() => {
                addNew(type._id);
                setTimeout(() => {
                  // TODO: scroll to bottom
                }, 100);
              }}
            >
              Add
              {' '}
              {type.name}
            </button>
          ))
        }
      </div>
      {
        editingEntry && (
          <EditEntryOverlay
            entries={entries}
            entry={editingEntry}
            tags={tags}
            types={types}
            setEditingEntry={setEditingEntry}
            onSave={handleSave}
          />
        )
      }
    </div>
  );
}
