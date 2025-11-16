function Watchman(gl,xl) {

    // Create a buffer for the cube's vertex positions.

    const positionBuffer = gl.createBuffer();

    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Now create an array of positions for the cube.

    var positions = []

    //head
    positions.push.apply(positions,cuboid_array_generator(0.25,0.25,0.25,0,0.35,0));
    // torso
    positions.push.apply(positions,cuboid_array_generator(0.40,0.50,0.50,0,0,0));

    // left leg
    positions.push.apply(positions,cuboid_array_generator(0.10,0.50,0.10,-0.1,-0.35,0));
    // right leg
    positions.push.apply(positions,cuboid_array_generator(0.10,0.50,0.10,0.1,-0.35,0));

    // left hand
    positions.push.apply(positions,cuboid_array_generator(0.10,0.30,0.10,-0.25,0,0));
    // right hand
    positions.push.apply(positions,cuboid_array_generator(0.10,0.30,0.10,0.25,0,0));
    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Now set up the colors for the faces. We'll use solid colors
    // for each face.

    const faceColors = [
        [0.94, 0.94, 0.50, 1.0],    // Front face: red
        [0.94, 0.94, 0.50, 1.0],    // Back
        [0.94, 0.94, 0.50, 1.0],    // Top
        [0.94, 0.94, 0.50, 1.0],    // Bottom
        [0.94, 0.94, 0.50, 1.0],    // Left
        [0.94, 0.94, 0.50, 1.0], 
           // Right
        [0.16, 0.40, 0.17, 1.0],    // Front face: red
        [0.16, 0.40, 0.17, 1.0],    // Back
        [0.16, 0.40, 0.17, 1.0],    // Top
        [0.16, 0.40, 0.17, 1.0],    // Bottom
        [0.16, 0.40, 0.17, 1.0],    // Left
        [0.16, 0.40, 0.17, 1.0],    // Right

        [0.0, 0.0, 1.0, 1.0],    // Front face: red
        [0.0, 0.0, 1.0, 1.0],    // Back
        [0.0, 0.0, 1.0, 1.0],    // Top
        [0.0, 0.0, 1.0, 1.0],    // Bottom
        [0.0, 0.0, 1.0, 1.0],    // Left
        [0.0, 0.0, 1.0, 1.0],    // Right

        [0.0, 0.0, 1.0, 1.0],    // Front face: red
        [0.0, 0.0, 1.0, 1.0],    // Back
        [0.0, 0.0, 1.0, 1.0],    // Top
        [0.0, 0.0, 1.0, 1.0],    // Bottom
        [0.0, 0.0, 1.0, 1.0],    // Left
        [0.0, 0.0, 1.0, 1.0],    // Right

        [1.0, 1.0, 0.5, 1.0],    // Front face: red
        [1.0, 1.0, 0.5, 1.0],    // Back
        [1.0, 1.0, 0.5, 1.0],    // Top
        [1.0, 1.0, 0.5, 1.0],    // Bottom
        [1.0, 1.0, 0.5, 1.0],    // Left
        [1.0, 1.0, 0.5, 1.0],

        [1.0, 1.0, 0.5, 1.0],    // Front face: red
        [1.0, 1.0, 0.5, 1.0],    // Back
        [1.0, 1.0, 0.5, 1.0],    // Top
        [1.0, 1.0, 0.5, 1.0],    // Bottom
        [1.0, 1.0, 0.5, 1.0],    // Left
        [1.0, 1.0, 0.5, 1.0],


    ];

    // Convert the array of colors into a table for all the vertices.

    var colors = [];

    for (var j = 0; j < faceColors.length; ++j) {
        const c = faceColors[j];

        // Repeat each color four times for the four vertices of the face
        colors = colors.concat(c, c , c, c);
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
    var ptr=0;
    var indices = [];
    for(var i=0;i<6*6*4;i+=4){
        indices[ptr++] = i;
        indices[ptr++] = i+1;
        indices[ptr++] = i+2;
        indices[ptr++] = i;
        indices[ptr++] = i+2;
        indices[ptr++] = i+3;
    }
    // const indices = [
    //     0, 1, 2, 0, 2, 3,    // front
    //     4, 5, 6, 4, 6, 7,    // back
    //     8, 9, 10, 8, 10, 11,   // top
    //     12, 13, 14, 12, 14, 15,   // bottom
    //     16, 17, 18, 16, 18, 19,   // right
    //     20, 21, 22, 20, 22, 23,   // left
    // ];

    // Now send the element array to GLb

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices), gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        color: colorBuffer,
        indices: indexBuffer,
        x:xl,
        currentPos: 0,
        speed:0.0004,
    };
}

function drawWatchman(gl,vp,programInfo, buffers, deltaTime) {

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.

   
    const modelViewMatrix = mat4.create();
    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    if(buffers.speed < 0.0900)
    {
        buffers.speed += 0.0003;
        buffers.speed = Math.round(buffers.speed*10000)/10000;
    }
    else
        buffers.speed = 0.0900

    if(jetpackboost) buffers.speed = 0.4;
    buffers.currentPos -= buffers.speed;
    // currentPos = Math.round(currentPos*10000)/10000;
    mat4.translate(modelViewMatrix,modelViewMatrix,[-3*currentLane,-0.3,2.3 + buffers.currentPos]);

    // mat4.translate(modelViewMatrix,     // destination matrix
    //     modelViewMatrix,     // matrix to translate
    //     [0, 2.5*cos(45*Math.pi/180),0]);  // amount to translate

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
        const vertexCount = 36*6;
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