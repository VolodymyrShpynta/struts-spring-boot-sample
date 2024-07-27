<%@ page import="org.apache.struts.util.LabelValueBean" %>
<%@ page import="java.util.List" %>
<%@taglib uri="http://struts.apache.org/tags-html" prefix="html" %>
<%@taglib uri="http://struts.apache.org/tags-logic" prefix="logic" %>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet"/>
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<script type="text/javascript">
    $(document).ready(function () {
        $('.city-searchable-select').select2();
    });
</script>

<html>
<head>
    <title>Searchable dropdown sample</title>
    <style>
        .city-searchable-select {
            width: 190px;
        }
    </style>
</head>

<body>
<h1>Searchable dropdown example</h1>

<html:form action="showCity.do" method="GET">
    <span class="select">
        <html:select property="cityName" styleClass="city-searchable-select">
            <logic:present name="citiesList">
                <html:option value=""></html:option>
                <html:options collection="citiesList" property="value" labelProperty="label"/>
            </logic:present>
        </html:select>

<%--        <select name="cityName" class="city-searchable-select">--%>
<%--            <logic:present name="citiesList">--%>
<%--                <option value=""/>--%>
<%--                <% for (LabelValueBean value : (List<LabelValueBean>) request.getAttribute("citiesList")) { %>--%>
<%--                    <option value="<%= value.getValue() %>"><%= value.getLabel() %></option>--%>
<%--                <% } %>--%>
<%--            </logic:present>--%>
<%--        </select>--%>

<%--       	<input list="citiesList" id="cityName" name="cityName" placeholder="type here..." autocomplete="off"/>--%>
<%--	    <datalist id="citiesList">--%>
<%--            <% for (LabelValueBean value : (List<LabelValueBean>) request.getAttribute("citiesList")) { %>--%>
<%--                <option value="<%= value.getValue() %>">--%>
<%--            <% } %>--%>
<%--        </datalist>--%>
    </span>
    <html:errors/>
    <html:submit value="Show City"/>
</html:form>

</body>
</html>
