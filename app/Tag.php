<?php


// For some reason I had to move this from MOdels to this path
namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;
     
    public function posts(){
        return $this->belongsToMany(Post::class);
    }
}