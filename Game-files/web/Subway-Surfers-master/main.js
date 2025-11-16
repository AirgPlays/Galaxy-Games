var currentPos = 0;var currentLane = 0;
var spacelock = 0;var crouchlock = 0;
var camera_y = 4;
var crouchY = 0;
var spaceY = 0;
var counter_c = 0;
var tracks = [];
var coins = [];
var buildings = [];
var trains = [];
var barricades = [];
var barricades2 = [];
var bigwall = [];
var jumpingboot = [];
var jetpack = [];
var bush = [];
var coins_score = 0;
var speed = 0.0;
var jumpingboost = 0;var jetpackboost = 0;
var flash_period = 1;var flash = 0;
var grey = 0;
var dead = 0;
var watchman;
main();
//
// Start here
//
function callDead(flag) {
    $("#canvasDiv").html("<h1>Game Over</h1>");
    if(flag==1){
    	$("#canvasDiv").html("<h1>Game Over</h1><br><h2>Police Caught You</h2>");
    }
    dead = 1;
    document.getElementById('music').pause();
    document.getElementById('coin').pause();
    document.getElementById('crash').play();
}

function main() {
    if(dead)return;
    // document.getElementById('music').play();
    if(jetpackboost)
        document.getElementById('jump').play();
    if(jetpackboost)
        document.getElementById('jump').pause();

    if(currentPos >= 2000){
            $("#canvasDiv").html("YOU WIN</h2>");
            dead = 1;
    }
    const canvas = document.querySelector('#glcanvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    // If we don't have a GL context, give up now

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    // Vertex shader program

    const vsSource = `
        attribute vec4 aVertexPosition;
        attribute vec4 aVertexColor;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        varying lowp vec4 vColor;

        void main(void) {
          gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
          vColor = aVertexColor;
        }
    `;

    // Fragment shader program

    const fsSource = `
	    #ifdef GL_ES
	    precision mediump float;
	    #endif
    	precision mediump float;
        varying lowp vec4 vColor;
        uniform int uGrey;

        void main(void) {
        	if(uGrey == 1){
        		float gray = (vColor.r + vColor.g + vColor.b) / 3.0;
		        gl_FragColor = vec4(gray,gray,gray, vColor.a);
        	}
        	else
        		gl_FragColor = vColor;
        }
    `;




    const vsSourceTexture = `
        attribute vec4 aVertexPosition;
        attribute vec2 aTextureCoord;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        varying highp vec2 vTextureCoord;

        void main(void) {
          gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
          vTextureCoord = aTextureCoord;
        }
    `;

      // Fragment shader program

    const fsSourceTexture = `
        precision mediump float;
        varying highp vec2 vTextureCoord;

        uniform sampler2D uSampler;
        uniform int uGrey;
        uniform int uFlash;

        void main(void) {
          vec4 texture = texture2D(uSampler, vTextureCoord); 
          float sum = (texture.x+texture.y+texture.z)/3.0;
          vec4 grey = vec4(sum,sum,sum,texture.a);
          if(uGrey == 1)
            gl_FragColor = grey;
          else if(uFlash == 1){
            vec4 newcolor = vec4(0.0,0.0,0.0,1.0);
            newcolor.r = (pow(texture.r,0.9) - 0.3)*0.9 + 0.1 + 0.5;
            newcolor.g = (pow(texture.g,0.9) - 0.3)*0.9 + 0.1 + 0.5;
            newcolor.b = (pow(texture.b,0.9) - 0.3)*0.9 + 0.1 + 0.5;
            gl_FragColor = newcolor;
          }
          else
            gl_FragColor = texture;
        }
      `;


    // Initialize a shader program; this is where all the lighting
    // for the vertices and so forth is established.
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    const shaderProgramTexture = initShaderProgram(gl, vsSourceTexture, fsSourceTexture);


    // Collect all the info needed to use the shader program.
    // Look up which attributes our shader program is using
    // for aVertexPosition, aVevrtexColor and also
    // look up uniform locations.
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            uGrey: gl.getUniformLocation(shaderProgram, 'uGrey'),
        },
    };

    const programInfoTexture = {
    program: shaderProgramTexture,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgramTexture, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgramTexture, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgramTexture, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgramTexture, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgramTexture, 'uSampler'),
      uGrey: gl.getUniformLocation(shaderProgramTexture, 'uGrey'),
      uFlash: gl.getUniformLocation(shaderProgramTexture, 'uFlash'),
    },
  };

    Mousetrap.bind('w', function () {
        currentPos -= 0.1;
    });

    Mousetrap.bind('space', function () {
        if(spacelock==0)
            spacelock = 1;
    });

    Mousetrap.bind('a', function () {
        currentLane += 1;
        if(currentLane > 1)
            currentLane = 1;
        if(train_collision()==1){
            currentLane -= 1;
            if(speed < 0.14)
                callDead(1);
            watchman.speed = 0;
            watchman.currentPos = currentPos + 0.5;
            speed = 0.0005;
        }
    });

    Mousetrap.bind('d', function () {
        currentLane -= 1;
        if(currentLane < - 1)
            currentLane = -1;
        if(train_collision()==1){
            currentLane += 1;
            if(speed < 0.14)
                callDead(1);
            watchman.speed = 0;
            watchman.currentPos = currentPos + 0.5;
            speed = 0.0005;
        }
    });
    Mousetrap.bind('s', function () {
        // coins.push(Coin(gl,currentLane,0.35 - (0.25/2) + crouchY,currentPos + 1.3));
        if(crouchlock==0){
            crouchlock = 1;
            crouchY = -.2; 
        }
        // coins.push(Coin(gl,currentLane,0.35 - (0.25/2) + crouchY,currentPos + 1.3));
    });
    Mousetrap.bind('c', function () {
        if(camera_y == 4){
            camera_y = 0;
        }
        else
            camera_y = 4;
    });
	Mousetrap.bind('g', function () {
		if(grey==0)
			grey = 1;
		else
			grey = 0;
    });

     // Here's where we call the routine that builds all the
    // objects we'll be drawing.

    // var i= 4;
    // cubeArr.push(Cube(gl,i, -i));
    //----------------------------//
    //----------------------------//
    //scene creation object creation
    
    var player = Player(gl,0);
    watchman = Watchman(gl,0);

    //textures
    const track_texture = loadTexture(gl, 'texture/rail-texture.jpg');
    const train_texture = loadTexture(gl, 'texture/train-texture.jpg');
    const building_texture = loadTexture(gl, 'texture/wall-texture2.jpg');
    const barricade_texture = loadTexture(gl, 'texture/barricade-2.png');
    const bigwall_texture = loadTexture(gl, 'texture/big-wall-texture.jpeg');
    const jumpingboot_texture = loadTexture(gl, 'texture/boot.png');
    const jetpack_texture = loadTexture(gl, 'texture/jetpack.png');
    const bush_texture = loadTexture(gl, 'texture/bush.png');

    //tracks
    tracks.push(Cube(gl,track_texture,0));
    tracks.push(Cube(gl,track_texture,1));
    tracks.push(Cube(gl,track_texture,2));

    //buildings
    // Building(gl,xl,zl,width,height,breadth)
	buildings.push(Building(gl,building_texture,-4.2,1,20000,2,1.2));
	buildings.push(Building(gl,building_texture,4.2,1,20000,2,1.2));

	//coins
    for(var i=0;i<1000;i++)
    	coins.push(Coin(gl,Math.floor((Math.random() * 3)) - 1,0,-i*1.2));

    // Train(gl,xl,zl,width,height,breadth)
    for(var i=1;i<160;i+=2){
        trains.push(Train(gl,train_texture,Math.floor((Math.random() * 3)) - 1,-1*i*getRandomInt(8,20),2,1.3,1,getRandomInt(0,1)*0.1));   
    }

    // Barricade(gl,xl,zl,height)
    for(var i=2;i<50;i++)
        barricades.push(Barricade(gl,barricade_texture,getRandomInt(-1,1),-i*getRandomInt(30,40),0.3));

    barricades2.push(Barricade(gl,barricade_texture,0,-27,-0.3));
    for(var i=2;i<50;i++)
        barricades2.push(Barricade(gl,barricade_texture,getRandomInt(-1,1),-i*getRandomInt(30,40),-0.3));

    // BigWall(gl,texture,zl,type)
    for(var i=2;i<10;i++)
        bigwall.push(BigWall(gl,bigwall_texture,-i*getRandomInt(48,50)*2,Math.floor((Math.random() * 3) - 1)));
    
    // Boot(gl,texture,xl,zl)
    jumpingboot.push(Boot(gl,jumpingboot_texture,0,0,-50));
    jumpingboot.push(Boot(gl,jumpingboot_texture,0,0,-400));

    // Jetpack(gl,texture,xl,zl)
    jetpack.push(Jetpack(gl,jetpack_texture,1,0,-180));
    jetpack.push(Jetpack(gl,jetpack_texture,1,0,-650));
    jetpack.push(Jetpack(gl,jetpack_texture,1,0,-1250));

    // Bush(gl,texture,xl,zl)
    for(var i=2;i<68;i+=2)
        bush.push(Bush(gl,bush_texture,Math.floor((Math.random() * 3)) - 1,-i*getRandomInt(30,40)));
    //----------------------------//
    //testing
        // coins.push(Coin(gl,currentLane,0.35 - (0.25/2) + crouchY,currentPos + 1.3));


    //----------------------------//
    var then = 0;
    var count = 120;

    // Draw the scene repeatedly
    function render(now) {
        if(dead)return;
        //crouchlock
        if(crouchlock>=1)crouchlock++;
        if(crouchlock % 50 == 0){
            crouchlock = 0;
            crouchY = 0;
        }
        if(jumpingboost==0){
            if(spacelock >=1)spacelock++;

            if(spacelock >= 1 && spacelock%60 < 20){
             spaceY += 0.1;
             spacelock = spacelock % 60;
            }

            if(spacelock >= 1 && spacelock%60 > 20){
             spaceY -= 0.05;
             if(Math.round(spaceY*100)/100 <= -0.05){
                spaceY = 0.00;
               }
             console.log(Math.round(spaceY*100)/100)
             spacelock = spacelock % 60;
            }
        }
        if(jumpingboost!=0){
            if(spacelock >=1)spacelock++;

            if(spacelock >= 1 && spacelock%60 <= 20){
             spaceY += 0.15;
             spacelock = spacelock % 60;
            }

            if(spacelock >= 1 && spacelock%60 > 20){
             // console.log(Math.round(spaceY*1000)/1000);
             spaceY -= 0.075;
             if(Math.round(spaceY*1000)/1000 <= -0.075)
                spaceY -= 0.075;
             spacelock = spacelock % 60;
            }
            jumpingboost++;
            if(jumpingboost%600==0){
                jumpingboost = 0;
            }
        }
        if(jetpackboost!=0){
            jetpackboost++;
            if(jetpackboost%600==0){
                    jetpackboost = 0;
            }
        }
        if(flash_period!=0){
            flash_period++;
            if(flash_period%300==120){
                    flash = 1;
            }
            if(flash_period%300==240){
                    flash = 0;
                    flash_period = 1;
            }

        } 

 

    	//camera and perspective setup
	    const fieldOfView = 45 * Math.PI / 180;   // in radians
	    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	    const zNear = 0.1;
	    const zFar = 100.0;

	    const projectionMatrix = mat4.create();
	    const viewProjectionMatrix = mat4.create();
	    mat4.perspective(projectionMatrix,
	        fieldOfView,
	        aspect,
	        zNear,
	        zFar);

	    const cameraMatrix = mat4.create();
	    mat4.translate(cameraMatrix,cameraMatrix,[0,camera_y,8 + currentPos]);
	    var camera_position =[
	    	cameraMatrix[12],
	    	cameraMatrix[13],
	    	cameraMatrix[14],
	    ]

	    var up = [0,1,0];
	    mat4.lookAt(cameraMatrix,camera_position,[0,0,0 + currentPos],up);
	    mat4.multiply(viewProjectionMatrix,projectionMatrix,cameraMatrix);	
        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;

        gl.clearColor(188/255, 219/255, 235/255, 1.0);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

        // Clear the canvas before we start drawing on it.



        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // drawScene(gl, programInfo, bufer, deltaTime);
        detect_collision();
        
        drawPlayer(gl,viewProjectionMatrix, programInfo, player, deltaTime);
        drawWatchman(gl,viewProjectionMatrix, programInfo, watchman, deltaTime);
        for (var j = 0; j < tracks.length; ++j) {
                drawCube(gl,viewProjectionMatrix, programInfoTexture, tracks[j], deltaTime);
        }
        for (var j = 0; j < buildings.length; ++j) {
                drawBuilding(gl,viewProjectionMatrix, programInfoTexture, buildings[j], deltaTime,flash);
        }

        for (var j = 0; j < coins.length; ++j) {
                drawCoin(gl, viewProjectionMatrix,programInfo, coins[j], deltaTime);
        }
        for (var j = 0; j < jumpingboot.length; ++j) {
                drawBoot(gl, viewProjectionMatrix,programInfoTexture, jumpingboot[j], deltaTime);
        }
        for (var j = 0; j < jetpack.length; ++j) {
                drawJetpack(gl, viewProjectionMatrix,programInfoTexture, jetpack[j], deltaTime);
        }
        for (var j = 0; j < trains.length; ++j) {
                drawTrain(gl, viewProjectionMatrix,programInfoTexture, trains[j], deltaTime,0.00);
        }
        for (var j = 0; j < barricades.length; ++j) {
                drawBarricade(gl, viewProjectionMatrix,programInfoTexture, barricades[j], deltaTime);
        }
        for (var j = 0; j < barricades2.length; ++j) {
                drawBarricade(gl, viewProjectionMatrix,programInfoTexture, barricades2[j], deltaTime);
        }
        for (var j = 0; j < bigwall.length; ++j) {
                drawBigWall(gl, viewProjectionMatrix,programInfoTexture, bigwall[j], deltaTime);
        }
        for (var j = 0; j < bush.length; ++j) {
                drawBush(gl, viewProjectionMatrix,programInfoTexture, bush[j], deltaTime);
        }

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    // Send the source to the shader object

    gl.shaderSource(shader, source);

    // Compile the shader program

    gl.compileShader(shader);

    // See if it compiled successfully

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

