import { createElement } from "complate-stream";

import ContentPanel from "./panel";

export default [Person];

function Person(model) {
	return <html>
		<head>
			<meta charset="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<title>Playground</title>
			<link rel="stylesheet" href="/cdn/bundle.css" />
		</head>

		<body>
			<h1>Person</h1>
			<p>Name: {model.name}</p>
      <p>Age: {model.age}</p>
			<ContentPanel title="Bio">...some notes about this person...</ContentPanel>
		</body>
	</html>;
}
