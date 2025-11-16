function BigWall(gl,texture,zl,type) {

    // Create a buffer for the cube's vertex positions.

    const positionBuffer = gl.createBuffer();

    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Now create an array of positions for the cube.
    var breadth = 7;
    var width = 2.3;
    var height = 1.5;
    var left_wall_width;
    var right_wall_width;
    if(type==0){
        left_wall_width = 2.7;
        right_wall_width = 2.7;
    }
    if(type==1){
        left_wall_width = 5.4;
        right_wall_width = 0;
    }
    if(type==-1){
        left_wall_width = 0;
        right_wall_width = 5.4;
    }

    const positions = [
        // Front face
        -breadth/2, height -0.4,  width/2,
         breadth/2, height -0.4,  width/2,
         breadth/2, height, width/2,
        -breadth/2, height, width/2,

        // Back face
        -breadth/2, height -0.4, -width/2,
        -breadth/2, height,-width/2,
         breadth/2, height,-width/2,
         breadth/2, height -0.4, -width/2,

        // Top face
        -breadth/2, height, -width/2,
        -breadth/2, height, width/2,
         breadth/2, height, width/2,
         breadth/2, height, -width/2,

        // Bottom face
        -breadth/2, height - 0.4, -width/2,
         breadth/2, height - 0.4, -width/2,
         breadth/2, height - 0.4,  width/2,
        -breadth/2, height - 0.4,  width/2,

        // Righ2 face
         breadth/2, height - 0.4, -width/2,
         breadth/2, height,-width/2,
         breadth/2, height, width/2,
         breadth/2, height - 0.4,  width/2,

        // Left face
        -breadth/2, height - 0.4, -width/2,
        -breadth/2, height - 0.4,  width/2,
        -breadth/2, height, width/2,
        -breadth/2, height,-width/2,

        //left side

        //left
        -breadth/2, -0.50, -width/2,
        -breadth/2, -0.50,  width/2 + 0.1,
        -breadth/2, height, width/2 + 0.1,
        -breadth/2, height,-width/2,

        //right
        -breadth/2 + left_wall_width, -0.50, -width/2,
        -breadth/2 + left_wall_width, -0.50,  width/2,
        -breadth/2 + left_wall_width, height, width/2,
        -breadth/2 + left_wall_width, height,-width/2,

        //fronnt

        -breadth/2 + left_wall_width, height,  width/2,
        -breadth/2 + left_wall_width, -0.50,  width/2,
        -breadth/2, height, width/2,
        -breadth/2, -0.50, width/2,

        //right side

        //right
        breadth/2, -0.50, -width/2,
        breadth/2, -0.50,  width/2,
        breadth/2, height, width/2,
        breadth/2, height,-width/2,

        //left
        breadth/2 - right_wall_width, -0.50, -width/2,
        breadth/2 - right_wall_width, -0.50,  width/2,
        breadth/2 - right_wall_width, height, width/2,
        breadth/2 - right_wall_width, height,-width/2,

        //fronnt

        breadth/2 - right_wall_width, height,  width/2,
        breadth/2 - right_wall_width, -0.50,  width/2,
        breadth/2, height, width/2,
        breadth/2, -0.50, width/2,

    ];

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

    const textureCoordinates = [
    // Front
    0.0,  0.0,
    0.0,  0.0,
    0.0,  0.0,
    0.0,  0.0,
    // Back
    0.0,  0.0,
    0.0,  0.0,
    0.0,  0.0,
    0.0,  0.0,
    // Top
    0.0,  0.0,
    0.0,  0.0,
    0.0,  0.0,
    0.0,  0.0,
    // Bottom
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Right
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Left
    0.0,  0.0,
    0.0,  1.0,
    .10,  1.0,
    1.0,  0.0,

    //left

    //left
    0.0,  0.0,
    0.0,  1.0,
    1.0,  1.0,
    1.0,  0.0,

    //right
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Front
    1.0,  0.0,
    0.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

    //right

    //right
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

    //left
    0.0,  0.0,
    0.0,  1.0,
    1.0,  1.0,
    1.0,  0.0,

    // Front
    1.0,  0.0,
    0.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
  ];
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                gl.STATIC_DRAW);
    

    // Build the element array buffer; this specifies the indices
    // into the vertex arrays for each face's vertices.

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.

    const indices = [
        0, 1, 2, 0, 2, 3,    // front
        4, 5, 6, 4, 6, 7,    // back
        8, 9, 10, 8, 10, 11,   // top
        12, 13, 14, 12, 14, 15,   // bottom
        16, 17, 18, 16, 18, 19,   // right
        20, 21, 22, 20, 22, 23,   // left
        24, 25, 26, 24, 26, 27,
        28, 29, 30, 28, 30, 31,
        32, 33, 34, 33, 34, 35,
        36, 37, 38, 36, 38, 39,
        40, 41, 42, 40, 42, 43,
        44, 45, 46, 45, 46, 47,
    ];

    // Now send the element array to GL

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices), gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        textureCoord: textureCoordBuffer,
        indices: indexBuffer,
        texture: texture,
        z:zl,
        type:type,
    };
}

function drawBigWall(gl,vp, programInfo, buffers, deltaTime) {

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.

   
    const modelViewMatrix = mat4.create();
    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    // mat4.rotate(modelViewMatrix,  // destination matrix
    //     modelViewMatrix,  // matrix to rotate
    //     50*Math.PI/180,// amount to rotate in radians
    //     [1, 0, 0]);       // axis to rotate around (X)

    mat4.translate(modelViewMatrix,     // destination matrix
        modelViewMatrix,     // matrix to translate
        [0, 0,buffers.z]);  // amount to translate

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
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
        gl.vertexAttribPointer(
            programInfo.attribLocations.textureCoord,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.textureCoord);
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

    gl.activeTexture(gl.TEXTURE0);

    // Bind the texture to texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, buffers.texture);


    // Tell the shader we bound the texture to texture unit 0
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
    gl.uniform1i(programInfo.uniformLocations.uGrey, grey);

    {
        const vertexCount = 72;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
    gl.uniform1i(programInfo.uniformLocations.uFlash, 0);
    gl.uniform1i(programInfo.uniformLocations.uGrey, 0);
    // Update the rotation for the next draw

    // cubeRotation += deltaTime;
    // cubePositionz += 10 * deltaTime;
    // cubeA += deltaTime;
}