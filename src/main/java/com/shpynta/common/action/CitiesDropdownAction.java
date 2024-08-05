package com.shpynta.common.action;

import org.apache.struts.action.Action;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.util.LabelValueBean;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static java.util.Arrays.asList;

public class CitiesDropdownAction extends Action {


    @Override
    public ActionForward execute(ActionMapping mapping, ActionForm form,
                                 HttpServletRequest request, HttpServletResponse response) throws Exception {

        request.setAttribute("citiesList",
                asList(labelBean("Kyiv"),
                        labelBean("Berlin"),
                        labelBean("Prague"),
                        labelBean("Paris"),
                        labelBean("New-York"),
                        labelBean("Washington")
                ));

        return mapping.findForward("success");
    }

    private LabelValueBean labelBean(String name) {
        return new LabelValueBean(name.toUpperCase(), name);
    }
}
