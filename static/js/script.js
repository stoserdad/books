/**
 * Created by bender on 10.03.16.
 */

 $(function(){
     $('#sauthor').click(function(event){
         var author = $('#author').val();
         $('#pages').empty();
         $.ajax({
             url: '/author?name=' + author + '&skip=' + 0,
             type: 'GET',
             success: function(resp){
                 var c = JSON.parse(resp)[1];
                 var cntpages = c % 10 != 0 ? (c/10>>0) + 1: c/10>>0;
                 var table = '<table class="table table-striped table-bordered table-list"><thead><tr><th width="50">#</th><th width="350">Автор</th><th>Книга</th><th width="80">Скачать</th></tr></thead>';
                 var pages = '<div class="col hidden-xs col-md-2"><h id="pg">1</h> из ' + cntpages + '</div><div class="col col-xs-12 col-md-10"><ul class="pagination pull-right">';
                 for (var i = 0; i < cntpages; i++) {
                     if (cntpages>10) {
                         if (i==0) {
                             pages += '<li><a dataskip="0" onclick="skip10a(this)">...</a></li>';
                             pages += '<li><a dataskip="' + (i >= 1 ? (i * 10) : 0) + '" onclick="skipA(this)">' + (i + 1) + '</a></li>';
                         } else if (i < 10) {
                             pages += '<li><a dataskip="' + (i >= 1 ? (i * 10) : 0) + '" onclick="skipA(this)">' + (i + 1) + '</a></li>';
                         } else if (i == 10) {
                             pages += '<li><a dataskip="' + (i >= 1 ? (i * 10) : 0) + '" onclick="skip10a(this)">' + '...' + '</a></li>';
                         }
                     }else {
                         pages += '<li><a dataskip="' + (i >= 1 ? (i * 10) : 0) + '" onclick="skipA(this)">' + (i + 1) + '</a></li>';
                     }
                 }
                 pages += '</ul></div>';
                 $.each(JSON.parse(resp)[0], function(i, item){
                     i = i + 1;
                     table += '<tr>' +
                             '<td>' + i + '</td>' +
                             '<td>' + item.author + '</td>' +
                             '<td>' + item.title + '</td>' +
                             '<td align="center"><a href="/download/' + item.filename + '" download><i class="fa fa-download" aria-hidden="true"></i></a></td></tr>';
                 });
                 table += '</table>';
                 document.getElementById('result').innerHTML=table;
                 if(cntpages>1) {
                     document.getElementById('pages').innerHTML=pages;
                 }
             },
             error: function(){
                 console.log('Error, something wrong')
             }
         });
         event.preventDefault();
     });

     $('#sbook').click(function(event){
         var book = $('#book').val();
         $('#pages').empty();
         $.ajax({
             url: '/book?title=' + book + '&skip=' + 0,
             type: 'GET',
             success: function(resp){
                 var c = JSON.parse(resp)[1];
                 var cntpages = c % 10 != 0 ? (c/10>>0) + 1: c/10>>0;
                 var table = '<table class="table table-striped table-bordered table-list"><thead><tr><th width="50">#</th><th width="350">Автор</th><th>Книга</th><th width="80">Скачать</th></tr></thead>';
                 var pages = '<div class="col hidden-xs col-md-2"><h id="pg">1</h> из ' + cntpages + '</div><div class="col col-xs-12 col-md-10"><ul class="pagination pull-right">';
                 for (var i = 0; i < cntpages; i++) {
                     if (cntpages>10) {
                         if (i==0) {
                             pages += '<li><a dataskip="0" onclick="skip10b(this)">...</a></li>';
                             pages += '<li><a dataskip="' + (i >= 1 ? (i * 10) : 0) + '" onclick="skipB(this)">' + (i + 1) + '</a></li>';
                         } else if (i < 10) {
                             pages += '<li><a dataskip="' + (i >= 1 ? (i * 10) : 0) + '" onclick="skipB(this)">' + (i + 1) + '</a></li>';
                         } else if (i == 10) {
                             pages += '<li><a dataskip="' + (i >= 1 ? (i * 10) : 0) + '" onclick="skip10b(this)">' + '...' + '</a></li>';
                         }
                     }else {
                         pages += '<li><a dataskip="' + (i >= 1 ? (i * 10) : 0) + '" onclick="skipB(this)">' + (i + 1) + '</a></li>';
                     }
                 }
                 pages += '</ul>';
                 $.each(JSON.parse(resp)[0], function(i, item){
                     i = i + 1;
                     table += '<tr>' +
                             '<td>' + i + '</td>' +
                             '<td>' + item.author + '</td>' +
                             '<td>' + item.title + '</td>' +
                             '<td align="center">' +
                             '<a href="/download/fb2/' + item.filename + '" download>fb2</a> &nbsp' +
                             '<a href="/download/epub/' + item.filename + '" download>epub</a></td></tr>';
                 });
                 table += '</table>';
                 document.getElementById('result').innerHTML=table;
                 if(cntpages>1) {
                     document.getElementById('pages').innerHTML=pages;
                 }
             },
             error: function(){
                 console.log('Error, something wrong')
             }
         });
         event.preventDefault();
     });
 });

