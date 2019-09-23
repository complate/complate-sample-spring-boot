import DefaultLayout from "./components/layout";
import { createElement } from "complate-stream";

export function SiteIndex({ title, _layout }) {
	let content = <p>
		lorem ipsum dolor sit amet
	</p>;

	return _layout === false ? content : <DefaultLayout title={title}>
		<h1>{title}</h1>

		{content}
	</DefaultLayout>;
}
