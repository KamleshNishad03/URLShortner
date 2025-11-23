'use strict';

const input = document.getElementById('input_url');
const submit = document.getElementById('submit_button');
const result = document.getElementById('result');

let latestShortUrl = '';

const copyToClipboard = text => {
	if (!text) return Promise.resolve();
	if (navigator.clipboard && window.isSecureContext)
		return navigator.clipboard.writeText(text);
	const textarea = document.createElement('textarea');
	textarea.value = text;
	document.body.appendChild(textarea);
	textarea.select();
	document.execCommand('copy');
	document.body.removeChild(textarea);
	return Promise.resolve();
};

const shorten = url => fetch('/', {
	body: url,
	headers: { 'Content-Type': 'text/plain;charset=utf-8' },
	method: 'POST'
}).then(res => res.text().then(text => ({
	ok: res.ok,
	text
}))).then(({ ok, text }) => {
	if (!ok)
		throw Error(text);
	return text;
});

const validate = value => {
	if (!value || !value.trim())
		return { ok: false, error: Error('Enter a URL to continue') };
	try {
		const url = new URL(value);
		return { ok: true, url: url.href };
	} catch (err) {
		return { ok: false, error: Error('Use a valid URL (include https://)') };
	}
};

const dom = {
	clear() {
		input.value = '';
		latestShortUrl = '';
		result.className = 'result';
		result.textContent = '';
		submit.textContent = 'Shorten';
		submit.disabled = true;
	},
	error(err) {
		result.className = 'result error';
		result.textContent = err && err.message ? err.message : String(err);
		submit.disabled = false;
		submit.textContent = 'Shorten';
	},
	success(url, message = 'Your short link is ready') {
		latestShortUrl = url;
		result.className = 'result success';
		result.innerHTML = `
			<span class="result__label">${message}</span>
			<a class="result__link" href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>
		`;
		submit.disabled = false;
		submit.textContent = 'Copy';
	}
};

const handleInput = () => {
	const status = validate(input.value);
	if (status.ok) {
		submit.disabled = false;
		if (!latestShortUrl)
			result.className = 'result';
		if (result.classList.contains('error'))
			result.textContent = '';
	} else {
		submit.disabled = true;
		if (!input.value)
			return dom.clear();
		result.className = 'result error';
		result.textContent = status.error.message;
	}
};

const handleShorten = () => {
	if (submit.disabled)
		return;
	if (submit.textContent === 'Copy')
		return copyToClipboard(latestShortUrl)
			.then(() => dom.success(latestShortUrl, 'Copied to clipboard'))
			.catch(dom.error);
	submit.disabled = true;
	submit.textContent = 'Working…';
	shorten(input.value)
		.then(id => {
			const shortUrl = new URL(id, window.location.origin + '/').href;
			dom.success(shortUrl);
		})
		.catch(dom.error)
		.finally(() => {
			if (submit.textContent !== 'Copy')
				handleInput();
		});
};

input.addEventListener('input', handleInput);
submit.addEventListener('click', handleShorten);
