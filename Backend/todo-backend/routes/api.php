<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TodoController;
use App\Http\Controllers\UserController;




Route::post('/users/register', [UserController::class, 'register']);
Route::post('/users/login', [UserController::class, 'login']);


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/todos', [TodoController::class, 'index']);
    Route::post('/todos', [TodoController::class, 'store']);
    Route::get('/todos/assigned', [TodoController::class, 'assignedToMe']);
    Route::get('/todos/assigned-by-me', [TodoController::class, 'assignedByMe']);
    Route::get('/todos/{id}', [TodoController::class, 'show']);
    Route::patch('/todos/{id}', [TodoController::class, 'update']);
    Route::delete('/todos/{id}', [TodoController::class, 'destroy']);


    Route::get('/users', [UserController::class, 'index']);
});
