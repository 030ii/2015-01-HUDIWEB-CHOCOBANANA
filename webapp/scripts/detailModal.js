ubuntudo.ui.DetailModal = (function() {
	'use strict';
    // HTML에 의존하는 CLASS 캐싱 _ 이것은 익명함수니까 private으로 쓸 수 있다!
	var CLASSNAME = {
		MODAL: "detail_modal",
		TITLE: "title",
		DETAIL: "detail_wrapper",
        TODO: "todo",
        TID: "tid",
        PARTY :"party",
        DUEDATE : "due_date",
        CONTENTS : "note"
	};

    function DetailModal (todoData, fieldName) {
        this.todoData = todoData;
        this.fieldName = fieldName;
        this.elModal = document.querySelector("."+CLASSNAME.MODAL);
        this.elTitle = this.elModal.querySelector("."+CLASSNAME.TITLE);
        this.elDetail = this.elModal.querySelector("."+CLASSNAME.DETAIL);
    }

    DetailModal.prototype.beforeShow = function(ev) {
        var elTarget = ev.target;
        var id;

        //todo찾기
	    while (!(elTarget === null || elTarget.className === CLASSNAME.TODO)) {
		    elTarget = elTarget.parentElement;
	    }

        //tid찾기 - li에다가 data로 심는 게 나을 것 같다.
        for(var j = 0; j < elTarget.childElementCount; j++) {
            if(elTarget.children[j].className === CLASSNAME.TID) {
                id = elTarget.children[j].innerHTML * 1; // 1을 곱한 건 string->int변환하기 위해
                break;
            }
        }

        //data[i]["tid"] = id인 인덱스 i 찾기
	    var util = ubuntudo.utility;
        var index = util.findIndex(this.todoData, "tid", id);

        //data 불러오기
        var todoInfo = this.todoData[index];
        var field = this.fieldName;

        //모달창에 title심기, tid, pName, contents, duedate 심기
        this.elTitle.innerHTML = todoInfo[field.TITLE];
        for(var i = 0; i < this.elDetail.childElementCount; i++) {
            if(this.elDetail.children[i].className === CLASSNAME.TID) {
                this.elDetail.children[i].innerHTML = todoInfo[field.TID];
            }
            else if(this.elDetail.children[i].className === CLASSNAME.PARTY) {
                this.elDetail.children[i].innerHTML = todoInfo[field.PARTY_NAME];
            }
            else if(this.elDetail.children[i].className === CLASSNAME.DUEDATE) {
                this.elDetail.children[i].innerHTML = (new Date(todoInfo[field.DUEDATE])).yyyymmdd();
            }
            else if(this.elDetail.children[i].className === CLASSNAME.CONTENTS) {
            	this.elDetail.children[i].value = todoInfo[field.CONTENTS];
            }
        }
    };

    return DetailModal;
})();