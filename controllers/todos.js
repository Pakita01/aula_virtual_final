const todosRouter = require("express").Router();
const User = require("../models/user");
const Todo = require("../models/todo");

todosRouter.get('/', async (request , response) =>{
   const user = request.user;
   if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' });
   }
   const todos = await Todo.find({ user: user.id });
   return response.status(200).json(todos);
});

todosRouter.post('/', async (request , response) =>{
    const user = request.user
    const { text } = request.body;
    const newTodo = new Todo({
        text,
        checked: false,
        user: user._id
    });
    const savedTodo = await newTodo.save();
    user.todos = user.todos.concat(savedTodo._id);
    await user.save();

    return response.status(201).json(savedTodo);
});

todosRouter.delete('/:id', async (request , response) =>{
    const user = request.user;
    const todoIdToDelete = request.params.id; 

    await Todo.findByIdAndDelete(todoIdToDelete);

    user.todos = user.todos.filter(todoId => todoId.toString() !== todoIdToDelete);

    await user.save();

    return response.sendStatus(204);
});

todosRouter.patch('/:id', async (request , response) =>{
   // Extraemos todos los campos que podrían ser actualizados
   const { checked, text } = request.body; 
   const todoIdToUpdate = request.params.id;

   // Construye un objeto con los campos a actualizar dinámicamente
   const updateFields = {};
   if (checked !== undefined) { 
       updateFields.checked = checked;
   }
   if (text !== undefined) { // Solo actualiza 'text' si está presente en el body
       updateFields.text = text;
   }
    // Actualiza la tarea con los campos proporcionados
   const updatedTodo = await Todo.findByIdAndUpdate(todoIdToUpdate, updateFields, { new: true });
   if (!updatedTodo) {
       return response.status(404).json({ message: 'Tarea no encontrada' });
   }
   return response.status(200).json(updatedTodo); // Devuelve la tarea actualizada
});
module.exports= todosRouter;
