<%@ page import="org.apache.struts.util.LabelValueBean" %>
<%@ page import="java.util.List" %>
<%@taglib uri="http://struts.apache.org/tags-html" prefix="html" %>
<%@taglib uri="http://struts.apache.org/tags-logic" prefix="logic" %>

<html>

<head>
</head>

<body>
<h1>Searchable dropdown example</h1>

<html:form action="showCity.do" method="GET">
    <span class="select">
<%--        <html:select property="cityName" styleClass="long">--%>
<%--            <logic:present name="citiesList">--%>
<%--                <html:option value=""></html:option>--%>
<%--                <html:options collection="citiesList" property="value" labelProperty="label"/>--%>
<%--            </logic:present>--%>
<%--        </html:select>--%>

<%--        <select name="cityName" styleClass="long">--%>
<%--            <logic:present name="citiesList">--%>
<%--                <% for (LabelValueBean value : (List<LabelValueBean>) request.getAttribute("citiesList")) { %>--%>
<%--                    <option value="<%= value.getValue() %>"><%= value.getLabel() %></option>--%>
<%--                <% } %>--%>
<%--            </logic:present>--%>
<%--        </select>--%>

       	<input list="citiesList" id="cityName" name="cityName" placeholder="type here..."/>
	    <datalist id="citiesList">
            <% for (LabelValueBean value : (List<LabelValueBean>) request.getAttribute("citiesList")) { %>
                <option value="<%= value.getValue() %>">
            <% } %>
        </datalist>
    </span>
    <html:errors/>
    <html:submit value="Show City"/>
</html:form>

</body>
</html>
