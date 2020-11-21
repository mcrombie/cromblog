<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    // When working with routes not based on id
    // public function getRouteKeyName()
    // {
    //     return 'slug';
    // }

    // For Mass Assigning
    protected $fillable = ['title', 'description', 'body'];

    public function path(){
        return route('posts.show', $this);
    }

    // Tags need a Belongstomany relationship
    public function tags(){
        return $this->belongsToMany(Tag::class);
    }
}

//  an article has many tags?
// tag belongs to an article?

// Post: Sweet Basil
// undefined, poems, essays

// this ^ is a many to many relationship