/**
 * Created by jjungmac on 2015. 4. 5..
 */


ubuntudo.utility.typeCheck = (function () {
	var typeCheck = function (object) {
		var rtn = '';
		if (typeof object === 'object') {
			rtn = Object.prototype.toString
				.call(Object)
				.split(' ')[1]
				.replace(']', '');
		} else {
			rtn = typeof object;
		}
		return rtn;
	}

	return typeCheck;
})();


ubuntudo.utility.getJSONData = ( function () {
	var getData = function (url, callback) {
		var util = ubuntudo.utility;
		var request = new XMLHttpRequest();

		request.open("GET", url, true);
		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		request.send();

		request.onreadystatechange = function () {
			if (request.readyState === 4 && request.status === 200) {
				var result = request.responseText;
				result = JSON.parse(result);
				if(util.typeCheck(callback) === "function") {
					callback(result);
				}
			}
		}
	}

	return getData;
})();

ubuntudo.utility.postJSONData = ( function () {
	var postData = function (url, param , callback) {
		var util = ubuntudo.utility;
		var request = new XMLHttpRequest();

		request.open("POST", url, true);
		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		request.send(param);

		request.onreadystatechange = function () {
			if (request.readyState === 4 && request.status === 200) {
				var result = request.responseText;
				result = JSON.parse(result);
				if(util.typeCheck(callback) === "function") {
					callback(result);
				}
			}
		}
	}

	return postData;
})();
