package com.shpynta.common.action;

import com.shpynta.common.form.ShowCityForm;
import org.apache.struts.action.Action;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class ShowCityAction extends Action {


    @Override
    public ActionForward execute(ActionMapping mapping, ActionForm form,
                                 HttpServletRequest request, HttpServletResponse response) throws Exception {

        ShowCityForm showCityForm = (ShowCityForm) form;
        request.setAttribute("selectedCity", showCityForm.getCityName());

        return mapping.findForward("success");
    }
}
