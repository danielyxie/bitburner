
export interface RNG {
	random(): number;
}

/*
 * very bad RNG, meant to be used as introduction to RNG manipulation. It has a
 * period of 1024.
 */
class RNG0 implements RNG {
	x: number;
	m = 1024;
	a = 341;
	c = 1;

	constructor() {
		this.x = 0;
		this.reset();
	}

	step() {
		this.x = (this.a*this.x+this.c) % this.m;
	}

	random(): number {
		this.step();
		return this.x/this.m;
	}

	reset() {
		this.x = (new Date()).getTime() % this.m;
	}
}

export const BadRNG: RNG0 = new RNG0();

/*
 * Wichmann–Hill PRNG
 * The period is 6e12.
 */
export class WHRNG implements RNG {
	s1 = 0;
	s2 = 0;
	s3 = 0;

	constructor(totalPlaytime: number) {
		// This one is seeded by the players total play time.
		const v: number = (totalPlaytime/1000)%30000;
		this.s1 = v;
		this.s2 = v;
		this.s3 = v;
	}

	step() {
		this.s1 = (171 * this.s1) % 30269;
		this.s2 = (172 * this.s2) % 30307;
		this.s3 = (170 * this.s3) % 30323;
	}

	random(): number {
		this.step();
		return (this.s1/30269.0 + this.s2/30307.0 + this.s3/30323.0)%1.0;
	}
}
