import Renderer from "complate-stream";

import Person from "./person";
import BootstrapSample from "./bootstrap-sample";

let renderer = new Renderer("<!DOCTYPE html>");

[Person, BootstrapSample].forEach(view => {
	renderer.registerView(view);
});

export default function render(stream, tag, params) {
    renderer.renderView(tag, params, stream, true, null);
    stream.flush();
}
