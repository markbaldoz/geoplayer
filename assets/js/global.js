var base_url = window.location.origin + "/pms/";

/*
|----------------------------------------------------------------
|   SIDEBAR FUNCTIONS / EVENTS
|----------------------------------------------------------------
*/

function init_sidebar_events(){
    $(document).on('click', '.side-menu-item', function(e){
        e.preventDefault();

        $('.side-menu-item.active').removeClass('active');
        $(this).addClass('active');
    });
}


/* 
|-----------------------------------------------------------------
| PAGE FUNCTIONS
|-----------------------------------------------------------------
*/

function scroll_to_control_byID(id){
  // console.log('scrolling to control location');
  var ctrl_top = $("#" + id).offset().top
  console.log(ctrl_top);

  // $('html, body').animate({
  $('html, body').animate({
      scrollTop: ctrl_top
  }, 1000); 
}


function scroll_to_modal_control_byID(modalID, id){
  // console.log('scrolling to control location');
  var ctrl_top = $("#" + id).offset().top
  console.log(ctrl_top);

  // $('html, body').animate({
  $('#' + modalID).animate({
      scrollTop: ctrl_top
  }, 1000); 
}

function scroll_to_control(ctrl){
  // console.log('scrolling to control location');
  $('html, body').animate({
      scrollTop: ctrl.offset().top
  }, 1000); 
}

function scroll_to_modal_control(modal, ctrl){
  // console.log('scrolling to control location');
  modal.animate({
      scrollTop: ctrl.offset().top
  }, 1000); 
}


/**
|-----------------------------------------------------------------
|   DATE FUNCTIONS
|-----------------------------------------------------------------
*/
function parseDate(dt){
  var finalDate = '';
  var parts = dt.split(' ');
  var months = ["JAN", "FEB", "MAR", "APR", "MAY",
              "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  if(parts.length === 3){

      var month = strip_non_alpha(parts[0].trim()).toUpperCase();
      var day = parseInt(strip_non_numeric(parts[1].trim()));
      var year = parseInt(strip_non_numeric(parts[2].trim()));

      // console.log('examining: ' +  month + ' ' + day + ' ' + year); 

      if(months.includes(month) === false){
          console.log('invalid month');
          return finalDate;
      } 

      var month_index = months.indexOf(month) + 1;
      // console.log('month is ' + month_index);

      if(year.toString().length !== 4 || isNaN(year)){
          console.log('invalid year');
         return finalDate; 
      }
      
      var days = new Date(year, month_index, 0).getDate();  
      // console.log(days + ' days in ' + months[month_index - 1] + ' ' + year);

      if(isNaN(day) || day <= 0 || day > days){
          console.log('invalid day of month');
          return finalDate;
      }

      
     finalDate  =  year + '-' +  (month_index >= 10 ? month_index : '0' + month_index) + '-' + (day >= 10 ? day : '0' + day)
      

    
  }



  return finalDate; 
}

function format_date(d){
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
  ];

  var parts = d.split('-');
  if(parts.length !== 3) return '';
  
  var year = parts[0];
  var month = parts[1];
  var day = parts[2];

  return months[parseInt(month) - 1] + ' ' + day + ', ' + year;
}



/*
|-----------------------------------------------------------------
|   REGULAR EXPRESSIONS
|-----------------------------------------------------------------
*/

// REGEX
function strip_non_alpha(str){
  var reg = /[^a-zA-ZñÑ]/g;
  var new_str =  str.replace(reg, "");
  // console.log("string trimmed");
  return new_str;
}
function clean_name(str){
  str = str.toString().trim();
  return str.replace(/[^a-zA-ZñÑ.\s-]/g, "");
}
function strip_non_numeric(str){
  return str.replace(/\D/g, "");
}
function strip_non_decimal(str){
  return str.replace(/[^0-9.]/g, "");
}

function strip_non_time(str){
  return str.replace(/[^0-9:]/g, "");
}


/**
|-----------------------------------------------------------------
|   NUMERICAL FUNCTIONS
|-----------------------------------------------------------------
*/
function format_number(val) {
    // remove sign if negative
    var sign = 1;
    if (val < 0) {
      sign = -1;
      val = -val;
    }
    // trim the number decimal point if it exists
    let num = val.toString().includes('.') ? val.toString().split('.')[0] : val.toString();
    let len = num.toString().length;
    let result = '';
    let count = 1;
  
    for (let i = len - 1; i >= 0; i--) {
      result = num.toString()[i] + result;
      if (count % 3 === 0 && count !== 0 && i !== 0) {
        result = ',' + result;
      }
      count++;
    }
  
    // add number after decimal point
    if (val.toString().includes('.')) {
      result = result + '.' + val.toString().split('.')[1];
    }
    // return result with - sign if negative
    return sign < 0 ? '-' + result : result;
}

