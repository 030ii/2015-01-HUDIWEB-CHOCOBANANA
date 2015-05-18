/**
 * Created by dahye.
 * Module Patternized by dahye on 2015. 4. 18
 */
ubuntudo.ui.TodoManager = (function() {
	'use strict';
    //HTML에 의존하는 클래스 네임
    var CLASSNAME = {
		PAST: "past",
		TODAY: "today",
		FUTURE: "future"
	};

    //CSS에 의존하는 리스트 템플릿
    var LIST_TEMPLATE = '<li class="todo"><span class="tid"><%=tid%></span><span class="pid"><%=pid%></span><div class="party_pavicon"><%=partyFirstAlphabet%></div><h2><%=title%></h2><p><%=date%>일 <%=explain%></p><a class="complete_btn"></a></li>';
      
    function TodoManager () {  
    };
    TodoManager.prototype.appendList = function (data, fieldName) {
        var elTargetList = {};
        var now = new Date();
        var today = new Date(now.yyyymmdd());
        var dataLength = data.length;

        //elTargetList mapping
        Object.keys(CLASSNAME).forEach( function(key) {
            var element = CLASSNAME[key];
            elTargetList[element] = document.querySelector("." + element);
            elTargetList[element].innerHTML = ""; //innerHTML 초기화
        });

        //duedate에 따라 각 섹션에 투두 추가
        for(var i = 0; i < dataLength; i++) {
            var todoInfo = data[i];
            var due = new Date(todoInfo[fieldName.DUEDATE]);
            var dayDiff = Math.abs(due.diffDays(today));
            var explain = "남음";
            var elTarget;
            if(dayDiff === 0) {
                elTarget = elTargetList[CLASSNAME.TODAY];
            }else if(due > today) {
                elTarget = elTargetList[CLASSNAME.FUTURE];
            }else {
                explain = "지남";
                elTarget = elTargetList[CLASSNAME.PAST];
            }
            elTarget.innerHTML += _makeInnerHTML(todoInfo, dayDiff, explain, fieldName);
        }
    };

    TodoManager.prototype.complete = function (ev, oDataManager) {
        ev.stopPropagation();
        var elTarget = ev.target;
        var elSibling = elTarget.parentElement.childNodes;
        var siblingCount = elTarget.parentElement.childElementCount;
        var i;
        var tid;

        //sibling 중 classname 이 tid인 녀석을 찾아 value를 찾는다.
        for(i = 0; i < siblingCount; i++){
            if(elSibling[i].className === "tid") {
                tid = elSibling[i].innerHTML;
                break;
            }
        }

        ubuntudo.utility.ajax({
            "method": "GET",
            "uri": "/personal/todo/complete/" + tid,
            "param" : null,
            "callback" : oDataManager.removeData
        });
    };

    /*클래스네임, 태그네임 등 html에 의존하는 부분 빼야한다. 리팩토링 필요 - 다혜 */
    TodoManager.prototype.add = function (ev, oDataManager) {
        ev.preventDefault();
		ev.stopPropagation();

		//var form = document.querySelector(".add_todo");
		//var pid = form.querySelector(".add_todo select").value;
		var pid = -1;
		var date = document.getElementsByName("date")[0].value;
		if (date === "오늘") {
			date = new Date();
			//date = date.toISOString().slice(0,10).replace(/-/g,"-"); 이러면 27일인데 26일이 나옴. 이유를 찾아보자.
			date = date.yyyymmdd();
		}
		var title = document.getElementsByName("title")[0].value;
		if (title === "") {
			return "제목을 채워야 합니다.";
		}
        
		var contents = document.getElementsByName("contents")[0].value;
		var param = "pid=" + pid + "&dueDate=" + date + "&title=" + title + "&contents=" + contents;

		ubuntudo.utility.ajax({
			"method": "POST",
			"uri": "/todo",
			"param": param,
			"callback": oDataManager.addData
		});
    };

    function _makeInnerHTML (todoInfo, dayDiff, explain, fieldName) {
        var field = fieldName;

        return LIST_TEMPLATE.replace("<%=tid%>", todoInfo[field.TID]).replace("<%=pid%>", todoInfo[field.PARTY_ID]).replace("<%=title%>", todoInfo[field.TITLE]).replace("<%=date%>", dayDiff).replace("<%=explain%>", explain).replace("<%=partyFirstAlphabet%>", todoInfo[field.PARTY_NAME].substring(0,1));
        
    };
    
    Date.prototype.diffDays = function (date) {     
        var date1 = Date.UTC(this.getFullYear(), this.getMonth(), this.getDate());
        var date2 = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
        var ms = Math.abs(date1-date2);
        return Math.floor(ms/1000/60/60/24);     
    };

    Date.prototype.yyyymmdd = function() {
       var yyyy = this.getFullYear().toString();
       var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
       var dd  = this.getDate().toString();
       return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding variable
    };

    return TodoManager;
})();