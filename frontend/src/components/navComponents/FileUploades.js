import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axiosConfig";

const DropArea = () => {
  const [files, setFiles] = useState([]);
  const [hasFile, setHasFile] = useState(false);

  const handlePaste = (event) => {
    const clipboardItems = Array.from(event.clipboardData.items);

    // Check if there is a file in the clipboardItems
    const hasFileInClipboard = clipboardItems.some(
      (item) => item.kind === "file"
    );

    clipboardItems.forEach((item) => {
      if (item.kind === "file" && !hasFile) {
        const file = item.getAsFile();
        console.log(file);
        setFiles((prevFiles) => [...prevFiles, file]);
        setHasFile(true);
      } else if (item.kind === "string" && !hasFileInClipboard) {
        item.getAsString((text) => {
          // Process the pasted text as needed
          console.log("Pasted text:", text);
          setFiles((prevFiles) => [...prevFiles, text]);
        });
        setHasFile(false);
      }
    });
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const dataTransfer = event.dataTransfer;

    if (dataTransfer.items) {
      const droppedFiles = Array.from(dataTransfer.items)
        .filter((item) => item.kind === "file")
        .map((item) => item.getAsFile());

      setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
    } else {
      const droppedFiles = Array.from(dataTransfer.files);

      setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
    }

    const imageUrl = event.dataTransfer.getData("text/html");
    const rex = /src="?([^"\s]+)"?\s*/;
    const url = rex.exec(imageUrl);
    const cleanedUrl = url[1].replace(/&amp;/g, "&"); // Remove all occurrences of '&amp;'
    console.log(cleanedUrl);
    setFiles((prevFiles) => [...prevFiles, cleanedUrl]);
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append("image", files[0]);
    await axiosInstance.post("/api/posts", formData).then((res) => {
      console.log(res.data);
    });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragStart = (event) => {
    event.dataTransfer.setData("text/plain", event.target.src);
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
  };

  const handleDragOverImage = (event) => {
    event.preventDefault();
  };

  const handleDropImage = (event) => {
    event.preventDefault();
    const imageUrl = event.dataTransfer.getData("text/plain");
    setFiles((prevFiles) => [...prevFiles, imageUrl]);
  };

  const compressImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 500;
          const MAX_HEIGHT = 500;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            file.type,
            0.7
          );
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (event) => {
    const uploadedFiles = Array.from(event.target.files);
    const compressedFiles = await Promise.all(uploadedFiles.map(compressImage));

    setFiles((prevFiles) => [...prevFiles, ...compressedFiles]);
  };

  return (
    <div>
      <div
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{ width: "300px", height: "200px", border: "1px dashed #ccc" }}
      >
        <h3>Drop Area</h3>
        <input type="file" multiple onChange={handleFileChange} />
        <ul>
          {files.map((file, index) => (
            <li key={index}>
              {typeof file === "string" ? (
                <div
                  style={
                    file.substring(0, 5) === "https"
                      ? { border: "dotted red 4px" }
                      : { border: "solid black" }
                  }
                >
                  <img
                    src={file}
                    alt={`Image url`}
                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                    draggable="true"
                    onDragStart={handleDragStart}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOverImage}
                    onDrop={handleDropImage}
                  />
                </div>
              ) : (
                <div style={{ border: "solid black" }}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <button onClick={handleFileUpload}>upload</button>
      </div>
    </div>
  );
};

export default DropArea;
