let isloadOssSdk = false;
let ossClient =  null;

function atuUpload(config){
  this.accessKeyId=''
  this.accessKeySecret=''
  this.region="oss-cn-shanghai"
  this.stsToken=''
  this.bucket='atuad'
  this.path='tmp'
  this.isOss=true
  this.name='file'
  if(config){
    for (var key in config) {
      if (config.hasOwnProperty(key)) {
        this[key] = config[key]
      }
    }
  };


    if(this.isOss){
      $.loadFile(['//gosspublic.alicdn.com/aliyun-oss-sdk-6.16.0.min.js'], { all: function (d) {isloadOssSdk=true}});
      $.get('//res.attus.cn/sts?t='+Math.random(), function (result){
        let _set={'accessKeyId':result.accessKeyId,'accessKeySecret': result.accessKeySecret,'stsToken':result.securityToken}
        _this.config(_set)
        _set.region=_this.region
        _set.bucket=_this.bucket
        _set.refreshSTSToken= true,
        _set.refreshSTSTokenInterval= 600 * 1000
        ossClient=new OSS(_set)
      },"json")
    }else{
      $.loadFile(['//oss.alextu.cn/js/md5.js']);
    }
 
  this.upload=function(file,uploading,callback){
    if(!callback){
      callback=uploading
      uploading=null;
    }
    let _this=this;
    let fileMd5=md5(file.name+file.size)
    $.get("http://api.alextu.cn/file/checkMd5/?md5="+fileMd5+"&t="+Math.random(),function (data){
      if(data.result){
				_this.goUpload(file,uploading,callback)
			}else{
        callback(data.file)
			}
    },"json")
  }
  this.goUpload=function(file,uploading,callback){
    //  const file = dataURLToBlob(base64String);
    let fileMd5=md5(file.name+file.size)
    if(this.isOss){
      let obj = timestamp();
      let storeAs = this.path+'/' + obj + ".jpg";
      ossClient.multipartUpload(storeAs, file, {
        progress: function* (percentage) {
          uploading && uploading(100 * percentage)
        }
      }).then(function (result) {
    
        var ourl = result.res.requestUrls[0];
        var length = ourl.lastIndexOf('?') > 0 ? ourl.lastIndexOf('?') : ourl.length;
        var imgUrl = ourl.substr(0, length);
        callback && callback(imgUrl)
      }).catch(function (err) {
        console.log(err);
      });
    }else{
      var fd = new FormData();
      let fn=this.name
      console.log("fn",fn)
      var ext=file.name.substring(file.name.lastIndexOf('.'))
          fd.append('fn',fn );
          fd.append('name',file.name);//文件名
          fd.append('lastModified', file.lastModified);
          fd.append('size', file.size);
          fd.append('type', file.type);
          fd.append('uploadType', 1);
          fd.append('extention', ext);  //扩展名
          fd.append('md5',fileMd5)
          fd.append(fn, file);

            var xhr = new XMLHttpRequest();
            xhr.open('post', 'http://api.alextu.cn/file/upload/?fn='+fn+'&type='+fd.get("uploadType")+'&t='+Math.random(), true);
            xhr.onreadystatechange = function () {
              if (xhr.readyState == 4 && xhr.status == 200) {
                var data = eval('(' + xhr.responseText + ')');
                callback(data)
                xhr = null;
                
              }
            }
            xhr.upload.onprogress=function(evt){  
              per=Math.floor(100*evt.loaded/evt.total)+"%"
              uploading && uploading(per); 
              
            }
            xhr.send(fd);
         
    }
     
  };
}
Atu.upload = atuUpload;


(function (a) {

	a.upload = function (file,uploading,callback) {
    
    
      if(!callback){
        callback=uploading
      }
      if (!isloadOssSdk||!ossClient) {
        setTimeout(function () { a.upload(file,uploading,callback); }, 100);
        return;
      }
	};
	
	a.fn.upload = function (file,uploading,callback) {
		a.upload(this, file,uploading,callback);
		return this
	};

	a.upload.config = {
		bucket: 'atuad',
		isOss: true
	}
})(Atu);