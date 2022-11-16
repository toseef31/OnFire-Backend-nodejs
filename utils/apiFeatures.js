class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  //get all tours/{{URL}}api/v1/tours?difficulty=easy //page sort limit excluded
  filter() {
    const queryObj = this.queryString.keyword
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    console.log(queryStr)
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  
  //get all tours/{{URL}}api/v1/tours?sort=duration
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }
//to get limitation on response
//get all tours/{{URL}}api/v1/tours?fields=name,duration,difficulty,price
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }
  //get all tours //{{URL}}api/v1/tours?page=2&limit=3
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;