function skipA(obj) {
    var sk = $(obj);
    var author = $('#author').val();
    var skipCnt = sk.attr('dataskip');
         $.ajax({
             url: '/author?name=' + author + '&skip=' + skipCnt,
             type: 'GET',
             success: function(resp){
                 var c = JSON.parse(resp)[1];
                 var cntpages = c % 10 != 0 ? (c/10>>0) + 1: c/10>>0;
                 var table = '<table class="table table-striped table-bordered table-list"><thead><tr><th width="50">#</th><th width="350">Автор</th><th>Книга</th><th width="80">Скачать</th></tr></thead>';
                 document.getElementById('pg').innerHTML=(skipCnt/10) + 1;
                 $.each(JSON.parse(resp)[0], function(i, item){
                     i = +sk.attr('dataskip') + i + 1 ;
                     table += '<tr>' +
                             '<td>' + i + '</td>' +
                             '<td>' + item.author + '</td>' +
                             '<td>' + item.title + '</td>' +
                             '<td align="center"><a href="/download/' + item.filename + '" download><i class="fa fa-download" aria-hidden="true"></i></a></td></tr>';
                 });
                 table += '</table>';
                 document.getElementById('result').innerHTML=table;
             },
             error: function(){
                 console.log('Error, something wrong')
             }

         })
}

function skipB(obj) {
    var sk = $(obj);
    var book = $('#book').val();
    var skipCnt = sk.attr('dataskip');
         $.ajax({
             url: '/book?title=' + book + '&skip=' + sk.attr('dataskip'),
             type: 'GET',
             success: function(resp){
                 var c = JSON.parse(resp)[1];
                 var cntpages = c % 10 != 0 ? (c/10>>0) + 1: c/10>>0;
                 var table = '<table class="table table-striped table-bordered table-list"><thead><tr><th width="50">#</th><th width="350">Автор</th><th>Книга</th><th width="80">Скачать</th></tr></thead>';
                 document.getElementById('pg').innerHTML=(skipCnt/10) + 1;
                 $.each(JSON.parse(resp)[0], function(i, item){
                     i = +sk.attr('dataskip') + i + 1;
                     table += '<tr>' +
                             '<td>' + i + '</td>' +
                             '<td>' + item.author + '</td>' +
                             '<td>' + item.title + '</td>' +
                             '<td align="center"><a href="/download/' + item.filename + '" download><i class="fa fa-download" aria-hidden="true"></i></a></td></tr>';
                 });
                 table += '</table>';
                 document.getElementById('result').innerHTML=table;
             },
             error: function(){
                 console.log('Error, something wrong')
             }

         })
}

