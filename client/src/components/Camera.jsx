import { useState, useRef } from 'react';

const Camera = () => {

  const [picture, setPicture] = useState(null);
  const [rawPicture, setRawPicture] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);


  // Function to open the camera and start video streaming
  const openCamera = () => {
    setCameraOn(true);
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((error) => {
        console.error('Error accessing camera:', error);
      });
  };


  // Function to capture the picture
  const capturePicture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    const pictureData = canvas.toDataURL();
    canvas.toBlob((blob)=>{
      setRawPicture(blob);
    })
    setPicture(pictureData);
    video.srcObject.getTracks().forEach((track) => track.stop());
    // navigator.mediaDevices.getUserMedia(false)
    setCameraOn(false);
  };


  // Function to retake the picture
  const retakePicture = () => {
    setPicture(null);
    openCamera();
  };


  const saveToGallery = (e) => {
    e.preventDefault();
  };

  


  return (
    <div>
      <h2>Camera</h2>
      <form>
        {/* <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" value={name} onChange={handleNameChange} />
        </div> */}
        <div>
          {picture ? (
            <div>
              <img src={picture} alt="Captured" />
              <button type="button" onClick={retakePicture}>Retake Picture</button>
            </div>
          ) : (
            <div>
              <video ref={videoRef}/>
              <canvas ref={canvasRef}/>
              {cameraOn?null:<button type="button" onClick={()=>{
                const confirmBox = window.confirm("Allow Access to your camera?")
                if(confirmBox===true){
                  openCamera()
                } else{
                  return null
                }
                }}>Open Camera</button>}
              {cameraOn?<button onClick={()=>{capturePicture()}}>Capture</button>:null}
            </div>
          )}
        </div>
        {picture && (
          <div>
            <button type="button" onClick={(e)=>{saveToGallery(e)}}>Save</button>
            <button type="button" onClick={()=>{retakePicture()}}>Discard</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Camera;
