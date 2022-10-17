// @ts-nocheck
import React, { useRef, useState } from "react";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import useFileUpload from "react-use-file-upload";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

const App = () => {
  const firebaseConfig = {
    databaseURL: "https://plenocentro-e1764-default-rtdb.firebaseio.com",
    apiKey: "AIzaSyAHlpxS6Ss70NwpXCVaNT72yqnAYZTzeA8",
    authDomain: "plenocentro-e1764-default-rtdb.firebaseio.com",
    storageBucket: "plenocentro-e1764.appspot.com",
    messagingSenderId: "776532998780",
  };
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  const storageRef = ref(storage, uuidv4());
  const [uploadedUrls, setUploadedUrls] = useState([""]);

  const {
    files,
    fileNames,
    fileTypes,
    totalSize,
    totalSizeInBytes,
    handleDragDropEvent,
    clearAllFiles,
    setFiles,
    removeFile,
  } = useFileUpload();

  const inputRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const urls = await files.map(async (file) => {
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        return url;
      });
      const promiseValues = await Promise.all(urls);
      console.log(setUploadedUrls(promiseValues));
    } catch (error) {
      console.error("Failed to submit files.");
    }
  };

  return (
    <>
      <h1>Starbucks Share</h1>

      <p>
        Use el formulario de la derecha para seleccionar los archivo a subir
      </p>

      <div className="form-container">
        {/* Display the files to be uploaded */}
        <div className="filename-list">
          <ul className="selected-files" id="selected-files">
            {fileNames.map((name, index) => (
              <li key={name}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>{name}</span>
                  {uploadedUrls.length >= index && uploadedUrls[index] != "" && (
                    <a href={uploadedUrls[index]} target="_blank">link de descarga</a>
                  )}
                </div>

                <span onClick={() => removeFile(name)}>
                  <i className="fa fa-times" />
                </span>
              </li>
            ))}
          </ul>
          {files.length == 0 && (
            <p>Los archivos seleccionados apareceran aqui:</p>
          )}
          {files.length > 0 && (
            <ul>
              <li>File types found: {fileTypes.join(", ")}</li>
              <li>Total Size: {totalSize}</li>
              <li>Total Bytes: {totalSizeInBytes}</li>

              <li className="clear-all">
                <button
                  style={{ marginTop: 10 }}
                  onClick={() => clearAllFiles()}
                >
                  Borrar todo
                </button>
              </li>
            </ul>
          )}
        </div>

        {/* Provide a drop zone and an alternative button inside it to upload files. */}
        <div
          className="dropzone"
          onDragEnter={handleDragDropEvent}
          onDragOver={handleDragDropEvent}
          onDrop={(e) => {
            handleDragDropEvent(e);
            setFiles(e, "a");
          }}
        >
          <p>Arrastre y suelte los archivos aqui</p>

          <button onClick={() => inputRef.current.click()}>
            O seleccione los archivos
          </button>

          {/* Hide the crappy looking default HTML input */}
          <input
            ref={inputRef}
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={(e) => {
              setFiles(e, "a");
              inputRef.current.value = null;
            }}
          />
        </div>
      </div>

      <div className="submit">
        <button onClick={handleSubmit}>Enviar</button>
      </div>
    </>
  );
};

export default App;