// function format_str_number(num, zeros = )

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

/*
|-----------------------------------------------
|   EXIF
|-----------------------------------------------
*/

function getExif(img){
  var coordinates = [];
  // console.log('reading exif');
  EXIF.getData(img, function() {
    // EXIF.getData(input, function() {

      var myData = this;
      // console.log(myData);
      if(myData === undefined || myData === null) coordinates =  [];

      try {

        var exif = myData.exifdata;
        if(exif === undefined || exif === null) coordinates = [];

        // console.log(myData.exifdata);

        if(myData.exifdata.GPSLatitude !== undefined && myData.exifdata.GPSLongitude !== undefined){
          
          var latDegree = myData.exifdata.GPSLatitude[0].numerator;
          var latMinute = myData.exifdata.GPSLatitude[1].numerator;
          var latSecond = myData.exifdata.GPSLatitude[2].numerator / myData.exifdata.GPSLatitude[2].denominator;
          var latDirection = myData.exifdata.GPSLatitudeRef;

          var latt = ConvertDMSToDD(latDegree , latMinute , latSecond, latDirection);
          // var latt = latDegree + (latMinute / 60) + (latSecond / 3600);

          // var latFinal = ConvertDMSToDD(latDegree, latMinute, latSecond, latDirection);
          // console.log(latFinal);

          // Calculate longitude decimal
          var lonDegree = myData.exifdata.GPSLongitude[0].numerator;
          var lonMinute = myData.exifdata.GPSLongitude[1].numerator;
          var lonSecond = myData.exifdata.GPSLongitude[2].numerator / myData.exifdata.GPSLongitude[2].denominator;
          var lonDirection = myData.exifdata.GPSLongitudeRef;

          // var lon = lonDegree + (lonMinute / 60) + (lonSecond / 3600);
          var lon = ConvertDMSToDD(lonDegree, lonMinute, lonSecond, lonDirection);

          var lonFinal = ConvertDMSToDD(lonDegree, lonMinute, lonSecond, lonDirection);
          // console.log([latt, lon]);
          coordinates =  [latt, lon];

          if(isNaN(latt) || isNaN(lon)) coordinates = [];


        }

        

        
      } catch (error) {
        // console.log(error.message);
        coordinates = [];
      }
      

  });

  return coordinates;
}

function ConvertDMSToDD(degrees, minutes, seconds, direction) {
    
  var dd = degrees + (minutes/60) + (seconds/3600);
  
  if (direction == "S" || direction == "W") {
      dd = dd * -1; 
  }
  
  return dd;
}


