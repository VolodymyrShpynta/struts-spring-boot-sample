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
        <span class="searchable-dropdown-search-placeholder" hidden>Search..</span>
        <html:select name="showCityForm" property="cityName">
            <logic:present name="citiesList">
                <html:option value=""></html:option>
                <html:options collection="citiesList" property="value" labelProperty="label"/>
            </logic:present>
        </html:select>
    </div>

    <html:errors/>
    <html:submit value="Show City"/>
</html:form>

<script type="text/javascript">
    new SearchableDropdown("#cities-dropdown");
</script>
</body>
</html>
