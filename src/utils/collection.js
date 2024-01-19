class Collection {
	constructor() {
		this.items = {};
	}

	add(key, item) {
		this.items[key] = item;
	}

	remove(key) {
		if (this.items.hasOwnProperty(key)) {
			delete this.items[key];
		}
	}

	all() {
		return Object.values(this.items);
	}

	find(callback) {
		const values = Object.values(this.items);
		return values.find(callback);
	}

	get(key) {
		return this.items[key];
	}

	indexOf(item) {
		const keys = Object.keys(this.items);
		return keys.indexOf(item);
	}

	size() {
		return Object.keys(this.items).length;
	}

	isEmpty() {
		return this.size() === 0;
	}

	clear() {
		this.items = {};
	}

	*[Symbol.iterator]() {
		yield* Object.values(this.items);
	}
}

module.exports = Collection;