function resizeImage(image, size, format = 'image/jpeg'){

  // console.log(format);
    var result = '';

    try {
      var canvas = document.createElement('canvas'),
        max_size = size,// TODO : pull max size from a site config
        width = image.width,
        height = image.height;
      if (width > height) {
          if (width > max_size) {
              height *= max_size / width;
              width = max_size;
          }
      } else {
          if (height > max_size) {
              width *= max_size / height;
              height = max_size;
          }
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(image, 0, 0, width, height);
      result = canvas.toDataURL(format);
    } catch (error) {
      
    }
    

    return result;

}

function create_circ_icon(color, size){
    var canvas = document.createElement('canvas');
    canvas.width  = size;
    canvas.height = size;

    var context = canvas.getContext('2d');
    context.fillStyle = color; //"#000000";
    context.beginPath();
    context.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    context.fill();

    return canvas.toDataURL('image/png');
}


function create_pin_icon(color, size = 20){

    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    
    var centerX = size / 2;
    var centerY = size / 2;
    var rad = centerX * 0.9;
    var startAngle = 0.75 * Math.PI;
    var endAngle = 2.25 * Math.PI;
    var fill = color;
    var stroke = 'black';
    
    var xEnd = centerX + Math.cos(startAngle) * rad - 2;
    var yEnd = centerY + Math.sin(startAngle) * rad - 2;
    
    var xStart = centerX + Math.cos(endAngle) * rad + 2;
    var yStart = centerY + Math.sin(endAngle) * rad - 2;
    
    var bottom = (centerX + rad) + (rad / 1.5);
    
    c.width = centerX * 2;
    c.height = bottom + 1;

    // pin head
    ctx.beginPath();
    ctx.fillStyle = fill;
    ctx.arc(centerX, centerY, // position
        rad, 	// radius
            startAngle,		// start angle
            endAngle,  // end angle
            false);
            
    ctx.lineWidth = 2;
    ctx.srokeStyle = stroke;
    ctx.stroke();
    ctx.fill();
    
    
    // pin dot
    ctx.beginPath();
    ctx.fillStyle = decideForeColor(color); //'white';
    ctx.arc(centerX, centerY, // position
        rad / 2.5, 	// radius
            0,		// start angle
            2 * Math.PI,  // end angle
            false);
    
    ctx.fill();
    
    // pin edge
    ctx.beginPath();
    ctx.fillStyle = fill;
    ctx.lineWidth = 1;
    
    // first index
    ctx.moveTo(xStart, yStart);
    
    // second Index 
    ctx.lineTo(centerX, bottom);
    
    // 3rd Index
    ctx.lineTo(xEnd, yEnd);
    
    ctx.fill();
    ctx.stroke();

    return { width: c.width, height: c.height, icon : c.toDataURL('image/png')};
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

function decideForeColor(color) {
  // console.log(color);
  var R = 0;
  var G = 0;
  var B = 0;

  if(color.startsWith('rgb') === false){
    color = hexToRgb(color);

    R = color.r;
    G = color.g;
    B = color.b;
  }

  // Randomly update colours
  // rgb[0] = Math.round(Math.random() * 255);
  // rgb[1] = Math.round(Math.random() * 255);
  // rgb[2] = Math.round(Math.random() * 255);

  // http://www.w3.org/TR/AERT#color-contrast
  const brightness = Math.round(((parseInt(R) * 299) +
                      (parseInt(G) * 587) +
                      (parseInt(B) * 114)) / 1000);
  const foreColor = (brightness > 125) ? 'black' : 'white';
  // console.log(foreColor + ' -> ' + 'rbg(' + R + ',' + G + ', ' + B + ')');
  return foreColor;
  
}


function remove_obj_item(arr, property, value){
  var index = arr.findIndex(a => a[property] === value);
  if(index >= 0){
      arr.splice(index, 1);
  }
}


function create_random_16_num(){
  var numVector = [];
  for(i = 1; i <= 16; i++){
    numVector.push(getRandomNumber(0, 9));
  }

  return numVector.join('');
}



/*
|------------------------------------------------------
| MODAL FUNCTIONS
|------------------------------------------------------
*/

function init_loading(state = 'show', message = '', centered = false){
    var states = ['show', 'hide'];
    var loading_modal = $((centered === false ? '#loading-modal' : '#loading-centered-modal'));

    // console.log('setting' + loading_modal.attr('id') + ' modal');
    // return;
    if(states.includes(state) === false) state = 'hide';
    // console.log(state);
    

    
    
    if(state === 'hide'){
        setTimeout(() => {

            loading_modal.modal(state);

        }, 500);

      
    }else{

        loading_modal.modal('show');
        loading_modal.find('#message').text(message);
    }

  // if(loading_modal === undefined) console.log('not initialized yet');

      
  
}



function success(state = 'show', message = ''){
    var states = ['show', 'hide'];
    if(states.includes(state) === false) state = 'hide';
    
    var success_modal = $('#success-modal');
      success_modal.modal(state);

      // set message
      success_modal.find('#message').text(message);


      if(state === 'show'){
          init_loading('hide');
          
          setTimeout(() => {
              success_modal.modal('hide');
          }, 2000);
      }

}


/*
|------------------------------------------------------
| FILE MANAGEMENT
|------------------------------------------------------
*/

function download_file(url, filename, deleteSource = false, centered = false){
    var request = new XMLHttpRequest();
      
        request.addEventListener('readystatechange', function(e) {

            if(request.readyState == 2 && request.status == 200) {
              // Download is being started
              // console.log('Download ' + filename + ' started');
              init_loading('show', 'Downloading...', true);
            }

            else if(request.readyState == 3) {
              // Download is under progress
            }
            else if(request.readyState == 4) {
              // Downloaing has finished

              var href = URL.createObjectURL(request.response);
              var a    = Object.assign(document.createElement("a"),{
                  href, 
                  style : "display:none",
                  download : filename
              });
          
              document.body.appendChild(a);
              a.click();
          
              URL.revokeObjectURL(href);
              a.remove();


              if(deleteSource === true) delete_file(url.replace(base_url, ""));

              
              // init_loading('hide');

              // init_loading('hide', 'Downloading...');

              // // Set href as a local object URL
              // document.querySelector('#save-file').setAttribute('href', _OBJECT_URL);
              
              // // Set name of download
              // document.querySelector('#save-file').setAttribute('download', 'img.jpeg');
              
              // // Recommended : Revoke the object URL after some time to free up resources
              // // There is no way to find out whether user finished downloading
              // setTimeout(function() {
              //   window.URL.revokeObjectURL(_OBJECT_URL);
              // }, 60*1000);
            }
        });
      
      request.addEventListener('progress', function(e) {
        var percent_complete = Math.floor((e.loaded / e.total)*100);

        
        console.log(percent_complete + '%');
        init_loading('show', 'Downloading...' + percent_complete + '%', true);


        if(e.loaded >= e.total){
          init_loading('hide', '', true);
        }
      });
      
      request.responseType = 'blob';
      
      // Downloading a file file
      request.open('get', url); 
      
      request.send(); 
}


function delete_file(path){
  $.ajax({
    url : base_url + 'project/delete_file',
    method: 'POST',
    data : {path : path},
    success:function(data){
      try {
        var result = JSON.parse(data);
        if(result.status !== 'success'){
          console.log('An error occurred while deleting file');
          console.log(result.error);
          return;
        }
      } catch (error) {
        console.log(error.message);
      }
    },
    error : function(e){
      // console.log(e.responseText);
      console.log('An error occurred while deleting file');
    }
  });
}



/*
|--------------------------------------------------------------
|   OBJECTS
|--------------------------------------------------------------
*/

var projects = {

    save_map_requirement : function(sp_type, elements = []){

        var save_result = { status : 'success'};

        $.ajax({
            url : base_url + 'project/save_sp_map_requirements',
            data : {
                sp_type : sp_type,
                map_elements : JSON.stringify(elements)
            },
            method: 'POST',
            async : false,
            beforeSend : function(){
                init_loading('show', 'Saving...');
            },
            complete : function(){
                init_loading('hide', 'Saving...');
            },
            success: function(data){
                
                try{
                    var result = JSON.parse(data);
                    if(result.status !== 'success'){
                        save_result.status = 'error';
                        save_result.error = result.error;
                    }
                }catch(error){
                    // console.log(error.message);
                    save_result.status = 'error';
                    save_result.error = error.message;
                }
            },
            error : function(e){
                // console.log(e.responseText);
                save_result.status = 'error';
                save_result.error = e.responseText;
            }
        });

        return save_result;

    },
    get_sp_map_requirements : function(sp_type){

          var fetch_result = {
              status : 'success'
          };

          $.ajax({
            url : base_url + 'project/get_map_requirements',
            data : {
                sp_type : sp_type
            },
            method: 'POST',
            async : false,
            beforeSend : function(){
                init_loading('show', 'Loading...');

            },
            complete : function(){
                init_loading('hide', 'Saving...');
            },
            success: function(data){
                try{

                    var result = JSON.parse(data);
                    if(result.status !== 'success'){

                        fetch_result.status = 'error';
                        fetch_result.error  = result.error;
                    }else{
                       fetch_result.sp_map_requirements = result.map_requirements;
                    }

                }catch(error){
                    console.log(error.message);
                    fetch_result.status = 'error';
                    fetch_result.error = error.message;
                }
            },
            error : function(e){
                console.log(e.responseText);
                fetch_result.status = 'error';
                fetch_result.error = e.responseText;
            }
        });


        // console.log(fetch_result);


        return fetch_result;
    }, // ---> END OF GET SP MAP REQUIREMENTS

    get_sp_map_layers_by_requirement : function(prjID){

          var fetch_result = {
              status : 'success'
          };

          $.ajax({
            url : base_url + 'project/get_sp_map_layers_by_requirement',
            data : {
              prjID : prjID
            },
            method: 'POST',
            async : false,
            beforeSend : function(){
                init_loading('show', 'Loading...');

            },
            complete : function(){
                init_loading('hide', '...');
            },
            success: function(data){
                // console.log(data);
                try{

                    var result = JSON.parse(data);
                    if(result.status !== 'success'){

                        fetch_result.status = 'error';
                        fetch_result.error  = result.error;
                    }else{
                       fetch_result.sp_map_layers = result.sp_map_layers;
                    }

                }catch(error){
                    console.log(error.message);
                    fetch_result.status = 'error';
                    fetch_result.error = error.message;
                }
            },
            error : function(e){
                console.log(e.responseText);
                fetch_result.status = 'error';
                fetch_result.error = e.responseText;
            }
        });


        // console.log(fetch_result);


        return fetch_result;
    } // ---> END OF GET SP MAP LAYER BY REQUIREMENT
}


