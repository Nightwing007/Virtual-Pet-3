var dog;
var foodstock;
var foodS = 20;
var database;
var feedpet,addfood;
var fedtime,lastfed;

var gameState;

function preload()
{
  dogImg = loadImage("images/dogImg.png");
  dogHappyImg = loadImage("images/dogImg1.png");
  garden = loadImage("virtual pet images/Garden.png");
  bedroom = loadImage("virtual pet images/Bed Room.png");
  washroom = loadImage("virtual pet images/Wash Room.png");
}

function setup() {
  createCanvas(700, 400);


  database = firebase.database();

  dog = createSprite(600,250,50,50);
  dog.addImage(dogImg);
  dog.scale = 0.15;

  foodstock = database.ref("Food");
  foodstock.on("value", readStock);

  fedtime = database.ref("FeedTime");
  fedtime.on('value', readtime);

  readState = database.ref("gameState");
  readState.on('value',function(data){
    gameState = data.val();
  })

  food = new Food(foodS,lastfed);

  feedpet = createButton("Feed Dog");
  feedpet.position(800,70);
  addfood = createButton("Add Food");
  addfood.position(700,70);

}


function draw() {  
  background(46,139,87);

  food.getFoodStock();

  food.update();


  drawSprites();

  feedpet.mousePressed(function()
  {
    feedDog();
  });
  addfood.mousePressed(function()
  {
    addFood();
  });

  if(gameState != "Hungry")
  {
    feedpet.hide();
    addfood.hide();
    dog.visible = false;
  }
  else
  {
    feedpet.show();
    addfood.show();
    dog.visible = true;
    dog.addImage(dogImg);
  }

  currentTime = hour();
  if(currentTime ===(lastfed + 1))
  {
    update("Playing");
    food.garden();
  }
  else if(currentTime ===(lastfed + 2))
  {
    update("Sleeping");
    food.bedroom();
  }
  else if(currentTime>(lastfed+2) && currentTime<(lastfed + 4))
  {
    update("Bathing");
    food.washroom();
  }
  else 
  {
    update("Hungry");
    food.display();
  }

  fill(255,255,254);
  textSize(15);
  if(lastfed >= 12)
  {
    text("Last Feed : " + lastfed%12 + "PM" , 200,35);
  }
  else if(lastfed === 0)
  {
    text("Last Feed : 12AM", 200,35);
  }
  else{
    text("Last Feed : " + lastfed + "AM" , 200,35);
  }
}

function readStock(data)
{
  foodS = data.val();
  console.log(foodS);
}

function readtime(data)
{
  lastfed = data.val();
}

function feedDog()
{
  //dog.addImage(dogHappyImg);
  if(foodS <= 0)
  {
      foodS = 0;
  }
  else
  {
      foodS -= 1;
  }
  database.ref("/").update({
    Food : foodS,
    FeedTime : hour()
  })
}

function addFood()
{
  if(foodS >= 20)
  {
      foodS = 20;
  }
  else
  {
      foodS += 1;
  }
  database.ref().update({
    Food: foodS
  })
}

function update(state)
{
  database.ref('/').update({
    gameState : state
  })
}

