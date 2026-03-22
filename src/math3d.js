export function project3d(x, y, gridWidth, gridHeight, params) {
  const { rotateX, rotateY, perspective, twistAmount, twistAxisAngle } = params;

  // Step 1: Center point at origin
  let cx = x - gridWidth / 2;
  let cy = y - gridHeight / 2;
  let cz = 0;

  // Step 2: Compute twist
  const axisAngleRad = twistAxisAngle * Math.PI / 180;
  const axisX = Math.cos(axisAngleRad);
  const axisY = Math.sin(axisAngleRad);
  const distAlongAxis = cx * axisX + cy * axisY;
  const twistRotation = distAlongAxis * twistAmount * 0.01;
  const twistRad = twistRotation;
  const cosTwist = Math.cos(twistRad);
  const sinTwist = Math.sin(twistRad);
  const twistX = cx * cosTwist - cy * sinTwist;
  const twistY = cx * sinTwist + cy * cosTwist;
  cx = twistX;
  cy = twistY;

  // Step 3: Rotate around X axis
  const rxRad = rotateX * Math.PI / 180;
  const cosRx = Math.cos(rxRad);
  const sinRx = Math.sin(rxRad);
  const y1 = cy * cosRx - cz * sinRx;
  const z1 = cy * sinRx + cz * cosRx;
  cy = y1;
  cz = z1;

  // Step 4: Rotate around Y axis
  const ryRad = rotateY * Math.PI / 180;
  const cosRy = Math.cos(ryRad);
  const sinRy = Math.sin(ryRad);
  const x2 = cx * cosRy + cz * sinRy;
  const z2 = -cx * sinRy + cz * cosRy;
  cx = x2;
  cz = z2;

  // Step 5: Perspective projection
  const d = perspective;
  let scaleFactor = d / (d + cz);
  scaleFactor = Math.max(0.01, scaleFactor);

  // Step 6: Project back to screen space
  const projX = cx * scaleFactor + gridWidth / 2;
  const projY = cy * scaleFactor + gridHeight / 2;

  return {
    x: projX,
    y: projY,
    scale: scaleFactor,
    depth: cz,
    twistRotation: twistRotation * 180 / Math.PI,
  };
}
