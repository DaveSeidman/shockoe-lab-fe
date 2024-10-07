// window.global ||= window;
import axios from 'axios';

import React, { useState } from 'react';
import './index.scss';
import TextEntry from './textEntry';
import ImageEntry from './imageEntry';
import VideoEntry from './videoEntry';

export default function EditEntryOverlay({ entries, entry, types, tags, onSave, setEditingEntry }) {
  const [title, setTitle] = useState(entry.title);
  const [summary, setSummary] = useState(entry.summary || '');
  const [selectedTags, setSelectedTags] = useState(entry.tags.map((tag) => tag._id));
  const [relatedEntries, setRelatedEntries] = useState(entry.related || []);
  const [text, setText] = useState(entry.text || { content: undefined, text: undefined, caption: undefined });
  const [image, setImage] = useState(entry.image || { file: undefined, text: '', caption: '' });
  const [video, setVideo] = useState(entry.video || { file: undefined, text: '', caption: '' });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false); // TODO: instead just use upload progress for this
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [filesToRemove, setFilesToRemove] = useState([]);

  const typeName = types.find((type) => type._id === entry.type._id).name;

  const uploadFile = async (file) => {
    // console.log('lets upload this file', file);
    try {
      setIsUploading(true);

      // Step 1: Fetch the signed URL from the backend
      const response = await axios.get(`${location.origin}/api/s3/generate-upload-url`, {
        params: {
          fileName: `${entry._id}/${file.name}`,
          fileType: file.type,
        },
      });
      const { uploadURL } = response.data;

      // Step 2: Upload the file to S3 using the signed URL with axios
      const uploadResponse = await axios.put(uploadURL, file, {
        headers: { 'Content-Type': file.type },
        onUploadProgress: (event) => {
          const progress = Math.round((100 * event.loaded) / event.total);
          console.log({ progress });
          setUploadProgress(progress);
        },
      });

      if (uploadResponse.status !== 200) {
        throw new Error('Upload failed');
      }

      // Step 3: Return the URL of the uploaded image
      const uploadedImageUrl = `https://shockoe-lab-assets.s3.amazonaws.com/${entry._id}/${file.name}`;

      setIsUploading(false);
      return uploadedImageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      setIsUploading(false);
      return fallbackImage;
    }
  };

  const handleSave = async () => {
    // console.log('time to save', { image, video, text });

    const dataToSave = { title, summary, text, image, video, tags: selectedTags, related: relatedEntries };

    if (filesToUpload.length) {
      filesToUpload.forEach(async (file) => {
        await uploadFile(file);
      });
    }

    onSave(entry._id, dataToSave);
  };

  const handleTagChange = (tagId) => {
    setSelectedTags((prevTags) => {
      if (prevTags.includes(tagId)) {
        return prevTags.filter((id) => id !== tagId);
      }
      return [...prevTags, tagId];
    });
  };

  const handleRelatedEntriesChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedIds = selectedOptions.map((option) => option.value).filter((value) => value !== '');
    setRelatedEntries(selectedIds);
  };

  return (
    <div className="overlay">
      <div className="overlay-content">
        <label>
          <span>title:</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          <span>summary:</span>
          <input
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)} // Added input for summary
            placeholder="Summary"
          />
        </label>
        {typeName === 'Text' && (
          <TextEntry
            entry={entry}
            text={text}
            setText={setText}
            setFilesToUpload={setFilesToUpload}
            setFilesToRemove={setFilesToRemove}
          />
        )}
        {typeName === 'Image' && (
          <ImageEntry
            entry={entry}
            image={image}
            setImage={setImage}
            setFilesToUpload={setFilesToUpload}
            setFilesToRemove={setFilesToRemove}
          />
        )}
        {typeName === 'Video' && (
          <VideoEntry
            entry={entry}
            video={video}
            setVideo={setVideo}
            setFilesToUpload={setFilesToUpload}
            setFilesToRemove={setFilesToRemove}
          />
        )}
        {isUploading && (
          <p className="upload">
            Uploading:
            {uploadProgress}
            %
          </p>
        )}
        <p>Tags:</p>
        <div className="tags-list">
          {tags.map((tag) => (
            <div key={tag._id}>
              <input
                type="checkbox"
                checked={selectedTags.includes(tag._id)}
                onChange={() => handleTagChange(tag._id)}
              />
              {tag.name}
            </div>
          ))}
        </div>
        <p>Related Entries:</p>
        <select
          multiple
          value={relatedEntries}
          onChange={handleRelatedEntriesChange}
        >
          <option value="" />
          {entries.filter((e) => e._id !== entry._id).map((e) => (
            <option value={e._id} key={e._id}>{e.title}</option>
          ))}
        </select>
        <div className="actions">
          <button onClick={handleSave} disabled={isUploading}>Save</button>
          <button onClick={() => setEditingEntry(false)}>Cancel</button>
        </div>
        <span className="type">{typeName}</span>
      </div>
    </div>
  );
}
