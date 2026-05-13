import { useState, useRef } from 'react';
import './Camera.css';

const Camera = () => {

  const [picture, setPicture] = useState(null);       // base64 data URL for preview
  const [rawPicture, setRawPicture] = useState(null); // Blob for saving
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);


  // start camera
  const openCamera = () => {
    setCameraOn(true);
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((error) => {
        // access denied or camera unavailable
        console.error('Error accessing camera:', error);
        setCameraOn(false);
      });
  };


  // take picture
  const capturePicture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    const pictureData = canvas.toDataURL('image/png');
    setPicture(pictureData);

    // store the raw Blob for file download on save
    canvas.toBlob((blob) => {
      setRawPicture(blob);
    }, 'image/png');

    // stop camera tracks
    video.srcObject.getTracks().forEach((track) => track.stop());
    setCameraOn(false);
  };


  const retakePicture = () => {
    setPicture(null);
    setRawPicture(null);
    openCamera();
  };


  // trigger download of the captured image using the raw Blob
  const saveToGallery = (e) => {
    e.preventDefault();

    if (!rawPicture) return;

    // Create a temporary object URL from the Blob and click a hidden anchor
    const url = URL.createObjectURL(rawPicture);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `photo_${Date.now()}.png`; // unique filename with timestamp
    anchor.click();

    // clean up the object URL to free memory. important
    URL.revokeObjectURL(url);
  };


  // discard photo and reset
  const discardPicture = () => {
    setPicture(null);
    setRawPicture(null);
    setCameraOn(false);
  };


  return (
    <div className="camera-page">
      <p className="camera-title">Camera</p>

      <form>
        <div className="camera-frame">

          <span className="corner corner-tl" aria-hidden="true" />
          <span className="corner corner-tr" aria-hidden="true" />
          <span className="corner corner-bl" aria-hidden="true" />
          <span className="corner corner-br" aria-hidden="true" />

          {picture ? (
            <img src={picture} alt="Captured photo" />
          ) : (
            <>
              <video ref={videoRef} style={{ display: cameraOn ? 'block' : 'none' }} />
              {!cameraOn && (
                <div className="camera-placeholder" aria-label="Camera inactive">
                  ◎
                </div>
              )}
            </>
          )}

          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        {/*controls*/}
        <div className="camera-controls">
          {!picture && !cameraOn && (
            <button className="btn" type="button" onClick={openCamera}>
              Open Camera
            </button>
          )}

          {!picture && cameraOn && (
            <button className="btn" type="button" onClick={capturePicture}>
              Capture
            </button>
          )}

          {picture && (
            <>
              <button className="btn btn-primary" type="submit" onClick={saveToGallery}>
                Save
              </button>
              <button className="btn" type="button" onClick={retakePicture}>
                Retake
              </button>
              <button className="btn" type="button" onClick={discardPicture}>
                Discard
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default Camera;
