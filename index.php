<?php
	$time=time();
?><!doctype html>
<html>
	<head>
		<meta charset="utf-8"/>
		<title>ten.js</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
		<meta name="HandheldFriendly" content="true"/>
		<script src="ten.min.js" type="application/javascript"></script>
		<style type="text/css">
			html, body {
				margin:0;
			}
			.active {
				background:red;
			}
			header {
				width:100%;
				position:fixed;
				top:0;
				left:0;
				z-index:100;
			}
			header div {
				display:inline-block;
				margin:5px;
			}
			.yellow {
				background:yellow;
			}
		</style>
	</head>
	<body>
		<header id="test"></header>
		<div id="files">
			<div data-src="ten.js"></div>
		</div>
		<script type="application/javascript">
			(function($) {
				$.ready(function() {
					var test=$.find("#test");
					test.toggle("active");
					var array=['<div class="yellow">test</div>','<div class="yellow">hey</div>'];
					$.each(array,function(key,value) {
						test.append(value);
					});
				});
			})(ten);
		</script>
	</body>
</html>
