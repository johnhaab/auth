import React, { useState } from "react";
import axios from "axios";
import "./PhotoUploadCard.scss";

const PhotoUploadCard = ({
  checkIfPhotoCardIsOpen,
  handleProfilePictureChange,
  previewProfilePicture,
}) => {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(selectedFile);
      fileReader.onloadend = () => {
        handleProfilePictureChange(fileReader.result);
      };
    } else {
      handleProfilePictureChange(null);
    }
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    handleProfilePictureChange(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // You can handle the file and URL submission here, or pass them to a parent component
    console.log("File:", file);
    console.log("URL:", url);

    if (file) {
      // send the file to the img to url api as a post request with the file under the key "image", then the response will be the url of the image
      const formData = new FormData();
      formData.append("image", file);
      const res = await axios.post(
        "http://209.192.200.84:3000/api/image-to-url/upload",
        formData
      );
      const convertedUrl = res.data.url[0];
      // create an axios post request to send the url to client
      console.log(convertedUrl);
      handleProfilePictureChange(convertedUrl);
      checkIfPhotoCardIsOpen();
    } else if (url) {
      // create an axios post request to send the url to client
      handleProfilePictureChange(url);
      checkIfPhotoCardIsOpen();
    }
  };

  return (
    <div className="container">
      <h2 className="title">Upload Profile Picture</h2>
      <img src={previewProfilePicture} alt="123" className="preview-pfp" />
      <form className="form" onSubmit={handleSubmit}>
        <label className="label" htmlFor="file-input">
          Upload from computer:
        </label>
        <input
          className="file-input"
          type="file"
          id="file-input"
          accept="image/*"
          onChange={handleFileChange}
          style={{ color: "#000" }}
        />
        <br />
        <label className="label" htmlFor="url-input">
          Or enter image URL:
        </label>
        <input
          className="url-input"
          type="url"
          id="url-input"
          value={url}
          onChange={handleUrlChange}
          placeholder="https://example.com/image.jpg"
        />
        <br />
        <div className="wrapper-buttons">
          <button
            className="submit-button"
            type="submit"
            onClick={(e) => handleSubmit(e)}
          >
            Submit
          </button>
          <button
            className="cancel-button"
            type="close"
            onClick={(e) => checkIfPhotoCardIsOpen(e)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PhotoUploadCard;
