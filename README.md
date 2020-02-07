# complate-sample-spring-boot

 This sample repository demonstrates the server-side rendering of an
[java spring](https://spring.io) application using the
[corresponding adaptor](https://github.com/complate/complate-spring).

## Getting Started

```shell script
npm install                                # Install js dependencies
./mvnw spring-boot:run                     # Start server
```

The application should now be running on `localhost:8080`.

## Walkthrough

This sample project is based on [Spring Initializr](https://start.spring.io/).
The interesting parts is the views in `src/jsx` and the
[SampleController class](src/main/java/org/complate/spring/boot/sample/SampleController.java),
the controller that renders the views in response to HTTP requests.

### The Spring Controller

The Spring controller resolves JSX views from a bundeled javascript file under
the path `templates/complate/bundle.js`.

The request handler returns the view and model at once as a `ModelAndView`
object.

```java
@GetMapping("/")
public ModelAndView index() {
    return new ModelAndView("Person")
            .addObject("age", 99)
            .addObject("name", "John Doe");
}
```

The Spring framework takes care of rendering the JSX views using the
[configured](src/main/java/org/complate/spring/boot/sample/ComplateConfiguration.java)
`ComplateViewResolver`, imported from the
[spring complate adaptor](https://github.com/complate/complate-spring).

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
export default function render(view, params, stream) {
    renderer.renderView(view, params, stream);
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
