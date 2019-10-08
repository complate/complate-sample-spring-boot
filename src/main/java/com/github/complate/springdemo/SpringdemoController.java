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

    private Map<String, String> model = new HashMap<>(2);
    private ClassPathResource bundle = new ClassPathResource("/dist/views.js");
    private NashornScriptingBridge engine = new NashornScriptingBridge();
    private ComplateViewResolver resolver = new ComplateViewResolver(engine, bundle);

    @GetMapping("/")
    public void index(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        model.put("age", "99");
        model.put("name", "John Doe");
        String viewTag = "Person";
        View view = resolver.resolveViewName(viewTag, Locale.US);
        if (view != null) {
            view.render(model, req, resp);
        }
    }
}
