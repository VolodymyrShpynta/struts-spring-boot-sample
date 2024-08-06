<%@ page import="com.shpynta.common.util.JsonUtils" %>
<%@taglib uri="http://struts.apache.org/tags-html" prefix="html" %>
<%@taglib uri="http://struts.apache.org/tags-logic" prefix="logic" %>

<html>
<head>
    <title>Custom searchable dropdown sample</title>
    <link rel="stylesheet" href="css/searchable-dropdown.css"/>
    <script type="text/javascript" src="js/searchable-dropdown.js"></script>
</head>

<body>
<h1>Searchable dropdown example</h1>

<html:form action="showCity.do" method="GET">
    <div class="searchable-dropdown">
        <div class="searchable-dropdown-select-btn">
            <span></span>
            <span class="searchable-dropdown-angle-down">&#xfe40;</span>
            <input type="hidden" name="cityName">
        </div>
        <div class="searchable-dropdown-content">
            <div class="searchable-dropdown-search">
                <input type="text" placeholder="Search..">
            </div>
            <ul class="searchable-dropdown-options"></ul>
        </div>
    </div>

    <html:errors/>
    <html:submit value="Show City"/>
</html:form>

<script type="text/javascript">
    <%-- Serialization is required to transfer cities list from the server to the client: --%>
    let cities = <%= JsonUtils.serialize(request.getAttribute("citiesList"))%>;
    cities = cities ? cities : [];
    initSearchableDropdown(cities);
</script>
</body>
</html>
