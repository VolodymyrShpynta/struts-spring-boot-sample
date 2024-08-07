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
    <div id="cities-dropdown">
        <div>
            <input type="hidden" name="cityName">
        </div>
        <div>
            <div>
                <input type="text" placeholder="Search..">
            </div>
        </div>
    </div>

    <html:errors/>
    <html:submit value="Show City"/>
</html:form>

<script type="text/javascript">
    <%-- Serialization is required to transfer cities list from the server to the client: --%>
    let cities = <%= JsonUtils.serialize(request.getAttribute("citiesList"))%>;
    cities = cities ? cities : [];
    initSearchableDropdown("#cities-dropdown", cities);
</script>
</body>
</html>
