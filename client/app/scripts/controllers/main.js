(function() {

  'use strict';

  /**
   * @ngdoc function
   * @name chatAppApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the chatAppApp
   */

  angular
    .module('chatAppApp')
    .controller('MainCtrl', MainCtrl);

    // MainCtrl.$inject = [''];

    function MainCtrl() {
      var vm;

      vm = this;

      vm.init = initFirebase();
      vm.database = {
        'listen': listen,
        'set': set
      };

      vm.form = {
        submitForm: submitForm
      };

      vm.chat_logs = [];

      // ====

      function initFirebase() {
        var config;

        config = {
          apiKey: "AIzaSyBUPtWSIjrJZaN8O-4SLgj928-FNnjXxWc",
          authDomain: "realtime-chatapp.firebaseapp.com",
          databaseURL: "https://realtime-chatapp.firebaseio.com",
          storageBucket: "realtime-chatapp.appspot.com",
        };

        firebase.initializeApp(config);

        initDataBase(firebase);
        initSocket();
      }

      function initSocket() {
        var socket;

        socket = io();
        vm.socket = socket;

        listeners(socket);
      }

      function listeners(socket) {
        socket.on('chat message', function(msg){
          console.warn('chat message', msg);
          listen();

          // $('#messages').append($('<li>').text(msg));
        });

        socket.on('user disconnect', function(msg) {
          console.warn('user disconnect', msg);

          // $('#messages').append($('<li>').text(msg).css('font-style', 'italic'));
        })
      }

      function initDataBase(firebase) {
        var database;

        database = firebase.database();
        listen();
      }

      function listen() {
        var db;

        db = firebase.database().ref('chat_log/');

        db.on('value', function(snapshot) {
          console.log(snapshot.val())
          vm.chat_logs = snapshot.val();
        });
      }

      function set(data) {
        var obj;

        obj = {
          'username': data.name,
          'msg': data.msg,
          'event_name': data.event,
          'timestamp': new Date().getTime()
        };

        firebase
        .database()
        .ref('chat_log')
        .push(obj)
        .then(function(data) {
          console.log('tudo ok');
        }, function(err) {
          console.warn('tudo errado ', err);
        });
      }

      function submitForm() {
        vm.database.set(vm.form);
        vm.socket.emit('send message', vm.form);
        vm.form = {};
      }
    }

})();
