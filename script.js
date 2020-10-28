var school = "pulaski-academy-bruins-(little-rock,ar)";

function ddlSchool_onchange() {
	$("*").addClass("wait");
	$("#divLeft > table > tbody").html("");
	$("#divRight > table > tbody").html("");
	loadContent(
		'<script id="__NEXT_DATA__" type="application/json">',
		"<" + "/script>",
		"https://www.maxpreps.com/high-schools/" +
			$("#ddlSchool").val() +
			"/football/roster.htm"
	);
}

function loadContent(start, end, urlToScrape) {
	// workaround for cross origin requests
	$.ajaxPrefilter(function (options) {
		if (options.crossDomain && jQuery.support.cors) {
			const http = window.location.protocol === "http:" ? "http:" : "https:";
			options.url = http + "//cors-anywhere.herokuapp.com/" + options.url;
		}
	});

	// get request
	$.ajax({
		url: urlToScrape,
		method: "GET"
	}).done(function (data) {
		var intStart = data.indexOf(start) + start.length;
		var intEnd = data.indexOf(end, intStart);
		var selectedData = data.substring(intStart, intEnd);
		var obj = JSON.parse(selectedData);

		$("#divHeader").text(
			obj.props.pageProps.teamContext.data.schoolName +
				" " +
				obj.props.pageProps.teamContext.data.schoolMascot
		);

		for (var x = 0; x < obj.props.pageProps.roster.length; x++) {
			if (obj.props.pageProps.roster[x].isDeleted) {
				obj.props.pageProps.roster.splice(x, 1);
			}
		}

		var intPageLength = Math.round(obj.props.pageProps.roster.length / 2) - 1;
		var whereItGoes = "#divLeft";

		for (var x = 0; x < obj.props.pageProps.roster.length; x++) {
			if (x > intPageLength) {
				whereItGoes = "#divRight";
			}
			var player = obj.props.pageProps.roster[x];

			if (player.weight == 0) {
				player.weight = " ";
			}
			if (player.weight == null) {
				player.weight = " ";
			}
			if (player.jersey == null) {
				player.jersey = " ";
			}
			if (player.position1 == null) {
				player.position1 = " ";
			}

			$(whereItGoes + " > table > tbody:last-child").append(
				"<tr><td>" +
					player.jersey +
					"</td><td>" +
					player.formattedName +
					" </td><td>" +
					player.position1 +
					" </td><td>" +
					player.formattedHeight +
					" </td><td>" +
					player.weight +
					" </td><td>" +
					player.formattedClassYear +
					" </td></tr>"
			);
		}
		$("*").removeClass("wait");
	});
}

ddlSchool_onchange();
