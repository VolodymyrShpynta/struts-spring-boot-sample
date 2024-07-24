package com.shpynta.common.config;

import org.apache.struts.action.ActionServlet;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class ServletConfiguration {

    @Bean
    public ServletRegistrationBean actionServlet() {
        Map<String, String> initParams = new HashMap<>();
        initParams.put("application", "ApplicationResources");
        initParams.put("config", "/WEB-INF/struts-config.xml");

        ServletRegistrationBean srvReg = new ServletRegistrationBean(new ActionServlet(), "*.do");
        srvReg.setName("actionServlet");
        srvReg.setLoadOnStartup(1);
        srvReg.setInitParameters(initParams);

        return srvReg;
    }
}
