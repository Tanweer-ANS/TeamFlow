class APIFeatures {
    constructor(query, queryString) {
        this.query = query; // mongoose query
        this.queryString = queryString; // req.query
    }

    filter(baseFilter) {
        const queryObj = { ...this.queryString };

        const excludedFields = ["page", "limit", "sortBy", "order", "search"];
        excludedFields.forEach((el) => delete queryObj[el]);

        const filter = {
            ...baseFilter,
            ...queryObj,
        };

        this.query = this.query.find(filter);

        return this;
    }

    search(fields = []) {
        if (this.queryString.search) {
            const regex = new RegExp(this.queryString.search, "i");

            const searchQuery = {
                $or: fields.map((field) => ({
                    [field]: regex,
                })),
            };

            this.query = this.query.find(searchQuery);
        }

        return this;
    }

    sort() {
        const sortBy = this.queryString.sortBy || "createdAt";
        const order = this.queryString.order === "asc" ? 1 : -1;

        this.query = this.query.sort({ [sortBy]: order });

        return this;
    }

    paginate() {
        const page = Math.max(parseInt(this.queryString.page) || 1, 1);
        const limit = Math.min(parseInt(this.queryString.limit) || 10, 50);

        const skip = (page - 1) * limit;

        this.page = page;
        this.limit = limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        }
        return this;
    }   
    //Usage: ?fields=name,email to return only name and email fields
    //AND .limitFields() in controller after .filter() and before .sort() and .paginate()
    //Ex: GET /api/tasks?fields=title,status
}

export default APIFeatures;