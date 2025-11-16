function Coin(gl,xl,yl,zl) {

    // Create a buffer for the cube's vertex positions.

    const positionBuffer = gl.createBuffer();

    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Now create an array of positions for the cube.

    var n = 20;
    var i = 0;
    var angle = Math.PI*2/n;
    var positions = [];
    var x1 = 0.0, y1 = 0.02;
    var x2 = -Math.sin(angle)*y1, y2 = Math.cos(angle)*y1;

    for(i=0; i<9*n; i+=9){

        positions[i] = 0.0;
        positions[i + 1] = 0.0;
        positions[i + 2] = 0.0; 

        positions[i + 3] = x1;
        positions[i + 4] = y1;
        positions[i + 5] = 0.0;

        positions[i + 6] = x2;
        positions[i + 7] = y2;
        positions[i + 8] = 0.0;

        x1 = x2;
        y1 = y2;
        x2 = Math.cos(angle)*x1 - Math.sin(angle)*y1;
        y2 = Math.sin(angle)*x1 + Math.cos(angle)*y2;
    };

    // positions = [];

    // positions = [
    // 0.05, 0.05,0,
    // -0.05, 0.05,0,
    // 0.05, -0.05,0,

    // -0.05, 0.05,0,
    // 0.05, -0.05,0,
    // -0.05, -0.05,0,
    // ]

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Now set up the colors for the faces. We'll use solid colors
    // for each face.
    var faceColors = [];
    for(i=0;i<n;i++){
        faceColors.push([255/255, 215/255, 0/255, 1.0]);
    }
    // const faceColors = [
    //     [1.0, 0.0, 0.0, 1.0],    // Front face: red
    //     [1.0, 0.0, 0.0, 1.0],    // Back
    // ];

    // Convert the array of colors into a table for all the vertices.

    var colors = [];

    for (var j = 0; j < faceColors.length; ++j) {
        const c = faceColors[j];

        // Repeat each color four times for the four vertices of the face
        colors = colors.concat(c,c,c);
    }

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    // Build the element array buffer; this specifies the indices
    // into the vertex arrays for each face's vertices.

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.


    const indices= Array.apply(null, {length: 3*n}).map(Number.call, Number);
    // Now send the element array to GL

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices), gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        color: colorBuffer,
        indices: indexBuffer,
        y:yl,
        x:xl,
        z:zl,
    };
}

function drawCoin(gl,vp, programInfo, buffers, deltaTime) {

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.

    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    const viewMatrix = mat4.create();
    const modelViewMatrix = mat4.create();

    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar);



    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    mat4.translate(modelViewMatrix,     // destination matrix
        modelViewMatrix,     // matrix to translate
        [2.7*buffers.x, buffers.y,buffers.z]);  // amount to translate
    mat4.scale(modelViewMatrix,modelViewMatrix,[10,10,1])

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute
    {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexPosition);
    }

    // Tell WebGL how to pull out the colors from the color buffer
    // into the vertexColor attribute.
    {
        const numComponents = 4;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexColor,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexColor);
    }

    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    // Tell WebGL to use our program when drawing

    gl.useProgram(programInfo.program);

    // Set the shader uniforms

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        vp);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);
    gl.uniform1i(programInfo.uniformLocations.uGrey, grey);
    {
        const vertexCount = 3*20;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
    gl.uniform1i(programInfo.uniformLocations.uGrey, 0);

    // Update the rotation for the next draw

    // cubeRotation += deltaTime;
    // cubePositionz += 10 * deltaTime;
    // cubeA += deltaTime;
}