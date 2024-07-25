<%@taglib uri="http://struts.apache.org/tags-html" prefix="html" %>

<html>

<head>
</head>

<body>
<h1>Hello form</h1>

<html:form action="hello.do">
    NAME: <html:text property="name"/> <html:errors/>
    <html:submit value="SayHallo"/>
</html:form>

</body>
</html>
