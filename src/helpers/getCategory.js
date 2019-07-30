let getCategory = function (data, categoryToMatch) {
    let category = undefined;

    function recurse (data,categoryToMatch) {
        for (let i = 0; i < data.length; i++ ) {
                if (data[i].name.toLowerCase() === categoryToMatch.toLowerCase()) {
                  category = data[i];
                  break;
                } else if (data[i].categories !== undefined) {
                  if (data[i].categories.length > 0) {
                     recurse(data[i].categories, categoryToMatch)
                     if (category) {
                         break;
                     }
                  }
                }
            }
    }

    recurse(data,categoryToMatch);
    return category;

}

module.exports = getCategory
