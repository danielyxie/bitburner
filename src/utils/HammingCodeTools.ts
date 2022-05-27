export function HammingEncode(data: number): string {

	const enc: Array<number> = [0];
	const data_bits: Array<any> = data.toString(2).split("").reverse();

	data_bits.forEach((e, i, a) => {
		a[i] = parseInt(e);
	});

	let k = data_bits.length;

	/* NOTE: writing the data like this flips the endianness, this is what the
	* original implementation by Hedrauta did so I'm keeping it like it was. */
	for(let i = 1; k > 0; i++) {
		if((i & (i - 1)) != 0) {
			enc[i] = data_bits[--k];
		} else {
			enc[i] = 0;
		}
	}

	let parity: any = 0;

	/* Figure out the subsection parities */
	for(let i = 0; i < enc.length; i++) {
		if(enc[i]) {
			parity ^= i;
		}
	}

	parity = parity.toString(2).split("").reverse();
	parity.forEach((e: any, i: any , a: any) => {
		a[i] = parseInt(e);
	});

	/* Set the parity bits accordingly */
	for(let i = 0; i < parity.length; i++) {
		enc[2 ** i] = parity[i] ? 1 : 0;
	}

	parity = 0;
	/* Figure out the overall parity for the entire block */
	for(let i = 0; i < enc.length; i++) {
		if(enc[i]) {
			parity++;
		}
	}

	/* Finally set the overall parity bit */
	enc[0] = parity % 2 == 0 ? 0 : 1;

	return enc.join("");
}

export function HammingEncodeProperly(data: number): string {
	/* How many bits do we need?
	 * n = 2^m
	 * k = 2^m - m - 1
	 * where k is the number of data bits, m the number
	 * of parity bits and n the number of total bits. */

	let m = 1;

	while((2 ** ((2 ** m) - m - 1)) < data) {
		m++;
	}

	const n: number = (2 ** m);
	const k: number = (2 ** m) - m - 1;

	const enc: Array<number> = [0];
	const data_bits: Array<any> = data.toString(2).split("").reverse();

	data_bits.forEach((e, i, a) => {
		a[i] = parseInt(e);
	});

	/* Flip endianness as in the original implementation by Hedrauta
	 * and write the data back to front
	 * XXX why do we do this? */
	for(let i = 1, j = k; i < n; i++) {
		if((i & (i - 1)) != 0) {
			enc[i] = data_bits[--j] ? data_bits[j] : 0;
		}
	}

	let parity: any = 0;

	/* Figure out the subsection parities */
	for(let i = 0; i < n; i++) {
		if(enc[i]) {
			parity ^= i;
		}
	}

	parity = parity.toString(2).split("").reverse();
	parity.forEach((e: any, i: any , a: any) => {
		a[i] = parseInt(e);
	});

	/* Set the parity bits accordingly */
	for(let i = 0; i < m; i++) {
		enc[2 ** i] = parity[i] ? 1 : 0;
	}

	parity = 0;
	/* Figure out the overall parity for the entire block */
	for(let i = 0; i < n; i++) {
		if(enc[i]) {
			parity++;
		}
	}

	/* Finally set the overall parity bit */
	enc[0] = parity % 2 == 0 ? 0 : 1;

	return enc.join("");
}

export function HammingDecode(data: string): number {
	let err = 0;
	const bits: Array<number> = [];

	/* TODO why not just work with an array of digits from the start? */
	for(const i in data.split("")) {
		const bit = parseInt(data[i]);
		bits[i] = bit;

		if(bit) {
			err ^= +i;
		}
	}

	/* If err != 0 then it spells out the index of the bit that was flipped */
	if(err) {
		/* Flip to correct */
		bits[err] = bits[err] ? 0 : 1;
	}

	/* Now we have to read the message, bit 0 is unused (it's the overall parity bit
	 * which we don't care about). Each bit at an index that is a power of 2 is
	 * a parity bit and not part of the actual message. */

	let ans = '';

	for(let i = 1; i < bits.length; i++) {
		/* i is not a power of two so it's not a parity bit */
		if((i & (i - 1)) != 0) {
			ans += bits[i];
		}
	}

	/* TODO to avoid ambiguity about endianness why not let the player return the extracted (and corrected)
	* data bits, rather than guessing at how to convert it to a decimal string? */
	return parseInt(ans, 2);
}
