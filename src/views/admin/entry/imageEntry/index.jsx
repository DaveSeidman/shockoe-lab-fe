import React, { useState } from 'react';
import fallbackImage from '../../../../assets/images/fallback.png';
import { s3Bucket } from '../../../../config.json';
import './index.scss';

export default function ImageEntry({ entry, image, setImage, setFilesToUpload, setFilesToRemove }) {
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileChange = (e) => {
    // TODO: if user changes file more than once, all files get uploaded
    // we need to update the filesToUpload array so that it only contains the last file
    const fileSelected = e.target.files[0];
    if (fileSelected) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(fileSelected);
      setImage((prevImage) => ({
        file: `${s3Bucket}/${entry._id}/${fileSelected.name}`,
        text: prevImage.text,
        caption: prevImage.caption,
      }));
      setFilesToUpload((prevFiles) => [...prevFiles, fileSelected]);
    }
  };

  const handleTextChange = (e) => {
    setImage((prevImage) => ({
      file: prevImage.file,
      text: e.target.value,
      caption: prevImage.caption,
    }));
  };

  const handleCaptionChange = (e) => {
    setImage((prevImage) => ({
      file: prevImage.file,
      text: prevImage.text,
      caption: e.target.value,
    }));
  };

  const { file, text, caption } = image;

  return (
    <div className="image-entry">
      <label>
        <span>file:</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </label>
      <img className="overlay-content-image" src={previewImage || file || fallbackImage} alt="Entry" />
      <label>
        <span>text:</span>
        <input type="text" value={text} onChange={handleTextChange} />
      </label>
      <label>
        <span>caption:</span>
        <input type="text" value={caption} onChange={handleCaptionChange} />
      </label>
    </div>
  );
}
