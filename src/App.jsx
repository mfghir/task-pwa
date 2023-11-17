import { useEffect, useRef, useState } from "react";

function App() {
  const [hasPhoto, setHasPhoto] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);
  const videoRef = useRef(null);
  const photoRef = useRef(null);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: { width: 430, height: 600 },
      })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .then((err) => console.log("err", err));
  };

  const takePhoto = () => {
    const width = 414;
    const height = width / (16 / 9);

    let video = videoRef.current;
    let photo = photoRef.current;

    photo.width = width;
    photo.height = height;

    let ctx = photo.getContext("2d");
    ctx.drawImage(video, 0, 0, width, height);
    setHasPhoto(true);
    setOpenCamera(false)
  };

  const closeHandler = () => {
    let photo = photoRef.current;
    let ctx = photo.getContext("2d");
    ctx.clearRect(0, 0, photo.width, photo.height);
    setHasPhoto(false);
  };

  useEffect(() => {
    getVideo();
  }, [videoRef]);

  return (
    <main className="App">
      <section className="main">
        <div className="camera-box">
          <div className={`camera ${openCamera ? "showOn" : "showOff"}`}>
            <video ref={videoRef}></video>
            <button className="btn" onClick={takePhoto}>
              take pic
            </button>
          </div>

          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
            incidunt repudiandae porro ullam, quis inventore, culpa suscipit
            quibusdam laudantium sequi qui tempora quam assumenda ipsa.
          </p>
          <img src="../public/img/car.png" alt="car" />
          {/* <button className="btn" onClick={takePhoto}> */}
          <button className="btn" onClick={() => setOpenCamera(!openCamera)}>
            open camera
          </button>
        </div>

        <div className={"result " + (hasPhoto ? "hasPhoto" : "")}>
          <canvas ref={photoRef}></canvas>
          <button className="btn" onClick={closeHandler}>
            close
          </button>
        </div>
      </section>
    </main>
  );
}

export default App;
