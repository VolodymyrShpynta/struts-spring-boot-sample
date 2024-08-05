<%@taglib uri="http://struts.apache.org/tags-html" prefix="html" %>
<%@taglib uri="http://struts.apache.org/tags-logic" prefix="logic" %>

<html>
<head>
    <title>Custom searchable dropdown sample</title>
    <link rel="stylesheet" href="css/searchable-dropdown.css"/>
</head>

<body>
<h1>Searchable dropdown example</h1>

<html:form action="showCity.do" method="GET">
    <div class="wrapper">
        <div class="select-btn">
            <input type="text" name="cityName" readonly>
            <span class="angle-down">&#xfe40;</span>
        </div>
        <div class="content">
            <div class="search">
                <input type="text" placeholder="Search..">
            </div>
            <ul class="options">
            </ul>
        </div>
    </div>

    <html:errors/>
    <html:submit value="Show City"/>
</html:form>

<script type="text/javascript" src="js/autocomplete.js"></script>
</body>
</html>
