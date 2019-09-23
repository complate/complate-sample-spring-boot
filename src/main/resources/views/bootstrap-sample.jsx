import Panel from "./components/panel";
import ListGroup from "./components/list";
import DefaultLayout from "./components/layout";
import { createElement } from "complate-stream";

const STYLESHEETS = [{
	uri: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css",
	hash: "sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
}];

export function BootstrapSample({ title }) {
	return <DefaultLayout title={title} // eslint-disable-next-line indent
			stylesheets={STYLESHEETS} bodyClass="container-fluid">
		<h1>{title}</h1>

		<Panel title="Welcome">
			<p>lorem ipsum</p>

			<ListGroup>
				foo
				<em>HELLO</em>
				<b>foo</b>
			</ListGroup>
			<p>dolor sit amet</p>
		</Panel>
	</DefaultLayout>;
}
