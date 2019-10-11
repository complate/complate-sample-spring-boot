# complate-sample-spring-boot

 This sample repository demonstrates the server-side rendering of an
[java spring](https://spring.io) application using the
[corresponding adaptor](https://github.com/complate/complate-spring-mvc).

## Getting Started

```shell script
npm install                                # Install js dependencies
./mvnw clean package                       # Build java application
./mvnw spring-boot:run                     # Start server
```

The application should now be running on `localhost:8080`.

## Walkthrough

This sample project is based on [Spring Initializr](https://start.spring.io/).
The interesting parts is the views in `src/jsx` and the
[SpringdemoController class](src/main/java/com/github/complate/springdemo/SpringDemoController.java),
the controller that renders the views in response to HTTP requests.

### The Spring Controller

The Spring controller resolves JSX views from a bundeled javascript file under
the default path `templates/complate/bundle.js`.

The request handler populates the model and returns both the both the view and
the model at once as a `ModelAndView` object.

```java
@GetMapping("/")
public ModelAndView index() throws Exception {
    model = new HashMap<>();
    model.put("age", "99");
    model.put("name", "John Doe");
    return new ModelAndView("Person", model);
}
```

The Spring framework takes care of
rendering the JSX views using the
[configured](src/main/java/com/github/complate/springdemo/SpringdemoConfiguration.java)
`ComplateViewResolver`,
imported from the [java spring-mvc complate adaptor](https://github.com/complate/complate-spring-mvc).

This sample project specifies two mapping functions with their corresponding
views, a "person view" corresponding to `/` and a "bootstrap view"
corresponding to `/bootstrap`.

### The JSX Views

The JSX views themselves exist in `src/jsx` and is bundled together by
 [faucet](http://faucet-pipeline.org) using `npm run compile`. The [faucet
 example configuration](faucet.config.js) in this project shows how to configure
 faucet to generate a javascript file compatible with the Nashorn Scripting
 Engine, which the `ComplateViewResolver` uses internally.

The entry level file for faucet is `index.js` and the only relevant function to
the backend is `render`. This endpoint requires three arguments: `stream` which
is a writable stream corresponding to response of the spring application, `tag`
which is the name of the view to render (the `viewName` argument) in the
`ModelAndView` constructor, and `params` which is the view parameters (the
`model` argument in the `Modelandview` constructor.

```javascript
export default function render(stream, tag, params) {
    renderer.renderView(tag, params, stream, true, null);
    stream.flush();
}
```

The `render` function uses a `renderer` from the
[complate-stream](https://github.com/complate/complate-stream) library, the
component that actually renders the HTML. In order for this to work, the defined
views have first to be registred using the same renderer.

```javascript
import Renderer from "complate-stream";
import Person from "./person";
import BootstrapSample from "./bootstrap-sample";

let renderer = new Renderer("<!DOCTYPE html>");

[Person, BootstrapSample].forEach(view => {
	renderer.registerView(view);
});
```
