type dateFormatter = { (date: Date): string };
interface formatOptions {
	[key: string]: dateFormatter | (() => string);
}

const _defaultFormatOptions: Map<string, dateFormatter> = new Map([
	['fff', (d: Date) => d.getMilliseconds().toString().padStart(3, '0')],
	['ss', (d: Date) => d.getSeconds().toString().padStart(2, '0')],
	['mm', (d: Date) => d.getMinutes().toString().padStart(2, '0')],
	['HH', (d: Date) => d.getHours().toString().padStart(2, '0')],
	['DD', (d: Date) => d.getDate().toString().padStart(2, '0')],
	['MM', (d: Date) => (d.getMonth() + 1).toString().padStart(2, '0')],
	['YY', (d: Date) => d.getFullYear().toString().slice(-2).padStart(2, '0')],
	['YYYY', (d: Date) => d.getFullYear().toString().padStart(4, '0')],
]);

/**
 * Date formatter factory, creates a date formatter
 * @param format - a formatting string with replaceable text inside of brackets
 * @example "{MM}/{DD}/{YYYY}" "Created in {YYYY}" "last change at {HH}:{mm}"
 * @param options - An object where the keys are custom text to replace (can be anything besides brackets) and their values are the functions that should be called to replace that text (with a Date object as a parameter)
 * @returns {dateFormatter} a function that will format a date object
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
import formatter from './index';
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
const _formatterFactory = (
	format: string,
	options: formatOptions = {}
): dateFormatter => {
	const _optionsMap = new Map(Object.entries(options));

	const _mapped = format
		.replaceAll('{', ' {') //add extra space in front of open brace
		.split(/\W(?=\{)|\}/) //split on the (just inserted) space before an open brace or a close brace (to keep the open brace for the next step)
		.map((value) => {
			if (!(value.charAt(0) === '{')) return value;
			const _trimmed = value.slice(1);
			if (_optionsMap.has(_trimmed)) return _optionsMap.get(_trimmed);
			if (_defaultFormatOptions.has(_trimmed))
				return _defaultFormatOptions.get(_trimmed);
			throw new TypeError(`Undefined key in format: ${_trimmed}`);
		});

	return (date: Date): string => {
		return _mapped
			.map((_element) => {
				if (typeof _element === 'string') return _element;
				return _element!(date);
			})
			.join('');
	};
};

export { _formatterFactory as formatterFactory, dateFormatter, formatOptions };
