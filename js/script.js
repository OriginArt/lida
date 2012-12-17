/*Инициализация датапикера*/
$(function(){
    var D = new Date(), dd = D.getDate(), mm = parseInt ( D.getMonth() ) + 1, yyyy = D.getFullYear(), endDate, startDate;
    if ( String(dd).length == 1 ) dd =  "0" + dd;
    if ( String(mm).length == 1 ) mm =  "0" + mm;
    D = dd+'-'+mm+'-'+yyyy;
    endDate = startDate = new Date ( yyyy, mm - 1, dd );
    $('#dps > input, #dpe > input').val( D );
    $('#dps, #dpe').attr("data-date", D );
	
    $('#alert').hide();
        
    $('#dps').datepicker({format : 'dd-mm-yyyy', weekStart : 1}).on('changeDate', function(ev){
                		if (ev.date.valueOf() > endDate.valueOf()){
					$('#alert').show().find('strong').text('Дата начала не может быть больше даты окончания.');
				} else {
				        $('#alert').hide();
				        startDate = new Date(ev.date);
				        $('#startDate').text($('#dps').data('date'));
				}
			    	$('#dps').datepicker('hide');
    });
    $('#dpe').datepicker({format : 'dd-mm-yyyy', weekStart : 1}).on('changeDate', function(ev){
				if (ev.date.valueOf() < startDate.valueOf()){
					$('#alert').show().find('strong').text('Дата окончания не может быть меньше даты начала.');
				} else {
			    		$('#alert').hide();
		    			endDate = new Date(ev.date);
	    				$('#endDate').text($('#dpe').data('date'));
    				}
                                $('#dpe').datepicker('hide');
    });
});
    
/*
 *Общие обработчики. Вступают в силу после загрузки страницы
 */
$(document).ready(function(){
    
    var fls = 0, flb = 0;  
    var cache = {
                 ncd : "", //id валюты
                 typ : "", //тип операции [Покупка, Продажа]
                 dat : [], //массив дат
                 val : []  //массив значений соответствует массиву дат
                };
     
    /*
     * Обработка клика на кнопку построения прогноза
     */
    $("#btbuild").on("click", function (event){
      var  endDate, startDate, moneyb, moneys;
       
	if ( chdt($("#dpe > input")) && chdt($("#dps > input")) ) {	
          $('#alert').show().find('strong').text('Пожалуйста, подождите...');
            
          //преобразование из формата датапикера "01-01-2012" в формат "01/01/2012" для запроса к ЦентроБанку
          endDate   = $('#dpe > input').val().replace(/[-]+/g,'/'); 
          startDate = $('#dps > input').val().replace(/[-]+/g,'/'); 
         
	  moneyb = $("#buy input:checked").val();
	  moneys = $("#sell input:checked").val();
	 
          //Запрос для первой валюты (Продажа)
	  $.post( "http://localhost/lida/ui.php", { strd : startDate, endd : endDate, money : moneys }, function (xml) { xmlsuc (xml, "sell") } );
	  //Запрос для второй валюты (Покупка)
	  $.post( "http://localhost/lida/ui.php", { strd : startDate, endd : endDate, money : moneyb }, function (xml) { xmlsuc (xml, "buy") } );
	}
	else return;
    });
    
    /*
     *Это Callback-функция. Она отрабатывает при удачном запросе к серверу.
     */
    function xmlsuc (xml, typ){
      var i = 0, rst, al = $('#alert'), ob = {}, dt = [];
      
      if ( typ == 'sell' ) fls = 1;
      else if ( typ == 'buy' ) flb = 1;
      else { alert("Неизвестная операция над валютой!"); return; } 
      
      al.show().find('strong').text('Расчет данных о продаже.');
      cache.typ = typ;
      rst = $(xml).find('Record').each( function(){
                                                   cache.dat[ i ] = $(this).attr("Date");
                                                   cache.val[ i ] = $(this).find("Value").text();
                                                   ob = { y : cache.val[ i ].replace( ",", "."), x : cache.dat[ i ] };
                                                   dt.push( ob );
                                                   i++;
                                                  });
      cache.ncd = rst.attr("Id");
      if ( i == 0 ) alert("Ничего не было получено.");
      al.hide();
      console.log( dt );
      
      if ( fls && flb ) { 
        Morris.Line({
          element: 'annual',
          data: dt,
          xkey: 'x',
          ykeys: ['y'],
          labels: ['Series B'],
          lineColors: ['#167f39'],
          lineWidth: 2,
          parseTime: false
        });
      }
    }    
    
    
    /*
     *Проверка значений датапикеров при различных событиях
     *Используется для проверки при потере фокуса и нажатии на "Построении прогноза"
     */
    $("#dpe > input, #dps > input").on("blur", function( event ){ chdt( $(this) ); });
    
    function chdt (ths){
        var rsrc = /[0-9]{2}-[0-9]{2}-[0-9]{4}/,
	    erst = { 'border-color' : 'rgba(237, 83, 83, 0.804)', 'box-shadow' : 'inset 0px 1px 1px rgba(0, 0, 0, 0.071), 0px 0px 8px rgba(237, 83, 83, 0.600)'};
        
	if ( !rsrc.test( ths.val() ) ) {
          ths.focus().css( erst );
	  return false;
        }
	else {
	  ths.removeAttr('style');
	  return true;
	}
    }
});