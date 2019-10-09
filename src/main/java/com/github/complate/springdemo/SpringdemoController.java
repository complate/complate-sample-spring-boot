package com.github.complate.springdemo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@Controller
public class SpringdemoController {

    private Map<String, String> model;

    @GetMapping("/")
    public ModelAndView index(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        model = new HashMap<>();
        model.put("age", "99");
        model.put("name", "John Doe");
        return new ModelAndView("Person", model);
    }

    @GetMapping("/bootstrap")
    public ModelAndView bootstrap(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        model = new HashMap<>();
        model.put("text", "Lorem Ipsum");
        model.put("title", "Bootstrap Sample");
        return new ModelAndView("BootstrapSamlpe", model);
    }
}
