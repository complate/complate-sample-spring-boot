import { createElement } from "complate-stream";

export default function DefaultLayout({ title, stylesheets, bodyClass }, ...children) {
	return <html>
		<head>
			<meta charset="utf-8" />
			<title>{title}</title>
			{renderStyleSheets(stylesheets)}
		</head>

		<body class={bodyClass}>
			{children}
		</body>
	</html>;
}

function renderStyleSheets(items) {
	if(!items || !items.length) {
		return;
	}

	return items.map(stylesheet => {
		if(stylesheet.hash) {
			var { uri, hash } = stylesheet; // eslint-disable-line no-var
		} else { // string
			uri = stylesheet;
		}

		/* eslint-disable indent */
		return <link rel="stylesheet" href={uri}
				integrity={hash} crossorigin="anonymous" />;
		/* eslint-enable indent */
	});
}
