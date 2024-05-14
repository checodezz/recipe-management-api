const express = require("express");
const app = express();
const {initializeDatabase} = require("./db/db.connect");
const Recipe = require("./models/recipe.model");
app.use(express.json());
initializeDatabase();

//3. Create an API with route "/recipes" to create a new recipe in the recipes database. Make sure to handle errors properly. Test your API with Postman. Add the following recipe:

async function addRecipe(recipe){
  try {
    const newRecipe =  new Recipe(recipe);
    const saveRecipe = await newRecipe.save();
    return saveRecipe
  } catch(error){
    throw error
  }
};

app.post("/recipe", async (req,res) => {
  try {
    const recipe = await addRecipe(req.body);
    if(recipe){
      res.status(201).json({message : "Recipe added successfully.", recipe : recipe})
    } else {
      res.status(400).json({error : "Failed to add Recipe"})
    }
  } catch(error){
    res.status(500).json({error : "Failed to fetch Recipes."})
  }
});

//6. Create an API to get all the recipes in the database as a response. Make sure to handle errors properly.

async function allRecipes(){
  try {
    const recipes = await Recipe.find();
    return recipes;
  } catch(error){
    throw error
  }
}

app.get("/recipes", async (req, res) => {
  try {
    const recipes = await allRecipes();
    if(recipes.length != 0){
      res.json(recipes)
    } else {s
      res.status(404).json({error :"Recipe not found."})
    }
  } catch(error){
    res.status(500).json({error : "Failed to fetch recipes."})
  }
})

//7. Create an API to get a recipe's details by its title. Make sure to handle errors properly.

async function recipeByTitle(recipeTitle){
  try {
    const recipe = await Recipe.findOne({title : recipeTitle});
    return recipe;
  } catch(error){
    throw error
  }
}

app.get("/recipes/:recipeTitle", async (req, res) => {
  try {
    const recipe = await recipeByTitle(req.params.recipeTitle)
    if(recipe){
      res.json(recipe)
    } else {
      res.status(404).json({error : "Recipe not found."})
    }
  } catch(error){
    console.log(error)
    res.status(500).json({error : "Failed to fetch recipes."})
  }
})

//8. Create an API to get details of all the recipes by an author. Make sure to handle errors properly.

async function recipesByAuthor(authorName){
  try {
    const recipe = await Recipe.find({author : authorName});
    return recipe;
  } catch(error){
    throw error
  }
}

app.get("/recipes/author/:authorName", async (req, res) => {
  try {
    const recipes = await recipesByAuthor(req.params.authorName);
    if(recipes.length != 0){
      res.json(recipes)
    } else {
      res.status(404).json({error : "Recipes not found."})
    }
  } catch(error){
    res.status(500).json({error : "Failed to fetch recipes."})
  }
})

//9. Create an API to get all the recipes that are of "Easy" difficulty level.

async function recipeByDifficulty(recipeDifficulty){
  try {
    const recipe = await Recipe.find({difficulty : recipeDifficulty});
    return recipe
  } catch(error){
    throw error
  }
}

app.get("/recipes/difficulty/:difficultyLevel", async (req, res) => {
  try {
    const recipes = await recipeByDifficulty(req.params.difficultyLevel);
    if(recipes.length != 0){
      res.json(recipes)
    } else {
      res.status(404).json({error : "Recipe not found"})
    }
  } catch(error) {
    res.status(500).json({error : "Failed to fetch recipes"})
  }
})

//10. Create an API to update a recipe's difficulty level with the help of its id. Update the difficulty of "Spaghetti Carbonara" from "Intermediate" to "Easy". Send an error message "Recipe not found" if the recipe is not found. Make sure to handle errors properly.

async function updateDifficulty(recipeId, updatedValue){
try {
  const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, updatedValue, {new : true});
  return updatedRecipe;
}  catch(error){
  throw error
} 
}

app.post("/recipes/difficulty/:recipeId", async (req,res) => {
  try {
    const updatedRecipe = await updateDifficulty(req.params.recipeId, req.body)
    if(updatedRecipe){
      res.status(201).json({message : "Recipe updated Successfully.", recipe : updatedRecipe})
    } else {
      res.status(404).json({error : "Recipe not found."})
    }
  } catch(error){
    res.status(500).json({error : "Failed to update recipe."})

  }
})

//11. Create an API to update a recipe's prep time and cook time with the help of its title. Update the details of the recipe "Chicken Tikka Masala". Send an error message "Recipe not found" if the recipe is not found. Make sure to handle errors properly.

async function updateRecipeByTitle(title, updatedData){
 try {
   const updatedRecipe = await Recipe.findOneAndUpdate({title : title}, updatedData, {new : true});
   return updatedRecipe;
 }  catch(error){
   throw error
 }
}

app.post("/recipes/preptime/:recipeTitle", async (req, res) => {
  try {
    const updatedRecipe = await updateRecipeByTitle(req.params.recipeTitle, req.body)
    if(updatedRecipe){
      res.json({message : 'recipe updated succesfully', recipe : updatedRecipe})
    } else {
      res.status(404).json({error : "Recipe not found."})
    }
  } catch(error){
    console.log(error)
    res.status(500).json({error : "Failed to update recipe."})
  }
})

async function deleteRecipe(recipeId){
  try {
    const recipe = await Recipe.findByIdAndDelete(recipeId);
    return recipe;
  } catch(error){
    throw error
  }
}

app.delete("/recipe/:recipeId", async (req, res) => {
  try {
    const recipe = await deleteRecipe(req.params.recipeId);
    if(recipe){
      res.json({message : "Recipe deleted successfully."})
    } else {
      res.status(404).json({error : "Recipe not found."})
    }
  } catch(error){
    res.status(500).json({error : "Failed to delete the recipe"})
  }
})

const PORT = 3000;
app.listen(PORT, ()=> {
  console.log(`App is listening at portt ${PORT}.`)
})