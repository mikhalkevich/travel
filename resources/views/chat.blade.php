@extends('layouts.app')
@section('meta')
    <meta http-equiv="Access-Control-Allow-Origin" content="*">
@endsection
@section('scripts')
    @parent
    <script src="{{asset('js/socket.io.js')}}"></script>
    <script>
        $(document).ready(function () {
            const socket = io.connect('http://localhost:3003');
            socket.on('connect', () => {
                socket
                    .emit('authenticate', {token: '{{auth('api')->tokenById(auth::user()->id)}}'})
                    .on('authenticated', () => {
                        /* socket.on('id', function (rows) {
                             var html = JSON.stringify(rows);
                             connectionUpdate(html);
                         });
                        socket.on('row', function (rows) {
                            console.log(rows);
                            var html = rows[0];
                            connectionUpdate(html);
                        });
                         */
                    })
                    .on('unauthorized', (msg) => {
                        console.log(`unauthorized: ${JSON.stringify(msg.data)}`);
                        throw new Error(msg.data.type);
                    })
            });

            socket.on('row{{$id}}', function (rows) {
                console.log(rows);
                var html = rows[0];
                connectionUpdate(html);
            });
        });

        function connectionUpdate(str) {
            $('#connection').prepend('<div>' + str.body + ' (' + str.created_at + ')</div>');
            console.log(str);
        }
    </script>
@endsection
@section('content')
    <div id="container"></div>
    <div class="container fly">
        <div class="col-md-10 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">Чат
                    <a href="/" class="close">&times;</a>
                </div>

                <div class="panel-body">
                    <div id="connection"></div>
                </div>
            </div>
        </div>
    </div>
@endsection
