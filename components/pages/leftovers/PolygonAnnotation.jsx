/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Circle, Group, Line } from 'react-konva';
import { useSelector } from 'react-redux';

/**
 *
 * @param {minMaxX} props
 * minMaxX[0]=>minX
 * minMaxX[1]=>maxX
 *
 */
const PolygonAnnotation = (props) => {
  const {
    points,
    flattenedPoints,
    isFinished,
    handlePointDragMove,
    handleGroupDragEnd,
    handleMouseOverStartPoint,
    handleMouseOutStartPoint,
  } = props;

  const reduxState = useSelector((state) => state);
  const vertexRadius = 6;
  const [stage, setStage] = useState();

  console.log(stage);

  const handleGroupMouseOver = (e) => {
    if (!isFinished) return;

    e.target.getStage().container().style.cursor = 'move';
    setStage(e.target.getStage());
  };

  const handleGroupMouseOut = (e) => {
    e.target.getStage().container().style.cursor = 'default';
  };

  // const [minMaxX, setMinMaxX] = useState([0, 0]); // min and max in x axis
  // const [minMaxY, setMinMaxY] = useState([0, 0]); // min and max in y axis

  // const minMaxX = [0, 0];
  // const minMaxY = [0, 0];

  const handleGroupDragStart = () => {
    const arrX = points.map((p) => p[0]);
    const arrY = points.map((p) => p[1]);

    console.log(arrX);
    console.log(arrY);
    // setMinMaxX(minMax(arrX));
    // setMinMaxY(minMax(arrY));
  };

  // const groupDragBound = (pos) => {
  //   let { x, y } = pos;
  //   const sw = stage?.width();
  //   const sh = stage?.height();

  //   if (minMaxY[0] + y < 0) y = -1 * minMaxY[0];

  //   if (minMaxX[0] + x < 0) x = -1 * minMaxX[0];

  //   if (minMaxY[1] + y > sh) y = sh - minMaxY[1];

  //   if (minMaxX[1] + x > sw) x = sw - minMaxX[1];

  //   return { x, y };
  // };

  return (
    <Group
      name="polygon"
      draggable={isFinished}
      onDragStart={handleGroupDragStart}
      onDragEnd={handleGroupDragEnd}
      // dragBoundFunc={groupDragBound}
      onMouseOver={handleGroupMouseOver}
      onMouseOut={handleGroupMouseOut}
    >
      <Line
        points={flattenedPoints}
        stroke={reduxState.appStates.theme?.palette.primary.main}
        strokeWidth={3}
        closed={isFinished}
        fill={reduxState.appStates.theme?.palette.primary.lightest}
      />
      {
        points?.map((point, index) => {
          const x = point[0] - vertexRadius / 2;
          const y = point[1] - vertexRadius / 2;

          const startPointAttr =
      index === 0
        ? {
          hitStrokeWidth: 12,
          onMouseOver: handleMouseOverStartPoint,
          onMouseOut: handleMouseOutStartPoint,
        }
        : null;

          return (
            <Circle
              key={index}
              x={x}
              y={y}
              radius={20}
              fill={reduxState.appStates.theme?.palette.primary.lightest}
              stroke={reduxState.appStates.theme?.palette.primary.main}
              strokeWidth={2}
              draggable
              onDragMove={handlePointDragMove}
              dragBoundFunc={(pos) => console.log(pos)}
              {...startPointAttr}
            />
          );
        })
      }
    </Group>
  );
};

export default PolygonAnnotation;
