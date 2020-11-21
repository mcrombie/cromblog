@extends ('layout')

@section ('navbar-extra')
<p>Home page in development</p>
@endsection

@section ('content')
<div class="container">
    <dl class="list-inline">
        @forelse ($posts as $post)
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">{{$post->title}}</h5>
                <div class="row">
                    <div class="col-9">
                        <p class="card-text">{{$post->description}}</p>
                    </div>
                    <div class="col-3">
                        <a href="{{$post->path()}}" class="btn btn-primary float-right">Go to</a>
                    </div>
                </div>
            </div>
        </div>
        @empty
            <p>No posts under this tag</p>
        @endforelse
    </dl>

</div>
@endsection