(function () {
  "use strict";

  angular.module('app.services', [])
  //  .service('CatService', CatService)
  // .factory('FavFactory', FavFactory)
  .factory('ObjFactory', ObjFactory);

  ObjFactory.$inject = ['$cordovaSQLite','$http','$ionicLoading','$q', '$rootScope'];
  function ObjFactory($cordovaSQLite, $http, $ionicLoading, $q, $rootScope){
    var objs =[];

    return {

      getfilters: function(){
        var deferred = $q.defer();
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });

        var query = "SELECT * FROM tipo_obj";
        //    console.log("Query: " + query);
        if(db != null){
          $cordovaSQLite.execute(db, query).then(function(res) {
            var objs = [];
            console.log("executando SQL...");
            if(res.rows.length > 0){
              var totLin= res.rows.length;
              var it = 0;
              for(it = 0; it < totLin; it++) {
                var abrev = res.rows.item(it).abrev;
                var descricao = res.rows.item(it).descricao;
                var reg = abrev + ";"+descricao;
                objs.push(reg);
              }
              var response = objs;
              response.data = response;
              //          console.log("Resultado Fav: " + response.data + " - " + response);
              objs = response.data;
              deferred.resolve(objs);
              return deferred.promise;
            } else {
              console.log("No results found");
            }
            $ionicLoading.hide();
          }, function (err) {
            console.error(err);
          });
        }
        return true;
      },

      removeFav: function(myObject){
        var deferred = $q.defer();
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });

        var query = "delete FROM favorites where trim(favObject) = trim('"+myObject+"')";
        //  console.log("Query: " + query);
        if(db != null){
          $cordovaSQLite.execute(db, query).then(function(res) {
            console.log("executado SQL...Delete Favorite!");
            deferred.resolve("Remove OK");
            $ionicLoading.hide();
          }, function (err) {
            console.error(err);
          });
        }
      },

      allFav: function(){
        var deferred = $q.defer();
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });

        var query = "SELECT * FROM favorites";
        //    console.log("Query: " + query);
        if(db != null){
          $cordovaSQLite.execute(db, query).then(function(res) {
            var objs = [];
            console.log("executando SQL...");
            if(res.rows.length > 0){
              var totLin= res.rows.length;
              var it = 0;
              for(it = 0; it < totLin; it++) {
                var OBJECT = res.rows.item(it).favObject;
                var reg = OBJECT;
                objs.push(reg);
              }
              var response = objs;
              response.data = response;
              //          console.log("Resultado Fav: " + response.data + " - " + response);
              objs = response.data;
              deferred.resolve(objs);
              return deferred.promise;
            } else {
              console.log("No results found");
            }
            $ionicLoading.hide();
          }, function (err) {
            console.error(err);
          });
        }
        return true;
      },

      addFav: function(myObject){
        var deferred = $q.defer();
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });

        var query = "SELECT * FROM favorites where substr(favObject,1,"+myObject.length+") = '"+myObject+"'";

        //    console.log("Query: " + query);
        if(db != null){
          $cordovaSQLite.execute(db, query).then(function(res) {
            if(res.rows.length > 0){
              query = "UPDATE favorites SET favObject = '"+myObject+"' where substr(favObject,1,"+myObject.length+") = '"+myObject+"'";
              //    console.log("Query1: " + query + " - "+ res);
            }else{
              query = "INSERT INTO favorites ('favObject') VALUES('"+myObject+"')";
              //    console.log("Query 2: " + query + " - "+ res);
            }
            //    console.log("Query 3: " + query);
            $cordovaSQLite.execute(db, query).then(function(res) {
              //      console.log("executado SQL...Insert Favorite!" + res);
              deferred.resolve(true);

            }, function (err) {
              $ionicLoading.hide();
              console.error(err);
            });
          }, function (err) {
            $ionicLoading.hide();
            console.error(err);
          });

          $ionicLoading.hide();
          //  return true;
        }
        return true;
      },

      getCat: function(myFilter) {
        var deferred = $q.defer();
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });

        var query = "select distinct substr(OBJECT,1,instr(OBJECT,' ')) as OBJECT from data_object "
        if(myFilter.length > 0){
          query = query + " where TYPE = '"+myFilter+ "' ";
        }
        query = query + "order by OBJECT ";
        if(db != null){
          $cordovaSQLite.execute(db, query).then(function(res) {
            var cat = [];
            console.log("executando SQL..." + res.rows.length);
            if(res.rows.length > 0){
              var totLin= res.rows.length;
              var it = 0;
              for(it = 0; it < totLin; it++) {
                cat.push(res.rows.item(it).OBJECT);
              }
              var response = cat
              response.data = response;
              deferred.resolve(objs);
            } else {
              console.log("No results found");
            }
          }, function (err) {
            console.error(err);
          });

          return deferred.promise;
        }
      },

      get: function(mySelect, myFilter) {
        var deferred = $q.defer();
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });

        // var query = "SELECT * FROM data_object where substr(OBJECT,1,"+mySelect.length+") = '"+mySelect +"' order by TX_OBJECT";
        var query = "SELECT A.OBJECT AS OBJECT, B.descricao as 'TYPE_DESCR', B.abrev as TYPE ";
        query = query + "FROM data_object A, tipo_obj B ";
        query = query + "where substr(A.OBJECT,1," + mySelect.length + ") = '"+ mySelect +"' ";
        query = query + "and trim(A.TYPE) = trim(B.abrev) ";
        if(myFilter != null){
          query = query + "and trim(A.TYPE) = trim('"+ myFilter + "') ";
        }
        query = query + "order by OBJECT";
        if(db != null){
          $cordovaSQLite.execute(db, query).then(function(res) {
            var objs = [];
            //  console.log("executando SQL..." + res.rows.length);
            if(res.rows.length > 0){
              var totLin= res.rows.length;
              var it = 0;
              for(it = 0; it < totLin; it++) {
                //        console.log(res.rows.item(it).OBJECT);
                objs.push(res.rows.item(it).OBJECT+"#"+res.rows.item(it).TYPE_DESCR+"#"+res.rows.item(it).TYPE);
              }

              var tmp = [];
              var item = null;
              var it = 0;
              for(it = 0; it < objs.length; it++){
                //      console.log(item);
                var aItem = objs[it].split("#");
                tmp.push('{"OBJECT": {"NAME": "' + aItem[0] + '", "TYPE_DESCR": "' + aItem[1] + '", "TYPE": "' + aItem[2] + '"}}');
              }
              //  console.log(tmp);

              var objon = ['{ "cats": ['+ tmp + ']}'];
              var response = objon;
              response.data = response;
              objs = response.data;
              deferred.resolve(objs);
              //return objs;
            } else {
              console.log("No results found");
            }
            $ionicLoading.hide();
          }, function (err) {
            console.error(err);
          });
        }
        return deferred.promise;

        //    return "Olá Mundo !" + mySelect;

      },

      getObj: function(myObject){
        var deferred = $q.defer();
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });

        var query = "SELECT * FROM data_object where UPPER(replace(OBJECT,' ','')) = UPPER(replace('"+myObject+"',' ',''))";
        if(db != null){
          $cordovaSQLite.execute(db, query).then(function(res) {
            var objs = [];
            console.log("executando SQL..." + res.rows.length);
            if(res.rows.length > 0){
              var totLin= res.rows.length;
              var it = 0;
              for(it = 0; it < totLin; it++) {
                //    console.log(res.rows.item(it).OBJECT);
                var OBJECT = res.rows.item(it).OBJECT
                var OTHER = res.rows.item(it).OTHER
                var TYPE = res.rows.item(it).TYPE
                var CON = res.rows.item(it).CON
                var RA = res.rows.item(it).RA
                var DEC = res.rows.item(it).DEC
                var MAG = res.rows.item(it).MAG
                var SUBR = res.rows.item(it).SUBR
                var U2K = res.rows.item(it).U2K
                var TI = res.rows.item(it).TI
                var SIZEMAX = res.rows.item(it).SIZEMAX
                var SIZEMIN = res.rows.item(it).SIZEMIN
                var PA = res.rows.item(it).PA
                var CLASS = res.rows.item(it).CLASS
                var NSTS = res.rows.item(it).NSTS
                var BRSTR = res.rows.item(it).BRSTR
                var BCHM = res.rows.item(it).BCHM
                var NGC_DESCR = res.rows.item(it).NGC_DESCR
                var NOTES = res.rows.item(it).NOTES

                var reg = OBJECT+","+OTHER+","+TYPE+","+CON+","+RA+","+DEC+","+MAG+","+SUBR+","+U2K+","+TI+","+SIZEMAX+","+SIZEMIN+","+PA+","+CLASS+","+NSTS+","+BRSTR+","+BCHM+","+NGC_DESCR+","+NOTES;
                //        var reg = "{obj: [{OBJECT: '"+OBJECT+"',OTHER: '"+OTHER+"',TYPE: '"+TYPE+"',CON: '"+CON+"',RA: '"+RA+"',DEC: '"+DEC+"',MAG: '"+MAG+"',SUBR: '"+SUBR+"',U2K: '"+U2K+"',TI: '"+TI+"',SIZEMAX: '"+SIZEMAX+"',SIZEMIN: '"+SIZEMIN+"',PA: '"+PA+"',CLASS: '"+CLASS+"',NSTS: '"+NSTS+"',BRSTR: '"+BRSTR+"',BCHM: '"+BCHM+"',NGC_DESCR: '"+NGC_DESCR+"',NOTES: '"+NOTES+"'}]}";
                objs.push(reg);
              }
              var response = objs;
              response.data = response;
              objs = response.data;
              //    console.log("Response: "+ response);
              deferred.resolve(objs);
              //return objs;
            } else {
              console.log("No results found");
              deferred.resolve(null);
            }
            $ionicLoading.hide();
          }, function (err) {
            console.error(err);
          });
        }
        return deferred.promise;
      },

      initAll: function(){
        if(db != null){
          $cordovaSQLite.execute(db, query).then(function(res) {
            var cat = [];
            console.log("executando SQL..." + res.rows.length);
            if(res.rows.length > 0){
              var totLin= res.rows.length;
              var it = 0;
              for(it = 0; it < totLin; it++) {
                //    cat.push(res.rows.item(it).OBJECT+"#"+res.rows.item(it).TYPE_DESCR+"#"+res.rows.item(it).TYPE);
                cat.push(res.rows.item(it).OBJECT + " - " + res.rows.item(it).DESCRICAO);
              }
              var response = cat;
              response.data = response;
              $rootScope.cat = response.data;
            } else {
              console.log("No results found for Catalog!");
            }
          }, function (err) {
            console.error(err);
          });
          // Carregando favoriteObjs
          var query = "Select favObject from favorites order by favObject";
          $cordovaSQLite.execute(db, query).then(function(res) {
            var fav = [];
            if(res.rows.length > 0) {
              var totLin= res.rows.length;
              var it = 0;
              for(it = 0; it < totLin; it++) {
                fav.push(res.rows.item(it).favObject);
              }
              var response = fav
              response.data = response;
              $rootScope.fav = response.data;
            }else {
              console.log("No results found");
            }
            //  console.log("App Load:"+$rootScope.cat);
          }, function (err) {
            console.error(err);
          });
          // Carregando filtros
          query = "Select * from tipo_obj order by abrev";
          $cordovaSQLite.execute(db, query).then(function(res) {
            var filters = [];
            if(res.rows.length > 0) {
              var totLin= res.rows.length;
              var it = 0;
              for(it = 0; it < totLin; it++) {
                filters.push(res.rows.item(it).abrev+"-"+res.rows.item(it).descricao);
              }
              var response = filters
              response.data = response;
              $rootScope.filters = response.data;
              $rootScope.myFilter = "";
            }else {
              console.log("No results found");
            }
            //  console.log("App Load:"+$rootScope.cat);
          }, function (err) {
            console.error(err);
          });
        }
      }
    }
  }
})();
