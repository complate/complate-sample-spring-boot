import "./env"; // NB: must be imported (i.e. initialized) before macros
import views from "./manifest";
import Renderer from "complate-stream";

let renderer = new Renderer("<!DOCTYPE html>");

views.forEach(view => {
	renderer.registerView(view);
});

// Hack: only there to make sure faucet includes the runder function
console.log(render);

let render = function render(stream, tag, params) {
    renderer.renderView(tag, params, stream, true, null);
    stream.flush();
}
