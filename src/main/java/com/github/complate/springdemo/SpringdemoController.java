package com.github.complate.springdemo;

import com.github.complate.ComplateViewResolver;
import com.github.complate.NashornScriptingBridge;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    private NashornScriptingBridge engine = new NashornScriptingBridge();
    private ClassPathResource bundle = new ClassPathResource("dist/views.js");
    private Map<String, String> model = new HashMap<>(77);

    private ComplateViewResolver resolver = new ComplateViewResolver(engine, bundle);

    @GetMapping("/")
    public void index(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        model.put("age", "28");
        model.put("name", "Ludvig");
        String viewTag = "Person";
        View view = resolver.resolveViewName(viewTag, Locale.US);
        if (view != null) {
            view.render(model, req, resp);
        }
    }
}
