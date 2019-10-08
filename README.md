# complate-sample-spring-mvc

This sample repository demonstrates the server-side rendering of an [java spring](https://spring.io) application using the [corresponding adaptor](https://github.com/complate/complate-spring-mvc).

## Getting Started

```shell script
npm install                                # Install js dependencies
./mvnw clean install                       # Build java application
./mvnw dependency:copy-dependencies        # Collect dependencies
./node_modules/.bin/faucet                 # Build JSX view
./mvnw spring-boot:run                     # Start server
```
## Walkthrough

The project is based on the [Spring Initializr](https://start.spring.io/) template. The only interesting java class is
[SpringdemoController](src/main/java/com/github/complate/springdemo/SpringDemoConttroller.java), which defines the controller for the complate view rendering.

The controller defines the resolver, the main component that generates complate views. It requires the bundled javascript file (see below) and a scripting engine.

```java
    private ClassPathResource bundle = new ClassPathResource("/dist/views.js");
    private NashornScriptingBridge engine = new NashornScriptingBridge();
    private ComplateViewResolver resolver = new ComplateViewResolver(engine, bundle);
```

To be able to pass variables to the rendered view, we define the model.

```java
private Map<String, String> model = new HashMap<>(2);
```

The controller function itself populates the model, dispatches on the view using a view-tag, and renders the view.

```java
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
```

### The bundled js file

