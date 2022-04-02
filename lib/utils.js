const convertListOfStringToListOfRegex = (content) => {
  return (searchContentRegex = content.map((item) => {
    return new RegExp(`.*${item}.*`);
  }));
};

exports.convertListOfStringToListOfRegex = convertListOfStringToListOfRegex;
