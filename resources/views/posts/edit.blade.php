@extends ('layout')

@section ('head')
<style>
    h1 {
        color: orangered;
    }
</style>
@endsection

@section ('navbar-extra')
<p>Post Creator</p>
@endsection

@section ('content')
<div class="wrapper">
    <div class="container">
        <h1>Update a Post</h1>
        <form method="POST" action="/posts/{{$post->id}}">
            @csrf
            @method('PUT')
            <div class="field">
                <label for="title" class="label">Title</label>
                <div class="control">
                    <input type="text" class="form-control {{$errors->has('title') ? 'is-danger' : ''}}" name="title" id="title" value="{{$post->title}}" required>
                    @if($errors->has('title'))
                    <p class="help text-danger">{{$errors->first('title')}}</p>
                    @endif
                </div>
            </div>
            <div class="field">
                <label for="description" class="label">description</label>
                <div class="control">
                    <textarea class="form-control {{$errors->has('description') ? 'is-danger' : ''}}" name="description" id="description" rows="2">{{$post->description}}</textarea>
                    @if($errors->has('description'))
                    <p class="help text-danger">{{$errors->first('description')}}</p>
                    @endif
                </div>
            </div>
            <div class="field">
                <label for="body" class="label">Body</label>
                <div class="control">
                    <textarea class="form-control {{$errors->has('body') ? 'is-danger' : ''}}" name="body" id="body" rows="20">{{$post->body}}</textarea>
                    @if($errors->has('body'))
                    <p class="help text-danger">{{$errors->first('body')}}</p>
                    @endif
                </div>
            </div>
            <div class="field is-grouped">
                <div class="control">
                    <button class="btn btn-primary" type="submit">Submit</button>
                </div>
            </div>
        </form>
    </div>
</div>

@endsection