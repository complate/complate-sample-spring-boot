import views from "./manifest";
import Renderer from "complate-stream";

let renderer = new Renderer("<!DOCTYPE html>");

views.forEach(view => {
	renderer.registerView(view);
});

export default function render(stream, tag, params) {
    renderer.renderView(tag, params, stream, true, null);
    stream.flush();
}
