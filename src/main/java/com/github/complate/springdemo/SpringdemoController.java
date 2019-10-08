package com.github.complate.springdemo;

import com.github.complate.ComplateViewResolver;
import com.github.complate.NashornScriptingBridge;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.View;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@Controller
public class SpringdemoController {

    private Map<String, String> model;
    private ClassPathResource bundle = new ClassPathResource("/dist/views.js");
    private NashornScriptingBridge engine = new NashornScriptingBridge();
    private ComplateViewResolver resolver = new ComplateViewResolver(engine, bundle);

    @GetMapping("/")
    public void index(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        model = new HashMap<>();
        model.put("age", "99");
        model.put("name", "John Doe");
        View view = resolver.resolveViewName("Person", Locale.US);
        if (view != null) {
            view.render(model, req, resp);
        }
    }

    @GetMapping("/bootstrap")
    public void bootstrap(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        model = new HashMap<>();
        model.put("text", "Lorem Ipsum");
        model.put("title", "Bootstrap Sample");
        View view = resolver.resolveViewName("BootstrapSample", Locale.US);
        if (view != null) {
            view.render(model, req, resp);
        }
    }
}
