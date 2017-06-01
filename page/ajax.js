/* jshint esversion: 6 */
/**
 * [description]
 * @return {[type]} [description]
 */
yang = function(){

};

yang.prototype = {

  constructor: yang,

  ajax (url, settings) {

    // If url is an object as settings...
    if( typeof url === 'object' ){
      settings = url;
      url = settings.url || undefined;
    }

    settings = settings || {};

    settings.method = settings.method || settings.type || 'GET';

    // console.log(url, settings);

    let yangXHRPromise = new Promise( (resolve, reject) => {
      // instance a XMLHttpRequest Object
      let xhr = new XMLHttpRequest();

      //
      xhr.open(
        settings.method,
				url,
				settings.async !== undefined ? settings.async : true ,
				settings.username || null ,
				settings.password || null
      );

      // Override mime type if needed
      if( typeof settings.mimetype === 'string' ){
        xhr.overrideMimeType( settings.mimetype );
      }

      //
      if( typeof settings.contentType === 'string' ){
        settings['Content-Type'] = settings.contentType;
      }
      else{
        settings['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
      }
      delete settings.contentType;

      // Set the Accepts header for the server, depending on the dataType
      if( typeof settings.dataType === 'string' ){
        settings.accept = settings.dataType;
      }
      delete settings.dataType;

      // sets the value of an HTTP request header
      if( typeof settings.headers === 'object' ){
        let headers = settings.headers;
        for ( let header in headers )
          xhr.setRequestHeader( header.toLowerCase(), headers[header] );
      }

      // timeout property is an unsigned long representing the number of milliseconds
      if( typeof settings.timeout === 'number' ){
        xhr.timeout = settings.timeout;
      }
      if( typeof settings.ontimeout === 'function' ){
        xhr.ontimeout = settings.ontimeout;
      }

      // The progress event is fired to indicate that an upload or download is in progress.
      if( typeof settings.progress === 'object' ){
        if( typeof settings.progress.uploadProgress === 'function' ){
          xhr.upload.addEventListener('progress', settings.progress.uploadProgress);
        }
        if( typeof settings.progress.downloadProgress === 'function' ){
          xhr.addEventListener('progress', settings.progress.downloadProgress);
        }
      }

      // An EventHandler that is called whenever the readyState attribute changes.
      xhr.onreadystatechange = () => {
        if ( xhr.readyState === 4 ){
          if( xhr.status>=200 &&  xhr.status<=299 ){
            resolve( xhr );
          }
          else{
            reject(error);
          }
        }
      };

      // send the request
      try{
        // Do send the request (this may raise an exception)
        xhr.send( settings.data || null );
      }
      catch (error) {
        reject(error);
      }

    });
    return yangXHRPromise;
  }
};
