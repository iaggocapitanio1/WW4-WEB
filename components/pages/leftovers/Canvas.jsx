/* eslint-disable react/prop-types */
import { Box, Button } from '@mui/material';
import { Undo } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Layer, Stage } from 'react-konva';
import PolygonAnnotation from './PolygonAnnotation';

function checkDuplicateCoordinates (coordinates) {
  const visitedCoordinates = new Set();
  let hasDuplicates = false;

  for (let i = 0; i < coordinates?.length; i++) {
    const coordinate = coordinates[i];
    // Convert coordinate to string for Set comparison
    const coordinateString = JSON.stringify(coordinate);

    if (visitedCoordinates.has(coordinateString)) {
      hasDuplicates = true;

      break;
    }

    visitedCoordinates.add(coordinateString);
  }

  return hasDuplicates;
}

const Canvas = (props) => {
  const [image, setImage] = useState();
  const imageRef = useRef(null);
  const dataRef = useRef(null);
  const [points, setPoints] = useState(props?.leftover?.corners?.coordinates) || [];
  const [size, setSize] = useState({});
  const [flattenedPoints, setFlattenedPoints] = useState();
  const [position, setPosition] = useState([0, 0]);
  const [isMouseOverPoint, setMouseOverPoint] = useState(false);
  const [isPolyComplete, setPolyComplete] = useState(checkDuplicateCoordinates(points));

  const videoElement = useMemo(() => {
    const element = new window.Image();

    element.src = props?.leftover?.file;

    return element;
  }, []); // it may come from redux

  useEffect(() => {
    const onload = function () {
      setSize({
        width: videoElement.width,
        height: videoElement.height,
      });

      setImage(videoElement);
      imageRef.current = videoElement;
    };

    videoElement.addEventListener('load', onload);

    return () => {
      videoElement.removeEventListener('load', onload);
    };
  }, [videoElement, props.leftover]);

  const getMousePos = (stage) => {
    return [stage.getPointerPosition().x, stage.getPointerPosition().y];
  };

  // drawing begins when mousedown event fires.
  const handleMouseDown = (e) => {
    if (isPolyComplete) return;

    const stage = e.target.getStage();
    const mousePos = getMousePos(stage);

    if (isMouseOverPoint && points.length >= 3) {
      setPolyComplete(true);
    } else {
      setPoints([...points, mousePos]);
    }
  };

  const handleMouseMove = (e) => {
    const stage = e.target.getStage();
    const mousePos = getMousePos(stage);

    setPosition(mousePos);
  };

  const handleMouseOverStartPoint = (e) => {
    if (isPolyComplete || points.length < 3) return;

    e.target.scale({ x: 3, y: 3 });
    setMouseOverPoint(true);
  };

  const handleMouseOutStartPoint = (e) => {
    e.target.scale({ x: 1, y: 1 });
    setMouseOverPoint(false);
  };

  const handlePointDragMove = (e) => {
    const stage = e.target.getStage();
    const index = e.target.index - 1;
    const pos = [e.target._lastPos.x, e.target._lastPos.y];

    if (pos[0] < 0) pos[0] = 0;

    if (pos[1] < 0) pos[1] = 0;

    if (pos[0] > stage?.width()) pos[0] = stage?.width();

    if (pos[1] > stage?.height()) pos[1] = stage?.height();

    setPoints([...points.slice(0, index), pos, ...points.slice(index + 1)]);
  };

  useEffect(() => {
    setFlattenedPoints(
      points?.concat(isPolyComplete ? [] : position).reduce((a, b) => a.concat(b), [])
    );
  }, [points]);

  const undo = () => {
    setPoints(points?.slice(0, -1));
    setPolyComplete(false);
  };

  const handleGroupDragEnd = (e) => {
    // drag end listens other children circles' drag end event
    // ...that's, why 'name' attr is added, see in polygon annotation part
    if (e.target.name() === 'polygon') {
      const result = [];
      const copyPoints = [...points];

      copyPoints.map((point) => result.push([point[0] + e.target.x(), point[1] + e.target.y()]));
      e.target.position({ x: 0, y: 0 }); // needs for mouse position otherwise when click undo you will see that mouse click position is not normal:)
      setPoints(result);
    }
  };

  const showCoordinates = () => {
    if (isPolyComplete) dataRef.current.style.display = '';
  };

  return (
    <>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Stage
          width={size.width}
          height={size.height}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
        >
          <Layer>
            <Image ref={imageRef} image={image} x={0} y={0} width={size.width} height={size.height} />
            <PolygonAnnotation
              points={points}
              flattenedPoints={flattenedPoints}
              handlePointDragMove={handlePointDragMove}
              handleGroupDragEnd={handleGroupDragEnd}
              handleMouseOverStartPoint={handleMouseOverStartPoint}
              handleMouseOutStartPoint={handleMouseOutStartPoint}
              isFinished={isPolyComplete}
            />
          </Layer>
        </Stage>
        <button style={{ marginTop: 20, display: 'none' }} onClick={showCoordinates}>
        Coordinates
        </button>
        <Box
          ref={dataRef}
          style={{ display: 'none', width: 400, boxShadow: '7px 7px 5px .4em rgba(0,0,0,.1)' }}
        >
          <pre>{}</pre>
        </Box>
      </Box>
      <Button onClick={undo} >
        <Undo />
      </Button>
    </>

  );
};

export default Canvas;
