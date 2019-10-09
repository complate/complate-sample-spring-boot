import { createElement } from "complate-stream";

export default function ListGroup(_, ...items) {
	return <ul class="list-group">
		{items.map(item => {
			return <li class="list-group-item">{item}</li>;
		})}
	</ul>;
}
