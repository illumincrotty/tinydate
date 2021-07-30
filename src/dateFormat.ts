type dateToPartialString = { (date: Date): string };
type optionsForFormatter = {
	[key: string]: dateToPartialString | (() => string) | undefined;
};

/**
 * Creates a date formatter
 * @param format - a formatting string with replaceable text inside of brackets
 * @example "{MM}/{DD}/{YYYY}" "Created in {YYYY}" "last change at {HH}:{mm}"
 * @param options - An object where the keys are custom text to replace (can be anything besides brackets) and their values are the functions that should be called to replace that text (with a Date object as a parameter)
 * @returns a function that will format a date object
 * @defaults Default text replacements are as follows:
 *
 * {fff} -> milliseconds
 *
 * {ss} -> seconds
 *
 * {mm} -> minutes
 *
 * {HH} -> hours
 *
 * {DD} -> day of the month (number)
 *
 * {MM} -> Month (number)
 *
 * {YY} -> last two digits of the year
 *
 * {YYYY} -> full year
 * @examples
 * ```
 * import dateFormat from "date_format"
 *
 * const simpleFormat = dateFormat("{MM}{DD}{YYYY} {HH}:{mm}")
 *
 * const endOfMayanCalendar = new Date("12/21/2012")
 * endOfMayanCalendar.setHours(20)
 * endOfMayanCalendar.setMinutes(45)
 *
 * console.log(simpleFormat(endOfMayanCalendar))
 * //output 12/21/2012 10:45
 *
 *
 *const weekFormat = dateFormat(
 *  'The week from {MM}/{DD-3}-{MM}/{DD+4}',
 *  {
 *    'DD-3': (d: Date) => (d.getDate() - 3).toString(),
 *    'DD+4': (d: Date) => (d.getDate() + 3).toString(),
 *  }
 *);
 *console.log(weekFormat(new Date('2/15/2000')))
 *
 * //output: The week from 2/12-2/19
 * ```
 */
const formatter = (format: string, options: optionsForFormatter = {}) => {
	const _lastTwoDigits = -2;
	const _offByOne = 1;
	const _defaultFormatOptions: Map<string, dateToPartialString> = new Map([
		['fff', (d: Date) => d.getMilliseconds().toString().padStart(3, '0')],
		['ss', (d: Date) => d.getSeconds().toString().padStart(2, '0')],
		['mm', (d: Date) => d.getMinutes().toString().padStart(2, '0')],
		['HH', (d: Date) => d.getHours().toString().padStart(2, '0')],
		['DD', (d: Date) => d.getDate().toString().padStart(2, '0')],
		['MM', (d: Date) => (d.getMonth() + _offByOne).toString().padStart(2, '0')],
		[
			'YY',
			(d: Date) =>
				d.getFullYear().toString().slice(_lastTwoDigits).padStart(2, '0'),
		],
		['YYYY', (d: Date) => d.getFullYear().toString().padStart(4, '0')],
	]);

	const _optionsMap = new Map(Object.entries(options));

	const _split = format
		.replaceAll('{', ' {')
		.replaceAll('}', '} ')
		.split(/\W(?=\{)|(?<=\})\W/);

	const _mapped = _split.map((value) => {
		if (!(value.includes('{') && value.includes('}'))) return value;
		const trimmed = value.slice(1, -1);
		if (_optionsMap.has(trimmed)) return _optionsMap.get(trimmed);
		if (_defaultFormatOptions.has(trimmed)) return _defaultFormatOptions.get(trimmed);
		throw new TypeError(`Undefined key in format: ${trimmed}`);
	});

	/**
	 * Function that converts date objects to formatted strings
	 * @param {Date} date - the date you want to convert
	 * @returns {string} formatted date string
	 */
	return (date: Date): string => {
		return _mapped
			.map((_element) => {
				if (typeof _element === 'string') return _element;
				return _element!(date);
			})
			.join('');
	};
};

export { formatter, dateToPartialString, optionsForFormatter };
