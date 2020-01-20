package org.complate.spring.boot.sample;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class SampleController {

    @GetMapping("/")
    public ModelAndView index() {
        return new ModelAndView("Person")
            .addObject("age", "99")
            .addObject("name", "John Doe");
    }

    @GetMapping("/bootstrap")
    public ModelAndView bootstrap() {
        return new ModelAndView("BootstrapSample")
            .addObject("text", "Lorem Ipsum")
            .addObject("title", "Bootstrap Sample");
    }
}
