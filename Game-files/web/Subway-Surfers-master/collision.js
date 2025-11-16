function coin_collision(){
	var temp_z = 1.3 + currentPos;
	var temp_x = -3*currentLane;
	var temp_y = spaceY;
	if(jetpackboost)
		temp_y = spaceY + 2.0;
	//-rect1 player //-rect2 coin
	for(var i=0;i<coins.length;i++){
		if(temp_z - 0.25 <= coins[i].z && temp_z + 0.25 >= coins[i].z)
		{
			if(temp_y - 0.6 <= coins[i].y && temp_y + 0.6 >= coins[i].y)
			{
				if(-1*currentLane == coins[i].x)
				{
					coins.splice(i,1);
					coins_score += 1;
					document.getElementById('coin').play();
					$("#coins_score").text("Coins: " + coins_score.toString());
				}
			}
		}
	}
}
function bush_collision(){
	var temp_z =  1.3+currentPos;
	var temp_x = -3*currentLane;
	var temp_y = spaceY;
	if(jetpackboost)
		temp_y = spaceY + 2.0;
	//-rect1 player //-rect2 bush
	for(var i=0;i<bush.length;i++){
		if(bush[i].mark == 0)
		{
			if(temp_z - 0.2 <= bush[i].z && temp_z + 0.2500 >= bush[i].z) 
			{
				if(temp_y - 0.6000 <= bush[i].y && temp_y + 0.6000 >= bush[i].y)
				{
					if(-1*currentLane == bush[i].x)
					{
						bush[i].mark = 1;
						return 1;
					}
				}
			}
		}
	}
}
function boot_collision(){
	var temp_z =  1.3+currentPos;
	var temp_x = -3*currentLane;
	var temp_y = spaceY;
	if(jetpackboost)
		temp_y = spaceY + 2.0;
	//-rect1 player //-rect2 bush
	for(var i=0;i<jumpingboot.length;i++){
		if(jumpingboot[i].mark == 0)
		{
			if(temp_z - 0.2 <= jumpingboot[i].z && temp_z + 0.2500 >= jumpingboot[i].z) 
			{
				if(temp_y - 0.6000 <= jumpingboot[i].y && temp_y + 0.6000 >= jumpingboot[i].y)
				{
					console.log(1);
					if(-1*currentLane == jumpingboot[i].x)
					{
						jumpingboot[i].mark = 1;
						jumpingboot.splice(i,1);
						jumpingboost = 1;
					}
				}
			}
		}
	}
}
function jetpack_collision(){
	var temp_z =  1.3+currentPos;
	var temp_x = -3*currentLane;
	var temp_y = spaceY;
	if(jetpackboost)
		temp_y = spaceY + 2.0;
	//-rect1 player //-rect2 bush
	for(var i=0;i<jetpack.length;i++){
		if(jetpack[i].mark == 0)
		{
			if(temp_z - 0.2 <= jetpack[i].z && temp_z + 0.2500 >= jetpack[i].z) 
			{
				if(temp_y - 0.6000 <= jetpack[i].y && temp_y + 0.6000 >= jetpack[i].y)
				{
					if(-1*currentLane == jetpack[i].x)
					{
						jetpack[i].mark = 1;
						jetpack.splice(i,1);
						jetpackboost = 1;
					}
				}
			}
		}
	}
}
function bigwall_collision(){
	//-rect1 player //-rect2 coin
	var temp_z = Math.round((1.3 + currentPos)*100)/100;
	for(var i=0;i<bigwall.length;i++){
		// console.log(temp_z - 0.25 >= bigwall[i].z - 1.15 && temp_z - 0.25 <= bigwall[i].z + 1.15);
		if(temp_z - 0.25 >= bigwall[i].z - 1.15 && temp_z - 0.25 <= bigwall[i].z + 1.15)
		{
			console.log(bigwall[i].type,currentLane);
			if(bigwall[i].type != -1*currentLane)
			{
				if(jetpackboost==0)
					callDead();
			}
		}
	}
}

function train_collision(){
	//-rect1 player //-rect2 coin
	var temp_z = Math.round((1.3 + currentPos)*100)/100;
	var temp_y = spaceY;
	for(var i=0;i<trains.length;i++){
		if((temp_z - 0.25 >= (trains[i].z + trains[i].speed - trains[i].width/2)) && (temp_z - 0.25 <= (trains[i].z + trains[i].speed + trains[i].width/2)))
		{
			if(trains[i].x == -1*currentLane)
			{
				if(jumpingboost==1){
					if(temp_y - 0.6000 <= 1.3 && temp_y + 0.6000 >= 1.3)
						return 1;
				}
				if(jetpackboost==0 && jumpingboost==0)
						return 1;
			}
		}
	}
}
function barricade_collision(){
	//-rect1 player //-rect2 coin
	var temp_z = Math.round((1.3 + currentPos)*100)/100;
	var temp_x = -3*currentLane;
	var temp_y = spaceY;
	if(jetpackboost)
		temp_y = spaceY + 2.0;
	for(var i=0;i<barricades.length;i++){
		if(barricades[i].x == -1*currentLane && barricades[i].mark == 0){
			if(temp_z - 0.25 <= barricades[i].z + barricades[i].height/2 && temp_z + 0.25 >= barricades[i].z - barricades[i].height/2)
			{
				if(temp_y - 0.800 <= barricades[i].height + 0.4 && temp_y + 0.800 >= barricades[i].height + 0.4)
				{
					if(jetpackboost==0)
					{
						barricades[i].mark = 1;
						if(crouchY == 0)
							return 1;
					}
				}



			}
		}
	}
}
function barricade2_collision(){
	//-rect1 player //-rect2 coin
	var temp_z = Math.round((1.3 + currentPos)*100)/100;
	var temp_x = -3*currentLane;
	var temp_y = spaceY;
	if(jetpackboost)
		temp_y = spaceY + 2.0;
	for(var i=0;i<barricades2.length;i++){
		if(barricades2[i].x == -1*currentLane && barricades2[i].mark == 0){
			if(temp_z - 0.25 <= barricades2[i].z + barricades2[i].height/2 && temp_z + 0.25 >= barricades2[i].z - barricades2[i].height/2)
			{
				if(temp_y - 0.800 <= barricades2[i].height + 0.4 && temp_y + 0.800 >= barricades2[i].height + 0.4)
				{
					if(jetpackboost==0)
					{
						barricades2[i].mark = 1;
						if(crouchY == 0)
							return 1;
					}
				}



			}
		}
	}
}

function detect_collision(){
	coin_collision();
	boot_collision();
	jetpack_collision();
	if(bigwall_collision()==1){
		callDead();
	}
	if(barricade2_collision()==1){
		callDead();
	}
	if(barricade_collision()==1){
		console.log(speed);
		if(speed < 0.14)
			callDead(1);
		watchman.currentPos = currentPos + 1.2;
		watchman.speed = 0;
		speed = 0.0005;
	}
	if(train_collision()==1){
		callDead();
	}
	if(bush_collision()==1){
		if(speed < 0.14)
			callDead(1);
		watchman.speed = 0;
		watchman.currentPos = currentPos + 1.2;
		speed = 0.0005;
	}
}