const crypto = require('crypto');

// Simple in-memory store that mimics the Mongoose Model API
const movies = [];

function generateObjectId() {
    return crypto.randomBytes(12).toString('hex');
}

class Movie {
    constructor(data) {
        this._id = data._id || generateObjectId();
        this.name = data.name;
        this.summary = data.summary;
        this.movieImage = data.movieImage;
    }

    save() {
        movies.push(this);
        return Promise.resolve(this);
    }

    static find() {
        return {
            select() { return this; },
            exec() { return Promise.resolve([...movies]); }
        };
    }

    static findById(id) {
        const movie = movies.find(m => m._id === id || String(m._id) === String(id));
        return {
            select() { return this; },
            exec() { return Promise.resolve(movie || null); }
        };
    }

    static updateOne(filter, update) {
        return {
            exec() {
                const movie = movies.find(m => String(m._id) === String(filter._id));
                if (movie && update.$set) {
                    Object.assign(movie, update.$set);
                }
                return Promise.resolve({ nModified: movie ? 1 : 0 });
            }
        };
    }

    static deleteOne(filter) {
        return {
            exec() {
                const idx = movies.findIndex(m => String(m._id) === String(filter._id));
                if (idx !== -1) movies.splice(idx, 1);
                return Promise.resolve({ deletedCount: idx !== -1 ? 1 : 0 });
            }
        };
    }
}

module.exports = Movie;
