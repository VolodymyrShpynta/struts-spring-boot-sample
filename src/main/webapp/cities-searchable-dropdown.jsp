<%@taglib uri="http://struts.apache.org/tags-html" prefix="html" %>
<%@taglib uri="http://struts.apache.org/tags-logic" prefix="logic" %>

<html>

<head>
</head>

<body>
<h1>Searchable dropdown example</h1>

<html:form action="showCity.do" method="GET">
    <span class="select"><html:select property="cityName" styleClass="long">
        <logic:present name="citiesList">
            <html:option value=""></html:option>
            <html:options collection="citiesList" property="value" labelProperty="label"/>
        </logic:present>
    </html:select></span>
    <html:errors/>
    <html:submit value="Show City"/>
</html:form>

</body>
</html>
