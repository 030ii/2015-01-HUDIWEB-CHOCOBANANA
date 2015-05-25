/*
파티목록에서 (파티 목록 나열은 현재 만든 순으로 pid가 결정되며 pid순으로 정렬이 되고 있다)
- 내가 가입한 파티(state = 1) / 내가 가입하지 않은 파티(state = -1)에 대해서는 파티 색깔로 구분하기
*/


// 길드 헤더에 길드 정보(길드명, 리더이름, 멤버수, 파티수)를 setting하고
// 길드 안에 있는 모든 파티들을 보여주는 함수
ubuntudo.ui.GuildDataManager = (function () {
	function GuildDataManager () {
		this.guildInfo = {};
		this.originalPartyAddBox = originalPartyAddBox;
	}

	GuildDataManager.prototype.setGuildInfo = function (guildInfoData) {
		this.guildInfo = guildInfoData;
		var data = guildInfoData;
		var guildName = guildInfoData["result"].guildDetail[0].g_name;
		var leader = guildInfoData["result"].guildDetail[0].name;
		var members = guildInfoData["result"].guildDetail[0].members;
		var parties = guildInfoData["result"].guildDetail[0].parties;
		
		var G_NAME_TEMPLATE = '<h1 class="guild_name"><%=g_name%></h1>';
		var G_INFO_TEMPLATE = '<span class="leader_name">리더 <%=leader%></span> <span>•</span> <span>멤버 <%=members%></span> <span>•</span> <span class="partyNum">파티 <%=parties%></span>';
		var G_PARTY_LIST_TEMPLATE = '<div class="party_list"><a href="/party/<%=pid%>" class="party_name"><%=p_name%></a></div>';

		
		// 길드 헤더에 길드 정보 적용 
		document.getElementsByClassName("g_name")[0].innerHTML = G_NAME_TEMPLATE.replace("<%=g_name%>", guildName);
		document.getElementsByClassName("guild_info")[0].innerHTML = G_INFO_TEMPLATE.replace("<%=leader%>", leader).replace("<%=members%>", members).replace("<%=parties%>", parties);
		
		// 길드 안에 있는 모든 파티들을 보여줌 
		for (var i = 0; i < guildInfoData["result"].parties.length; i++) {
			document.getElementsByClassName("added_party")[0].innerHTML += G_PARTY_LIST_TEMPLATE.replace("<%=p_name%>", guildInfoData["result"].parties[i].p_name).replace("<%=pid%>", guildInfoData["result"].parties[i].pid);

		}
	}

	GuildDataManager.prototype.addPartyCallback = function (result) {
		if (result.status === "success"){
			var newParty = document.createElement("div");
			var newPartyName = document.createElement("a");
			var partyName = document.getElementsByClassName("input_partyName")[0].value;
			var text = document.createTextNode(partyName);
			var pid = result.newPid;
			
			// css 추가
			newParty.className = "party_list";
			newPartyName.className = "party_name";
			
			// a태그에 href 추가 
			newPartyName.setAttribute("href", "/party/"+pid);
			
			// 파티 목록에 파티 추가
			document.getElementsByClassName("added_party")[0].appendChild(newParty);
			newParty.appendChild(newPartyName);
			newPartyName.appendChild(text);
			
			// 길드 헤더에 파티수 추가 (프론트)
			var presentPartyNum = Number(document.getElementsByClassName("partyNum")[0].innerHTML.split(" ")[1]);
			presentPartyNum = presentPartyNum + 1;
			document.getElementsByClassName("partyNum")[0].innerHTML = "파티 " + presentPartyNum;
			
			originalPartyAddBox();
		}
		else {
			alert("파티 생성에 실패했습니다. 다시 만들어주세요.");
		}
	}

	// 다시 원래 모양으로 partyAddBox가 돌아옴 
    function originalPartyAddBox () {
        document.getElementsByClassName("input_partyName")[0].value = "";
        document.getElementById("party_add_box_btn").style.display = "block";
        document.getElementById("partyName_input_box_btn").style.display = "none";
    }

	return GuildDataManager;
})();