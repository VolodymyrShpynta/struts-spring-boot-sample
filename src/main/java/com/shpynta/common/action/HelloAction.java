package com.shpynta.common.action;

import com.shpynta.common.form.HelloForm;
import org.apache.struts.action.Action;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class HelloAction extends Action {


    public ActionForward execute(ActionMapping mapping, ActionForm form,
                                 HttpServletRequest request, HttpServletResponse response) throws Exception {

        HelloForm helloForm = (HelloForm) form;
        request.setAttribute("greeting", "Hello..." + helloForm.getName());

        return mapping.findForward("success");
    }

}
