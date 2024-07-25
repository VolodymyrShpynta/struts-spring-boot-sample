package com.shpynta.common.action;

import com.shpynta.common.form.HelloForm;
import com.shpynta.common.service.GreetingProvider;
import lombok.Setter;
import org.apache.struts.action.Action;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Setter
public class HelloAction extends Action {

    private GreetingProvider greetingProvider;


    public ActionForward execute(ActionMapping mapping, ActionForm form,
                                 HttpServletRequest request, HttpServletResponse response) throws Exception {

        HelloForm helloForm = (HelloForm) form;
        request.setAttribute("greeting", greetingProvider.getGreeting(helloForm.getName()));

        return mapping.findForward("success");
    }
}
