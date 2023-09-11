export class Result<T> {};

export class Failure extends Result<void> {
    message: string;

    constructor(message: string) {
        super();
        this.message = message;
    }
};

export class Success<T> extends Result<T|null> {
    items: T|null;

    constructor(items: T|null = null) {
        super();
        this.items = items;
    }
};
