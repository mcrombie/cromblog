@extends ('layout')

@section ('navbar-extra')
<p>Home page in development</p>
@endsection

@section ('content')
<div class="container">
    <h1 class="bg-error">{{$post->title}}</h1>
    @foreach (preg_split("/\r\n|\n|\r/", $post->body) as $line)
        <p class="text-justify">{{$line}}</p>
    @endforeach
    <p>
        @foreach ($post->tags as $tag)
            <a href="{{route('posts.index', ['tag' => $tag->name])}}" class="">{{$tag->name}}</a>
        @endforeach
    </p>
    

</div>
@endsection