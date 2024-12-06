function APIFeatures(query, queryStr) {
  this.query = query;
  this.queryStr = queryStr;
}

APIFeatures.prototype.search = function () {
  var keyword = this.queryStr.keyword ? {
    name: {
      $regex: this.queryStr.keyword,
      $options: 'i'
    }
  } : {};

  this.query = this.query.find(Object.assign({}, keyword));
  return this;
};

APIFeatures.prototype.filter = function () {
  var queryCopy = Object.assign({}, this.queryStr);

  // Removing fields from the query
  var removeFields = ['keyword', 'limit', 'page'];
  removeFields.forEach(function (el) {
    delete queryCopy[el];
  });

  // Advance filter for price, ratings etc.
  var queryStr = JSON.stringify(queryCopy);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, function (match) {
    return '$' + match;
  });

  this.query = this.query.find(JSON.parse(queryStr));
  return this;
};

APIFeatures.prototype.pagination = function (resPerPage) {
  var currentPage = Number(this.queryStr.page) || 1;
  var skip = resPerPage * (currentPage - 1);

  this.query = this.query.limit(resPerPage).skip(skip);
  return this;
};

module.exports = APIFeatures;
