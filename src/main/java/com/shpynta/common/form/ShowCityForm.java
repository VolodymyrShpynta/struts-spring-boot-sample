package com.shpynta.common.form;

import lombok.Getter;
import lombok.Setter;
import org.apache.struts.action.ActionErrors;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.action.ActionMessage;

import javax.servlet.http.HttpServletRequest;

@Getter
@Setter
public class ShowCityForm extends ActionForm {

    String cityName;

    @Override
    public ActionErrors validate(ActionMapping mapping, HttpServletRequest request) {
        ActionErrors errors = new ActionErrors();
        if (cityName == null || cityName.isEmpty()) {
            errors.add("name", new ActionMessage("error.form.name.required"));
        }
        return errors;
    }
}