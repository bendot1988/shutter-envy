/**
 * Heuristic classifier: Facebook Page post → Recent Work candidate?
 * Tuned for Shutter Envy (Leicestershire / East Midlands install posts).
 */

const SKIP_PATTERNS = [
	/\b(competition|giveaway|winner|winners|prize|raffle)\b/i,
	/\b(trade show|exhibition|open day|open weekend)\b/i,
	/\b(teaser|coming soon|save the date)\b/i,
	/\b(book (a|your) free|limited time|% off|sale now|half price)\b/i,
];

const INSTALL_PATTERNS = [
	/\b(finished|fitted|install(?:ed|ation)?|done (today|in|at)|new install)\b/i,
	/\b(before\s*(and|&|\/)\s*after|before and after)\b/i,
	/\b(returning customer|returning customers)\b/i,
	/\b(shutters?|blinds?|awning|plantation|tier[\s-]?on[\s-]?tier|full[\s-]?height|café|cafe[\s-]?height|cafe style|bifold|bay window|french doors?)\b/i,
];

const TOWN_PATTERNS = [
	/\b(leicester|loughborough|melton mowbray|melton|market harborough|harborough|mountsorrel|quorn|rothley|syston|birstall|barrow upon soar|barrow|sileby|groby|charnwood|woodhouse|burbage|lowdham|barlestone|queniborough|stamford|oakham|hinckley|coalville|shepshed|narborough|ashby|lutterworth|kibworth|fleckney|desford|ratby|anstey)\b/i,
];

/**
 * @param {{ message?: string, imageCount?: number, attachmentTypes?: string[] }} post
 * @returns {{ verdict: 'candidate' | 'skip', reasons: string[], score: number }}
 */
export function classifyPost(post) {
	const message = (post.message || '').trim();
	const imageCount = post.imageCount ?? 0;
	const types = post.attachmentTypes ?? [];
	const reasons = [];
	let score = 0;

	if (!message) {
		reasons.push('no caption');
		return { verdict: 'skip', reasons, score: -10 };
	}

	for (const re of SKIP_PATTERNS) {
		if (re.test(message)) {
			reasons.push(`skip phrase: ${re.source}`);
			score -= 5;
		}
	}

	if (score <= -5) {
		return { verdict: 'skip', reasons, score };
	}

	for (const re of INSTALL_PATTERNS) {
		if (re.test(message)) {
			reasons.push(`install signal: ${re.source}`);
			score += 2;
		}
	}

	for (const re of TOWN_PATTERNS) {
		if (re.test(message)) {
			reasons.push(`town signal`);
			score += 2;
			break;
		}
	}

	const isAlbum = types.includes('album');
	const isPhoto = types.includes('photo') || types.includes('share');
	const isVideoOnly =
		types.length > 0 &&
		types.every((t) => t === 'video_inline' || t === 'video');

	if (isAlbum && imageCount >= 2) {
		reasons.push(`album with ${imageCount} images`);
		score += 3;
	} else if (isPhoto && imageCount >= 1) {
		reasons.push('single photo');
		score += 1;
	}

	if (isVideoOnly && imageCount < 2) {
		reasons.push('video-only post');
		score -= 3;
	}

	if (imageCount === 0) {
		reasons.push('no downloadable images');
		score -= 4;
	}

	const verdict = score >= 3 ? 'candidate' : 'skip';
	return { verdict, reasons, score };
}

/**
 * Rough location guess for the draft brief (human will confirm).
 * @param {string} message
 * @returns {{ location?: string, locationTag?: string }}
 */
export function guessLocation(message) {
	const text = message || '';
	// Longer / more specific names first so "Market Harborough" wins over fragments.
	const towns = [
		['market harborough', 'Market Harborough', 'market-harborough'],
		['barrow upon soar', 'Barrow upon Soar', 'barrow-upon-soar'],
		['melton mowbray', 'Melton Mowbray', 'melton-mowbray'],
		['mountsorrel', 'Mountsorrel', 'mountsorrel'],
		['queniborough', 'Queniborough', 'queniborough'],
		['loughborough', 'Loughborough', 'loughborough'],
		['barlestone', 'Barlestone', 'barlestone'],
		['woodhouse', 'Woodhouse', 'woodhouse'],
		['charnwood', 'Charnwood', 'charnwood'],
		['lowdham', 'Lowdham', 'lowdham'],
		['birstall', 'Birstall', 'birstall'],
		['leicester', 'Leicester', 'leicester'],
		['rothley', 'Rothley', 'rothley'],
		['syston', 'Syston', 'syston'],
		['sileby', 'Sileby', 'sileby'],
		['burbage', 'Burbage', 'burbage'],
		['stamford', 'Stamford', 'stamford'],
		['hinckley', 'Hinckley', 'hinckley'],
		['shepshed', 'Shepshed', 'shepshed'],
		['quorn', 'Quorn', 'quorn'],
		['groby', 'Groby', 'groby'],
		['melton', 'Melton Mowbray', 'melton-mowbray'],
	];
	for (const [needle, label, tag] of towns) {
		if (new RegExp(`\\b${needle.replace(/\s+/g, '\\s+')}\\b`, 'i').test(text)) {
			return { location: label, locationTag: tag };
		}
	}
	return {};
}

/**
 * @param {string} message
 * @param {{ locationTag?: string }} guess
 */
export function suggestSlug(message, guess = {}) {
	const text = (message || '').toLowerCase();
	const bits = [];
	if (/\bbay\b/.test(text)) bits.push('bay');
	if (/tier[\s-]?on[\s-]?tier/.test(text)) bits.push('tier-on-tier');
	else if (/café[\s-]?height|cafe[\s-]?height|cafe style|café style/.test(text))
		bits.push('cafe-height');
	else if (/full[\s-]?height/.test(text)) bits.push('full-height');
	else if (/\bawning/.test(text)) bits.push('awning');
	else if (/\bblind/.test(text)) bits.push('blinds');
	else bits.push('shutter');
	if (/\bbathroom\b/.test(text)) bits.push('bathroom');
	else if (/\bbedroom\b/.test(text)) bits.push('bedroom');
	else if (/\bkitchen\b/.test(text)) bits.push('kitchen');
	else if (/\boffice\b/.test(text)) bits.push('office');
	else if (/\bconservatory\b/.test(text)) bits.push('conservatory');
	else if (/\blounge\b|\bliving\b/.test(text)) bits.push('lounge');
	else bits.push('installation');
	const place = guess.locationTag || 'leicestershire';
	bits.push('in', place);
	return bits.filter(Boolean).join('-').replace(/-+/g, '-');
}
