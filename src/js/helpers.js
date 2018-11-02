const DEFAULT_XHR_HEADERS = {
	'Accept': 'application/json',
	'Content-Type': 'application/json'
};

export const POST = async (url, data = null, headers = DEFAULT_XHR_HEADERS) => {
	return await fetch(url, {
		method: 'POST',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers,
		body: data ? JSON.stringify(data) : null
	})
		.then(response => response)
		.catch(error => console.log(`Fetch error \n`, error));
};

export default POST;
