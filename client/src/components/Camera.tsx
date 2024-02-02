import { useRef, useState } from 'react';
import { Camera, CameraType } from 'react-camera-pro';
import styled from 'styled-components';
import Tesseract  from 'tesseract.js';


const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const Control = styled.div`
  position: fixed;
  display: flex;
  right: 0;
  width: 20%;
  min-width: 130px;
  min-height: 130px;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 50px;
  box-sizing: border-box;
  flex-direction: column-reverse;

  @media (max-aspect-ratio: 1/1) {
    flex-direction: row;
    bottom: 0;
    width: 100%;
    height: 20%;
  }

  @media (max-width: 400px) {
    padding: 10px;
  }
`;

const Button = styled.button`
  outline: none;
  color: white;
  opacity: 1;
  background: transparent;
  background-color: transparent;
  background-position-x: 0%;
  background-position-y: 0%;
  background-repeat: repeat;
  background-image: none;
  padding: 0;
  text-shadow: 0px 0px 4px black;
  background-position: center center;
  background-repeat: no-repeat;
  pointer-events: auto;
  cursor: pointer;
  z-index: 2;
  filter: invert(100%);
  border: none;

  &:hover {
    opacity: 0.7;
  }
`;

const TakePhotoButton = styled(Button)`
  background: url('https://img.icons8.com/ios/50/000000/compact-camera.png');
  background-position: center;
  background-size: 50px;
  background-repeat: no-repeat;
  width: 80px;
  height: 80px;
  border: solid 4px black;
  border-radius: 50%;

  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const ImagePreview = styled.div<{ image: string | null }>`
  width: 120px;
  height: 120px;
  ${({ image }) => (image ? `background-image:  url(${image});` : '')}
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  @media (max-width: 400px) {
    width: 50px;
    height: 120px;
  }
`;

const CameraOpener = () => {
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const camera = useRef<CameraType>(null);
  const [errorMessages] = useState<object>({});
  const [text, setText] = useState<string | null>(null);

  return (
    <Wrapper>
      <Camera ref={camera} errorMessages={errorMessages} facingMode="environment" aspectRatio="cover" numberOfCamerasCallback={setNumberOfCameras} />
      <Control>
        <ImagePreview image={image} />
        {text !== '' && <div style={{color: "white"}}>{text}</div>}
        <TakePhotoButton
          onClick={() => {
            if (camera.current) {
              const photo = camera.current.takePhoto();
              console.log(photo);
              setImage(photo);
              (async () => {
                const worker = await Tesseract.createWorker('eng');
                const ret = await worker.recognize(photo);
                setText(ret.data.text);
                await worker.terminate();
                const response = await fetch('/wines', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({message: "cauliflower, broccoli, and carrots"}),
                });

                const data = await response.json();
                console.log("fetch data from server", data);
  
              })();
            }

          }}
        />
      </Control>
    </Wrapper>
  );
};

export default CameraOpener;