function skip10a(obj) {
    var sk = $(obj);
    var author = $('#author').val();
    var skipCnt = sk.attr('dataskip');
         $.ajax({
             url: '/author?name=' + author + '&skip=' + skipCnt,
             type: 'GET',
             success: function(resp){
                 var c = JSON.parse(resp)[1];
                 var cntpages = c % 10 != 0 ? (c/10>>0) + 1: c/10>>0;
                 var table = '<table class="table table-striped table-bordered table-list"><thead><tr><th width="50">#</th><th width="350">Автор</th><th>Книга</th><th width="80">Скачать</th></tr></thead>';
                 var pages = '<div class="col hidden-xs col-md-2"><h id="pg">' + (skipCnt/10 + 1) + '</h> из ' + cntpages + '</div><div class="col col-xs-12 col-md-10"><ul class="pagination pull-right">';
                 for (var i = (skipCnt/10); i < cntpages; i++) {
                     if(i == (skipCnt/10)) {
                         pages += '<li><a dataskip="' + (i >= 1 ? (i * 10)-100: 0) + '" onclick="skip10a(this)">' + '...' + '</a></li>';
                         pages += '<li><a dataskip="' + (i >= 1 ? (i * 10) : 0) + '" onclick="skipA(this)">' + (i + 1) + '</a></li>';
                     } else if (i < ((skipCnt/10) + 10)) {
                             pages += '<li><a dataskip="' + (i >= 1 ? (i * 10) : 0) + '" onclick="skipA(this)">' + (i + 1) + '</a></li>';
                     } else if (i == (10 + (skipCnt/10))){
                         pages += '<li><a dataskip="' + (i >= 1 ? (i * 10) : 0) + '" onclick="skip10a(this)">' + '...' + '</a></li>';
                     }
                 }
                 pages += '</ul>';
                 $.each(JSON.parse(resp)[0], function(i, item){
                     i = +sk.attr('dataskip') + i + 1 ;
                     table += '<tr>' +
                             '<td>' + i + '</td>' +
                             '<td>' + item.author + '</td>' +
                             '<td>' + item.title + '</td>' +
                             '<td align="center"><a href="/download/' + item.filename + '" download><i class="fa fa-download" aria-hidden="true"></i></a></td></tr>';
                 });
                 table += '</table>';
                 document.getElementById('result').innerHTML=table;
                 if(cntpages>1) {
                     document.getElementById('pages').innerHTML=pages;
                 }
             },
             error: function(){
                 console.log('Error, something wrong')
             }

         })
}

function skip10b(obj) {
    var sk = $(obj);
    var author = $('#book').val();
    var skipCnt = sk.attr('dataskip');
         $.ajax({
             url: '/book?title=' + author + '&skip=' + skipCnt,
             type: 'GET',
             success: function(resp){
                 var c = JSON.parse(resp)[1];
                 var cntpages = c % 10 != 0 ? (c/10>>0) + 1: c/10>>0;
                 var table = '<table class="table table-striped table-bordered table-list"><thead><tr><th width="50">#</th><th width="350">Автор</th><th>Книга</th><th width="80">Скачать</th></tr></thead>';
                 var pages = '<div class="col hidden-xs col-md-2"><h id="pg">' + (skipCnt/10 + 1) + '</h> из ' + cntpages + '</div><div class="col col-xs-12 col-md-10"><ul class="pagination pull-right">';
                 for (var i = (skipCnt/10); i < cntpages; i++) {
                     if(i == (skipCnt/10)) {
                         pages += '<li><a dataskip="' + (i >= 1 ? (i * 10)-100: 0) + '" onclick="skip10b(this)">' + '...' + '</a></li>';
                         pages += '<li><a dataskip="' + (i >= 1 ? (i * 10) : 0) + '" onclick="skipB(this)">' + (i + 1) + '</a></li>';
                     } else if (i < ((skipCnt/10) + 10)) {
                             pages += '<li><a dataskip="' + (i >= 1 ? (i * 10) : 0) + '" onclick="skipB(this)">' + (i + 1) + '</a></li>';
                     } else if (i == (10 + (skipCnt/10))){
                         pages += '<li><a dataskip="' + (i >= 1 ? (i * 10) : 0) + '" onclick="skip10b(this)">' + '...' + '</a></li>';
                     }
                 }
                 pages += '</ul>';
                 $.each(JSON.parse(resp)[0], function(i, item){
                     i = +sk.attr('dataskip') + i + 1 ;
                     table += '<tr>' +
                             '<td>' + i + '</td>' +
                             '<td>' + item.author + '</td>' +
                             '<td>' + item.title + '</td>' +
                             '<td align="center"><a href="/download/' + item.filename + '" download><i class="fa fa-download" aria-hidden="true"></i></a></td></tr>';
                 });
                 table += '</table>';
                 document.getElementById('result').innerHTML=table;
                 if(cntpages>1) {
                     document.getElementById('pages').innerHTML=pages;
                 }
             },
             error: function(){
                 console.log('Error, something wrong')
             }

         })
}