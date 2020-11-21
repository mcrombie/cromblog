<?php

namespace App\Http\Controllers;

use DB;
use App\Post;
use App\Tag;


class PostsController
{
    // The 7 Restful Controller Actions

    public function index(){
        // Render a list of a resource

        if(request('tag')){
            $posts = Tag::where('name', request('tag'))->firstOrFail()->posts;
        } 
        else{
            $posts = Post::latest()->get();
        }
        
        return view('posts.index', ['posts' => $posts]);
    }

    public function show(Post $post){
        // Show a single resource
        //$post = Post::findOrFail($id); manual method
        return view('posts.show',['post'=>$post]);
    }



    public function create(){
        // Shows a view to create a new resource
        return view('posts.create', ['tags' => Tag::all()]);

    }
    
    public function store(){
        // display new post data on store
        // dd(request()->all());   

        // Persist the new resource
        // $validatedAttributes = request()->validate([
        //     'title'=>['required','min:1', 'max:255'],
        //     'description'=>'required',
        //     'body'=>'required'
        // ]);

        // manual 
        // $post = new Post();
        // $post->title = request('title');
        // $post->description = request('description');
        // $post->body = request('body');
        // $post->save();

        
        

        // Post::create($this->validateArticle());
        $this->validateArticle();
        $post = new Post(request(['title','description','body']));
        $post->user_id = 1;
        $post->save();
        if(request()->has('tags')){$post->tags()->attach(request('tags'));}
        

        return redirect(route('posts.index'));
    }

    public function edit(Post $post){
        // Show a view to edit an existing resource
        // $post = Post::find($id);
        return view('posts.edit',compact('post'));

    }

    public function update(Post $post){
        // Persist the edited resource

        $post->update($this -> validateArticle());

        // $post->title = request('title');
        // $post->description = request('description');
        // $post->body = request('body');
        // $post->save();
        return redirect($post->path());

    }

    public function destroy(){
        // Delete the resource

    }

    public function validateArticle(){
        return request()->validate([
            'title'=>['required','min:1', 'max:255'],
            'description'=>'required',
            'body'=>'required',
            'tags'=>'exists:tags,id' // the tag needs to exist on the tags table. Prevents sneaky users trying to break things
        ]);
    }
}
