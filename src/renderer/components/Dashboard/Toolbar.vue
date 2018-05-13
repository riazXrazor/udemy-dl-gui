<template>
    <ul class="nav">
		<li id="search">
				<input type="text" name="search_text" id="search_text" placeholder="Enter course url"/>
				<input type="button" name="search_button" id="search_button">
		</li>
	</ul>
</template>
<style scoped>
    @import url(http://fonts.googleapis.com/css?family=Montserrat);

* {
	margin: 0; 
	padding: 0;
}

.nav {
	background: #232323;
	height: 60px;
	display: block;
    width: 100%;
}

.nav li {
	float: left;
	list-style-type: none;
	position: relative;
}

.nav li a {
	font-size: 16px; 
	color: white;
	display: block;
	line-height: 60px;
	padding: 0 26px;
	text-decoration: none;
	border-left: 1px solid #2e2e2e;
	font-family: Montserrat, sans-serif;
	text-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
}
.nav li a:hover {
	background-color: #2e2e2e;
}

#settings a {
	padding: 18px;
	height: 24px;
	font-size: 10px;
	line-height: 24px;
}

#search {
	width: 100%;
	margin: 4px;
}
#search_text{
	width: 86%;
	padding: 15px 0 15px 20px;
	font-size: 16px;
	font-family: Montserrat, sans-serif;
	border: 0 none;
	height: 52px;
	margin-right: 0;
	color: white;
	outline: none;
	background: #1f7f5c;
	float: left;
	box-sizing: border-box;
	transition: all 0.15s;
}
::-webkit-input-placeholder {
	color: white;
}

#search_text:focus {
	background: rgb(64, 151, 119);
}
#search_button {
	border: 0 none;
	background: #1f7f5c url(~@/assets/search.png) center no-repeat;
	width: 12%; 
	float: left;
	padding: 0;
	text-align: center;
	height: 52px;
	cursor: pointer;
}

</style>
