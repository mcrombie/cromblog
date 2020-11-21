<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;
use App\Http\Controllers\PostsController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return view('plan');
// });

// REQUIRES DATABASE
Route::get('/', function () {
    return view('home', [
        'posts' => App\Post::take(2)->latest()->get()
    ]);
});

Route::get('/hidden', function () {
    return view('hidden');
});

Route::get('/plan', function () {
    return view('plan');
});


// Closure to handle routes logic
// Small project

// Route::get('/posts/{post}', function($post) {
//     $posts = [
//         'post-1' => 'sweet basil',
//         'post-2' => 'Dagger Fern'
//     ];

//     if(!array_key_exists($post,$posts)){
//         abort(404, 'Sorry, that post was not found ¯\_(ツ)_/¯');
//     }

//     return view('post', [
//         'post' => $posts[$post]
//     ]);
// });

// Controller to hadnle routes logic
// Larger projects

Route::get('/test', [TestController::class, 'show']);
Route::get('/posts', [PostsController::class, 'index'])->name('posts.index');
Route::post('/posts', [PostsController::class, 'store']);
Route::get('/posts/create', [PostsController::class, 'create']);
Route::get('/posts/{post}', [PostsController::class, 'show'])->name('posts.show');
Route::get('/posts/{post}/edit', [PostsController::class, 'edit']);
Route::put('/posts/{post}', [PostsController::class, 'update']);


// Route::post('/posts/{post}', 'PostsController@store');

// Route::delete('/posts/{post}', 'PostsController@destroy');